import 'dotenv/config'
import express from 'express'
import multer from 'multer'
import nodemailer from 'nodemailer'

const app = express()
app.disable('x-powered-by')

const PORT = process.env.PORT || 3001
const IS_PROD = process.env.NODE_ENV === 'production' || process.argv.includes('--prod')

/* ------------------------------------------------------------------ *
 * Configuration (server-side only — never exposed to the client)
 * ------------------------------------------------------------------ */
const HR_EMAIL = process.env.HR_EMAIL || ''
const SMTP_HOST = process.env.SMTP_HOST || ''
const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
const SMTP_SECURE = process.env.SMTP_SECURE === 'true'
const SMTP_USER = process.env.SMTP_USER || ''
const SMTP_PASS = process.env.SMTP_PASS || ''
const COMPANY_NAME = process.env.COMPANY_NAME || 'Quantivo Solutions'

const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5 MB

const ALLOWED_EXT = ['.pdf', '.doc', '.docx']
const ALLOWED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

/** Strip control chars + tags, collapse whitespace, cap length. */
function sanitize(value, maxLen = 2000) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<[^>]*>/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen)
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function extname(name) {
  const i = name.lastIndexOf('.')
  return i === -1 ? '' : name.slice(i).toLowerCase()
}

/**
 * Defence in depth: verify the declared MIME matches a real document
 * signature rather than trusting client-supplied headers alone.
 *  - PDF starts with "%PDF"
 *  - DOCX is a ZIP container ("PK\x03\x04")
 *  - DOC (legacy OLE2) starts with D0 CF 11 E0
 */
function hasValidSignature(buffer, ext) {
  if (!buffer || buffer.length < 4) return false
  if (ext === '.pdf') return buffer.subarray(0, 4).toString('latin1') === '%PDF'
  if (ext === '.docx') return buffer[0] === 0x50 && buffer[1] === 0x4b
  if (ext === '.doc') {
    return (
      buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0
    )
  }
  return false
}

/* ------------------------------------------------------------------ *
 * Simple in-memory rate limiter (per IP) to prevent upload abuse
 * ------------------------------------------------------------------ */
const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000)
const MAX_PER_WINDOW = Number(process.env.RATE_LIMIT_MAX || 5)
const hits = new Map()

function rateLimit(req, res, next) {
  const ip = req.ip || 'unknown'
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return next()
  }
  if (entry.count >= MAX_PER_WINDOW) {
    return res.status(429).json({
      ok: false,
      error: 'Too many applications submitted. Please try again in a few minutes.',
    })
  }
  entry.count += 1
  return next()
}

/* ------------------------------------------------------------------ *
 * Upload handling — memory only, so resumes are never written to a
 * publicly reachable directory.
 * ------------------------------------------------------------------ */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: 1, fields: 20 },
  fileFilter(req, file, cb) {
    const ext = extname(file.originalname || '')
    const mime = (file.mimetype || '').toLowerCase()
    if (!ALLOWED_EXT.includes(ext) || !ALLOWED_MIME.includes(mime)) {
      return cb(new Error('INVALID_FILE_TYPE'))
    }
    return cb(null, true)
  },
})

/* ------------------------------------------------------------------ *
 * Mail transport (created lazily so the server boots without secrets)
 * ------------------------------------------------------------------ */
let transporter = null

function getTransporter() {
  if (transporter) return transporter
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  return transporter
}

/* ------------------------------------------------------------------ *
 * Routes
 * ------------------------------------------------------------------ */

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mailConfigured: Boolean(getTransporter() && HR_EMAIL) })
})

app.post('/api/careers/apply', rateLimit, upload.single('resume'), async (req, res) => {
  const mail = getTransporter()

  // Fail loudly rather than showing a false success.
  if (!mail || !HR_EMAIL) {
    return res.status(503).json({
      ok: false,
      error:
        'Resume submissions are temporarily unavailable. Please reach us via the Contact page and we will add you to our talent pool.',
    })
  }

  const name = sanitize(req.body.fullName, 120)
  const email = sanitize(req.body.email, 160)
  const phone = sanitize(req.body.phone, 40)
  const position = sanitize(req.body.position, 160)
  const message = sanitize(req.body.message, 3000)

  /* ---------------- Validation ---------------- */
  const errors = {}
  if (!name) errors.fullName = 'Full name is required.'
  if (!email) {
    errors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!phone) {
    errors.phone = 'Phone number is required.'
  } else if (!/^\+?[\d\s()-]{7,20}$/.test(phone)) {
    errors.phone = 'Please enter a valid phone number with country code.'
  }
  if (!position) errors.position = 'Please select a position.'

  const file = req.file
  if (!file) {
    errors.resume = 'Please attach your resume.'
  } else {
    const ext = extname(file.originalname)
    if (!ALLOWED_EXT.includes(ext)) {
      errors.resume = 'Only PDF, DOC or DOCX files are accepted.'
    } else if (file.size > MAX_FILE_BYTES) {
      errors.resume = 'Resume must be 5 MB or smaller.'
    } else if (!hasValidSignature(file.buffer, ext)) {
      errors.resume = 'That file does not look like a valid document.'
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, errors })
  }

  /* ---------------- Build email ---------------- */
  const row = (label, value) =>
    `<tr><td style="padding:8px 16px 8px 0;color:#5B6475;white-space:nowrap;vertical-align:top;">${label}</td>` +
    `<td style="padding:8px 0;color:#171717;font-weight:600;">${escapeHtml(value)}</td></tr>`

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#FAFAFA;padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#FFFFFF;border:1px solid #EAEAEA;border-radius:14px;padding:28px;">
      <h2 style="margin:0 0 4px;color:#171717;font-size:20px;">New Resume Submission</h2>
      <p style="margin:0 0 20px;color:#5B6475;font-size:14px;">${escapeHtml(COMPANY_NAME)} careers portal</p>
      <table style="width:100%;border-collapse:collapse;font-size:15px;">
        ${row('Full Name', name)}
        ${row('Email', email)}
        ${row('Phone', phone)}
        ${row('Position', position)}
      </table>
      <h3 style="margin:22px 0 8px;color:#171717;font-size:15px;">Message</h3>
      <div style="color:#5B6475;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message || '—')}</div>
      <p style="margin:22px 0 0;color:#5B6475;font-size:13px;">Resume attached: ${escapeHtml(file.originalname)}</p>
    </div>
  </div>`

  const text = [
    `New Resume Submission — ${COMPANY_NAME}`,
    '',
    `Full Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Position: ${position}`,
    '',
    'Message:',
    message || '—',
    '',
    `Resume attached: ${file.originalname}`,
  ].join('\n')

  try {
    const info = await mail.sendMail({
      from: `"${COMPANY_NAME} Careers" <${SMTP_USER}>`,
      to: HR_EMAIL,
      replyTo: email,
      subject: `Resume Application — ${position} — ${name}`,
      text,
      html,
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype,
        },
      ],
    })

    // Only report success once the provider actually accepted the message.
    const accepted = Array.isArray(info.accepted) && info.accepted.length > 0
    if (!accepted) {
      return res.status(502).json({
        ok: false,
        error: 'We could not deliver your application right now. Please try again shortly.',
      })
    }

    return res.json({ ok: true, message: 'Application sent.' })
  } catch (err) {
    // Log the failure reason only — never the applicant's resume contents.
    console.error('[careers/apply] delivery failed:', err && err.message)
    return res.status(502).json({
      ok: false,
      error: 'We could not send your application right now. Please try again shortly.',
    })
  }
})

/* ------------------------------------------------------------------ *
 * Multer error handling
 * ------------------------------------------------------------------ */
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ ok: false, errors: { resume: 'Resume must be 5 MB or smaller.' } })
    }
    return res.status(400).json({ ok: false, error: 'Upload failed. Please try again.' })
  }
  if (err && err.message === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      ok: false,
      errors: { resume: 'Only PDF, DOC or DOCX files are accepted.' },
    })
  }
  console.error('[server] unhandled error:', err && err.message)
  return res.status(500).json({ ok: false, error: 'Something went wrong. Please try again.' })
})

/* Only serve the built SPA when running in production behind this server. */
if (IS_PROD) {
  app.use(express.static('dist'))
}

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`)
  console.log(
    `[server] mail configured: ${Boolean(getTransporter() && HR_EMAIL)}` +
      ' (set SMTP_* and HR_EMAIL in .env to enable resume delivery)',
  )
})