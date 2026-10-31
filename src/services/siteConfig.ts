/**
 * Central, public site configuration.
 *
 * Everything here is already-verified information that appears elsewhere
 * in the project (Contact component + Footer). Nothing is invented.
 *
 * Secrets (SMTP credentials, API keys) live ONLY in the server-side `.env`
 * and are never imported by client code.
 */

export const companyContact = {
  email: 'techquantivosolutions@gmail.com',

  /** Display format for all company contact numbers. */
  phoneDisplay: [
    '+91 90039 12721',
    '+91 93613 68600',
    '+91 75988 93911',
  ],

  /** E.164 digits-only format for tel: links. */
  phoneDigits: [
    '919003912721',
    '919361368600',
    '917598893911',
  ],

  location: 'Kanyakumari, India',
  supportHours: '24/7 for hosting clients',
} as const;

/**
 * WhatsApp click-to-chat number: digits only, country code included, no
 * "+", spaces or dashes.
 *
 * Resolution order:
 *   1. VITE_COMPANY_WHATSAPP_NUMBER (public, non-secret)
 *   2. the primary company number in `phoneDigits`
 */
export const WHATSAPP_NUMBER: string = String(
  import.meta.env.VITE_COMPANY_WHATSAPP_NUMBER || companyContact.phoneDigits[0] || '',
)
  .replace(/\D/g, '')

/** Every company number in display format. */
export const COMPANY_PHONES: string[] = [...companyContact.phoneDisplay]

/** Roles advertised on the careers page. Single source of truth. */
export const careerOpenings = [
  { title: 'Frontend Developer', type: 'Full-time', location: 'Nagercoil / Remote' },
  { title: 'Backend Developer', type: 'Full-time', location: 'Nagercoil / Remote' },
  { title: 'UI/UX Designer', type: 'Full-time', location: 'Nagercoil / Remote' },
] as const

export const GENERAL_APPLICATION = 'General Application'

export const careerPositions: string[] = [
  ...careerOpenings.map(o => o.title),
  GENERAL_APPLICATION,
]

/** Accepted resume types + limits (mirrored by the server, which is authoritative). */
export const RESUME_ACCEPT = '.pdf,.doc,.docx'
export const RESUME_ACCEPT_LABEL = 'PDF, DOC, DOCX'
export const RESUME_MAX_BYTES = 5 * 1024 * 1024

/**
 * Build a WhatsApp click-to-chat URL.
 * https://wa.me/<number>?text=<url-encoded message>
 */
export const WHATSAPP_GROUP_URL =
  'https://chat.whatsapp.com/KlWOwLmQEbM44PVRuTSZN3'

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}