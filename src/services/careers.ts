import { RESUME_ACCEPT, RESUME_MAX_BYTES } from './siteConfig'

export interface ResumeApplication {
  fullName: string
  email: string
  phone: string
  position: string
  message: string
  resume: File
}

export interface ApplyResult {
  ok: boolean
  message?: string
  fieldErrors?: Record<string, string>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/
const ALLOWED_EXT = ['.pdf', '.doc', '.docx']
const ALLOWED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/** Client-side pre-flight validation. The server re-validates everything. */
export function validateApplication(data: Omit<ResumeApplication, 'resume'> & { resume: File | null }) {
  const errors: Record<string, string> = {}

  if (!data.fullName.trim()) errors.fullName = 'Full name is required.'

  if (!data.email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required.'
  } else if (!PHONE_RE.test(data.phone.trim())) {
    errors.phone = 'Enter a valid number with country code.'
  }

  if (!data.position) errors.position = 'Please select a position.'

  if (!data.resume) {
    errors.resume = 'Please attach your resume.'
  } else {
    const file = data.resume
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()
    if (!ALLOWED_EXT.includes(ext) || !ALLOWED_MIME.includes(file.type)) {
      errors.resume = 'Only PDF, DOC or DOCX files are accepted.'
    } else if (file.size > RESUME_MAX_BYTES) {
      errors.resume = `Resume must be 5 MB or smaller (yours is ${formatBytes(file.size)}).`
    }
  }

  return errors
}

/**
 * Submit the application. Resolves only after the server confirms the
 * mail provider accepted the message — never optimistically.
 */
export async function submitResumeApplication(
  data: ResumeApplication,
  signal?: AbortSignal,
): Promise<ApplyResult> {
  const form = new FormData()
  form.append('fullName', data.fullName.trim())
  form.append('email', data.email.trim())
  form.append('phone', data.phone.trim())
  form.append('position', data.position)
  form.append('message', data.message.trim())
  form.append('resume', data.resume)

  let res: Response
  try {
    res = await fetch('/api/careers/apply', { method: 'POST', body: form, signal })
  } catch {
    return {
      ok: false,
      message: 'We could not reach the server. Check your connection and try again.',
    }
  }

  let payload: ApplyResult = { ok: false }
  try {
    payload = (await res.json()) as ApplyResult
  } catch {
    payload = { ok: false }
  }

  if (!res.ok) {
    return {
      ok: false,
      message: payload.message || 'Something went wrong. Please try again.',
      fieldErrors: payload.fieldErrors,
    }
  }

  return { ok: true, message: payload.message || 'Application sent.' }
}

export { RESUME_ACCEPT }