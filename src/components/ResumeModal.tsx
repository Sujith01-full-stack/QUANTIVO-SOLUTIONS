import { useEffect, useRef, useState, FormEvent } from 'react'
import {
  X,
  Upload,
  Send,
  CheckCircle2,
  Mail,
  Clock,
  MessageCircle,
  FileText,
  AlertCircle,
  Info,
} from 'lucide-react'
import Input from './UI/Input'
import Textarea from './UI/Textarea'
import CountrySelect from './UI/CountrySelect'
import {
  RESUME_ACCEPT,
  RESUME_ACCEPT_LABEL,
  RESUME_MAX_BYTES,
  careerPositions,
  companyContact,
  buildWhatsAppUrl,
} from '../services/siteConfig'
import {
  submitResumeApplication,
  validateApplication,
  formatBytes,
  type ResumeApplication,
} from '../services/careers'

type Status = 'form' | 'submitting' | 'success'

interface Props {
  open: boolean
  onClose: () => void
  defaultPosition?: string
}

const EMPTY = {
  fullName: '',
  email: '',
  phone: '',
  countryCode: '+91',
  countryName: 'India',
  position: '',
  message: '',
}

export default function ResumeModal({ open, onClose, defaultPosition = '' }: Props) {
  const [form, setForm] = useState({ ...EMPTY, position: defaultPosition })
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>('form')
  const [submitError, setSubmitError] = useState('')
  const [sent, setSent] = useState<{ name: string; email: string; position: string } | null>(null)

  const firstFieldRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset when the modal is (re)opened for a different role.
  useEffect(() => {
    if (!open) return
    setForm({ ...EMPTY, position: defaultPosition })
    setFile(null)
    setErrors({})
    setSubmitError('')
    setStatus('form')
    setSent(null)
    const t = window.setTimeout(() => {
      const el = firstFieldRef.current?.querySelector('input')
      el?.focus()
    }, 60)
    return () => window.clearTimeout(t)
  }, [open, defaultPosition])

  // Lock scroll + support Escape while the dialog is open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && status !== 'submitting') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, status, onClose])

  // Return focus to the trigger when closed.
  useEffect(() => {
    if (!open && closeRef.current) closeRef.current.blur()
  }, [open])

  if (!open) return null

  const set = (key: keyof typeof EMPTY, value: string) => {
    setForm(f => ({ ...f, [key]: value }))
    setErrors(e => {
      if (!e[key]) return e
      const next = { ...e }
      delete next[key]
      return next
    })
  }

  const handleFile = (next: File | null) => {
    setSubmitError('')
    if (!next) {
      setFile(null)
      return
    }
    const ext = next.name.slice(next.name.lastIndexOf('.')).toLowerCase()
    const allowedExt = ['.pdf', '.doc', '.docx']
    if (!allowedExt.includes(ext)) {
      setFile(null)
      setErrors(e => ({ ...e, resume: 'Only PDF, DOC or DOCX files are accepted.' }))
      return
    }
    if (next.size > RESUME_MAX_BYTES) {
      setFile(null)
      setErrors(e => ({
        ...e,
        resume: `Resume must be 5 MB or smaller (yours is ${formatBytes(next.size)}).`,
      }))
      return
    }
    setFile(next)
    setErrors(e => {
      const next2 = { ...e }
      delete next2.resume
      return next2
    })
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'submitting') return

    // Validate phone: exactly 10 digits
    const phoneDigits = form.phone.replace(/\D/g, '')
    if (!phoneDigits || phoneDigits.length !== 10) {
      setErrors(e => ({ ...e, phone: 'Please enter a valid 10-digit phone number.' }))
      return
    }

    const fullPhone = `${form.countryCode}${phoneDigits}`
    const found = validateApplication({
      fullName: form.fullName,
      email: form.email,
      phone: phoneDigits,
      position: form.position,
      message: form.message,
      resume: file,
    })

    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }

    setErrors({})
    setSubmitError('')
    setStatus('submitting')

    const payload: ResumeApplication = {
      fullName: form.fullName,
      email: form.email,
      phone: fullPhone,
      countryCode: form.countryCode,
      countryISO: form.countryName ? form.countryName.slice(0, 2).toUpperCase() : 'IN',
      position: form.position,
      message: form.message,
      resume: file as File,
    }

    const result = await submitResumeApplication(payload)

    if (result.ok) {
      // Only clear the form once the server confirms delivery.
      setSent({ name: form.fullName.trim(), email: form.email.trim(), position: form.position })
      setStatus('success')
      setForm({ ...EMPTY })
      setFile(null)
    } else {
      setStatus('form')
      setSubmitError(result.message || 'We could not send your application. Please try again.')
      if (result.fieldErrors) setErrors(result.fieldErrors)
    }
  }

  const waMessage = sent
    ? `Hello Quantivo Solutions, I have just submitted a resume application for the ${sent.position} position.\n\n` +
      `Name: ${sent.name}\n` +
      `Email: ${sent.email}\n\n` +
      `I have emailed my resume to your HR team. I can also attach it here if required.`
    : ''

  const dismiss = () => {
    if (status !== 'submitting') onClose()
  }

  return (
    <div className="hr-modal-backdrop" onMouseDown={e => e.target === e.currentTarget && dismiss()}>
      <div
        className="hr-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hr-modal-title"
        ref={dialogRef}
      >
        <button
          type="button"
          className="hr-modal-close"
          onClick={dismiss}
          aria-label="Close resume form"
          disabled={status === 'submitting'}
        >
          <X size={20} />
        </button>

        {/* ---------------- SUCCESS ---------------- */}
        {status === 'success' && sent ? (
          <div className="hr-modal-body hr-modal-success">
            <span className="hr-success-icon" aria-hidden="true">
              <CheckCircle2 size={30} />
            </span>
            <h2 id="hr-modal-title" className="hr-modal-title">
              Application Submitted!
            </h2>
            <p className="hr-success-text">
              Thank you for your interest in joining Quantivo Solutions. Your resume has been
              successfully sent to our HR team.
            </p>

            <div className="hr-next-box">
              <h3>What happens next?</h3>
              <p>
                <Mail size={15} aria-hidden="true" />
                Your application has been sent to our company email.
              </p>
              <p>
                <Clock size={15} aria-hidden="true" />
                We will review your application within 5 working days.
              </p>
            </div>

            <a
              className="btn-whatsapp"
              href={buildWhatsAppUrl(waMessage)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Continue on WhatsApp
            </a>
            <p className="hr-whatsapp-note">
              Chat with us on WhatsApp for faster communication. WhatsApp cannot attach your
              resume automatically — your resume has been emailed, and you can also attach it here
              manually if needed.
            </p>

            <button type="button" className="btn btn-outline hr-modal-close-btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            {/* ---------------- HEADER ---------------- */}
            <div className="hr-modal-header">
              <h2 id="hr-modal-title" className="hr-modal-title">
                Send Your <span>Resume</span>
              </h2>
              <p className="hr-modal-sub">
                Share your details with us and we'll get back to you soon.
              </p>
            </div>

            {/* ---------------- LOADING ---------------- */}
            {status === 'submitting' ? (
              <div className="hr-modal-body hr-modal-loading">
                <span className="hr-loading-illustration" aria-hidden="true">
                  <FileText size={34} />
                  <Send size={22} className="hr-loading-plane" />
                </span>
                <h3>Submitting Your Application…</h3>
                <p>Please wait while we send your details to our HR team.</p>
                <div
                  className="hr-progress"
                  role="progressbar"
                  aria-label="Submitting application"
                >
                  <span />
                </div>
                <div className="hr-info-box">
                  <Info size={16} aria-hidden="true" />
                  <span>
                    Your resume is being sent to our email and we will notify you shortly.
                  </span>
                </div>
              </div>
            ) : (
              /* ---------------- FORM ---------------- */
              <form className="hr-modal-body hr-form" onSubmit={onSubmit} noValidate>
                {submitError && (
                  <div className="hr-alert hr-alert-error" role="alert">
                    <AlertCircle size={16} aria-hidden="true" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div ref={firstFieldRef}>
                  <div className="form-row">
                    <Input
                      id="hr-name"
                      label="Full Name *"
                      value={form.fullName}
                      onChange={e => set('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? 'err-hr-name' : undefined}
                    />
                    <Input
                      id="hr-email"
                      type="email"
                      label="Email Address *"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="Enter your email address"
                      autoComplete="email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'err-hr-email' : undefined}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="hr-field-error" id="err-hr-name">
                      {errors.fullName}
                    </p>
                  )}
                  {errors.email && (
                    <p className="hr-field-error" id="err-hr-email">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="hr-country">Country Code *</label>
                    <CountrySelect
                      id="hr-country"
                      value={form.countryCode}
                      dialCode={form.countryCode}
                      onChange={country => {
                        set('countryCode', country.dialCode)
                        set('countryName', country.name)
                      }}
                      required
                    />
                    {errors.countryCode && (
                      <p className="hr-field-error" id="err-hr-country">
                        {errors.countryCode}
                      </p>
                    )}
                  </div>
                  <div className="form-group">
                    <Input
                      label="Phone Number *"
                      id="hr-phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={form.phone}
                      onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit phone number"
                      autoComplete="tel"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'err-hr-phone' : undefined}
                    />
                    {errors.phone && (
                      <p className="hr-field-error" id="err-hr-phone">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="hr-position">Position Applying For *</label>
                  <select
                    id="hr-position"
                    value={form.position}
                    onChange={e => set('position', e.target.value)}
                    aria-invalid={!!errors.position}
                    aria-describedby={errors.position ? 'err-hr-position' : undefined}
                  >
                    <option value="">Select a position</option>
                    {careerPositions.map(p => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {errors.position && (
                    <p className="hr-field-error" id="err-hr-position">
                      {errors.position}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="hr-resume">Upload Resume *</label>
                  <div
                    className={`hr-dropzone${errors.resume ? ' has-error' : ''}${
                      file ? ' has-file' : ''
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      id="hr-resume"
                      type="file"
                      accept={RESUME_ACCEPT}
                      onChange={e => handleFile(e.target.files?.[0] ?? null)}
                      className="hr-file-input"
                      aria-invalid={!!errors.resume}
                      aria-describedby={errors.resume ? 'err-hr-resume' : 'hr-resume-hint'}
                    />
                    {file ? (
                      <div className="hr-file-info">
                        <FileText size={20} aria-hidden="true" />
                        <span className="hr-file-name">{file.name}</span>
                        <span className="hr-file-size">{formatBytes(file.size)}</span>
                        <button
                          type="button"
                          className="hr-file-clear"
                          onClick={() => {
                            handleFile(null)
                            if (fileInputRef.current) fileInputRef.current.value = ''
                          }}
                          aria-label={`Remove ${file.name}`}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="hr-dropzone-hint">
                        <Upload size={22} aria-hidden="true" />
                        <strong>Choose your resume</strong>
                        <span id="hr-resume-hint">
                          ({RESUME_ACCEPT_LABEL}) — max size 5 MB
                        </span>
                      </div>
                    )}
                  </div>
                  {errors.resume && (
                    <p className="hr-field-error" id="err-hr-resume">
                      {errors.resume}
                    </p>
                  )}
                </div>

                <Textarea
                  id="hr-message"
                  label="Message (Optional)"
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />

                <div className="hr-form-actions">
                  <button type="button" className="btn btn-outline" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Application
                    <Send size={16} aria-hidden="true" />
                  </button>
                </div>

                <p className="hr-privacy-note">
                  Your details are sent securely to {companyContact.email} and are never shared.
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}
