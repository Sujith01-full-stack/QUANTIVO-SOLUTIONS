import { useState, useMemo, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  FileText,
  X,
  ArrowRight,
  CheckCircle,
  Globe,
  Link as LinkIcon,
} from 'lucide-react'
import { submitContactForm } from '../services/contact'
import { offerings } from '../services/website'
import { companyContact } from '../services/siteConfig'
import { fadeInUp, staggerContainer, slideInLeft } from '../lib/animations'
import Input from '../components/UI/Input'
import Textarea from '../components/UI/Textarea'

// ─── Constants (each declared exactly once) ──────────────────────────────

const serviceOptions = [
  ...offerings.map(o => o.title),
  'Full Support & Maintenance',
  'Other',
]

const countryOptions = [
  { code: 'US', name: 'United States' },
  { code: 'IN', name: 'India' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'OTHER', name: 'Other' },
]

const contactMethodOptions = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'whatsapp', label: 'WhatsApp' },
]

const budgetOptions = [
  { value: '', label: 'Select Budget Range' },
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-15k', label: '$5,000 - $15,000' },
  { value: '15k-50k', label: '$15,000 - $50,000' },
  { value: '50k-100k', label: '$50,000 - $100,000' },
  { value: '100k+', label: '$100,000+' },
  { value: 'custom', label: 'Custom / Not Sure' },
]

const timelineOptions = [
  { value: '', label: 'Select Timeline' },
  { value: 'asap', label: 'ASAP' },
  { value: '1-3-months', label: '1-3 Months' },
  { value: '3-6-months', label: '3-6 Months' },
  { value: '6-12-months', label: '6-12 Months' },
  { value: 'flexible', label: 'Flexible' },
]

const planLabels: Record<string, string> = {
  starter: 'Starter Plan ($999)',
  business: 'Business Plan ($2,999)',
  enterprise: 'Enterprise Plan (Custom)',
}

const serviceDetails: Record<string, { features: string[]; description: string }> = {
  'E-Commerce Development': {
    features: [
      'Online store development',
      'Product and category management',
      'Shopping cart and checkout',
      'Payment gateway integration',
      'Order management',
    ],
    description:
      'Custom online stores with secure payment, inventory management, and a smooth shopping experience.',
  },
  'Website Development': {
    features: [
      'Responsive design for mobile, tablet and desktop',
      'SEO-optimized semantic architecture',
      'CMS integration for easy content updates',
      'Lightning-fast page load performance',
      'Accessibility and cross-browser polish',
    ],
    description: 'Responsive, modern and high-performance websites for all types of businesses.',
  },
  'Domain & Hosting Setup': {
    features: [
      'Domain registration, transfer & DNS management',
      '99.9% uptime on premium cloud hosting',
      'Free SSL certificates and hardened security',
      'Global CDN for fast worldwide delivery',
      'Daily automated backups with one-click restore',
    ],
    description: 'Reliable domain registration and high-speed hosting with 99.9% uptime and CDN.',
  },
  'Full Support & Maintenance': {
    features: [
      '24/7 technical support via chat, email and phone',
      'Fast response and resolution SLAs',
      'Proactive monitoring & alerting',
      'Bug fixes, updates and emergency patches',
      'Dedicated support portal with ticket history',
    ],
    description: '24/7 technical support, maintenance, and troubleshooting to keep your business running smoothly.',
  },
  'UI/UX Design': {
    features: [
      'User research, personas & journey mapping',
      'Wireframes and interactive prototypes',
      'Modern, brand-consistent visual design',
      'Usability testing & iteration',
      'Design systems for long-term consistency',
    ],
    description: 'Creative and user-friendly designs that improve engagement and brand identity.',
  },
  'SEO & Performance Optimization': {
    features: [
      'Full technical SEO audit & fixes',
      'Core Web Vitals and page-speed optimization',
      'Keyword research & on-page optimization',
      'Structured data and sitemap setup',
      'Monthly performance & ranking reports',
    ],
    description: "Improve your website's visibility, speed, and performance to attract more customers.",
  },
  '24/7 Technical Support': {
    features: [
      '24/7 availability via chat, email and phone',
      'Fast response and resolution SLAs',
      'Proactive monitoring & alerting',
      'Bug fixes, updates and emergency patches',
      'Dedicated support portal with ticket history',
    ],
    description: 'Get continuous support for maintenance, updates, and troubleshooting.',
  },
  'Security & Daily Backups': {
    features: [
      'Web application firewall & DDoS protection',
      'Continuous malware scanning & removal',
      'Encrypted daily off-site backups',
      'One-click disaster recovery & restore',
      'Uptime and security monitoring with alerts',
    ],
    description: 'Keep your website and data safe with advanced security and automatic backups.',
  },
  'Ongoing Maintenance': {
    features: [
      'Weekly core, plugin & dependency updates',
      'Continuous performance monitoring',
      'Monthly improvement sprints',
      'Content & layout updates on request',
      'Quarterly strategy & growth reviews',
    ],
    description: 'Regular updates, feature enhancements, and performance monitoring for long-term growth.',
  },
  Other: {
    features: [
      'Custom solution tailored to your specific requirements',
      'Consultation to define scope and requirements',
      'Flexible engagement models',
      'Dedicated project management',
      'Scalable architecture for future growth',
    ],
    description: 'Custom solution tailored to your specific requirements.',
  },
}

const whyChooseItems = [
  { title: 'Custom-Built Solutions', description: 'Tailored to your unique business needs' },
  { title: 'Transparent Pricing', description: 'No hidden fees, clear scope and pricing' },
  { title: 'Fast & Reliable Delivery', description: 'On-time delivery with quality assurance' },
  { title: 'Ongoing Technical Support', description: '24/7 support for hosting clients' },
]

// File upload constraints
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+?[\d\s\-]{10,}$/
const URL_REGEX = /^https?:\/\/.+/

export default function GetAQuote() {
  const [searchParams] = useSearchParams()
  const serviceParam = searchParams.get('service')
  const planParam = searchParams.get('plan')
  const planOption = planParam ? planLabels[planParam] : undefined

  const initialService = useMemo(() => {
    if (planOption) return planOption
    if (serviceParam && serviceOptions.includes(serviceParam)) return serviceParam
    return serviceOptions[0] ?? ''
  }, [serviceParam, planOption])

  const allOptions = useMemo(
    () => (planOption ? [planOption, ...serviceOptions] : serviceOptions),
    [planOption],
  )

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    contactMethod: 'email',
    service: initialService,
    budget: '',
    timeline: '',
    projectDescription: '',
    referenceUrl: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [urlError, setUrlError] = useState('')

  // ─── Validation ────────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required'

    if (!formData.email.trim()) newErrors.email = 'Email Address is required'
    else if (!EMAIL_REGEX.test(formData.email)) newErrors.email = 'Invalid email format'

    if (!formData.phone.trim()) newErrors.phone = 'Phone Number is required'
    else if (!PHONE_REGEX.test(formData.phone)) newErrors.phone = 'Enter a valid phone number'

    if (!formData.service) newErrors.service = 'Please select a service'
    if (!formData.budget) newErrors.budget = 'Please select a budget range'
    if (!formData.projectDescription.trim())
      newErrors.projectDescription = 'Project Description is required'
    if (!formData.country) newErrors.country = 'Please select a country'

    // Compute file & url errors locally so the return value is accurate
    // (reading state here would give stale values because setState is async)
    let localFileError = ''
    if (selectedFile) {
      if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
        localFileError = 'Only PDF, DOC, DOCX files allowed'
      } else if (selectedFile.size > MAX_FILE_SIZE) {
        localFileError = 'File size must be less than 5MB'
      }
    }

    let localUrlError = ''
    if (formData.referenceUrl && !URL_REGEX.test(formData.referenceUrl)) {
      localUrlError = 'Please enter a valid URL (e.g., https://example.com)'
    }

    setFileError(localFileError)
    setUrlError(localUrlError)
    setErrors(newErrors)

    return Object.keys(newErrors).length === 0 && !localFileError && !localUrlError
  }

  // ─── Handlers ──────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setStatus('loading')
    try {
      await submitContactForm({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: `Company: ${formData.companyName}\nCountry: ${formData.country}\nContact Method: ${formData.contactMethod}\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}\nReference URL: ${formData.referenceUrl}\n\nProject Description:\n${formData.projectDescription}`,
      })
      setStatus('success')
      setFormData({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        country: '',
        contactMethod: 'email',
        service: initialService,
        budget: '',
        timeline: '',
        projectDescription: '',
        referenceUrl: '',
      })
      setSelectedFile(null)
      setFileError('')
      setUrlError('')
    } catch {
      setStatus('error')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)
    if (file) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setFileError('Only PDF, DOC, DOCX files allowed')
      } else if (file.size > MAX_FILE_SIZE) {
        setFileError('File size must be less than 5MB')
      } else {
        setFileError('')
      }
    } else {
      setFileError('')
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setFileError('')
    const fileInput = document.getElementById('file-upload') as HTMLInputElement | null
    if (fileInput) fileInput.value = ''
  }

  // ─── Helpers ───────────────────────────────────────────────────────────
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const getSelectedServiceDetails = () =>
    serviceDetails[formData.service] || { features: [], description: '' }

  const getBudgetLabel = () =>
    budgetOptions.find(opt => opt.value === formData.budget)?.label || ''

  const getTimelineLabel = () =>
    timelineOptions.find(opt => opt.value === formData.timeline)?.label || ''

  const projectSummary =
    formData.service ||
    formData.budget ||
    formData.timeline ||
    formData.projectDescription ||
    formData.referenceUrl

  const selectedServiceDetails = getSelectedServiceDetails()

  return (
    <section className="section get-quote-section">
      <div className="container">
        {/* Breadcrumb */}
        <motion.nav
          className="gq-breadcrumb"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          aria-label="Breadcrumb"
        >
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <span aria-hidden="true">/</span>
            </li>
            <li aria-current="page">Get a Quote</li>
          </ol>
        </motion.nav>

        {/* Hero Section */}
        <motion.div
          className="gq-hero"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.span className="section-label" variants={fadeInUp}>
            LET'S TALK
          </motion.span>
          <motion.h1 className="gq-title" variants={fadeInUp}>
            Get a <span>Quote</span>
          </motion.h1>
          <motion.p className="gq-subtitle" variants={fadeInUp}>
            Tell us about your project, and our team will provide a tailored solution that fits your
            goals and budget.
          </motion.p>
        </motion.div>

        <div className="gq-layout">
          {/* Main Form Area */}
          <motion.div
            className="gq-form-area"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <motion.div className="gq-form-card" variants={fadeInUp}>
              <form className="gq-form" onSubmit={handleSubmit}>
                <div className="gq-form-grid">
                  {/* Left Column - Your Details */}
                  <div className="gq-form-col">
                    <h2 className="gq-form-section-title">Your Details</h2>

                    <motion.div className="form-row" variants={fadeInUp}>
                      <Input
                        label="Full Name *"
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        aria-invalid={!!errors.fullName}
                      />
                      {errors.fullName && (
                        <p className="form-error" role="alert">
                          {errors.fullName}
                        </p>
                      )}
                    </motion.div>

                    <motion.div className="form-row" variants={fadeInUp}>
                      <Input
                        label="Company Name"
                        id="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      />
                    </motion.div>

                    <motion.div className="form-row" variants={fadeInUp}>
                      <Input
                        label="Email Address *"
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p className="form-error" role="alert">
                          {errors.email}
                        </p>
                      )}
                    </motion.div>

                    <motion.div className="form-row" variants={fadeInUp}>
                      <Input
                        label="Phone Number *"
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        required
                        aria-invalid={!!errors.phone}
                      />
                      {errors.phone && (
                        <p className="form-error" role="alert">
                          {errors.phone}
                        </p>
                      )}
                    </motion.div>

                    <motion.div className="form-row" variants={fadeInUp}>
                      <div className="form-group">
                        <label htmlFor="country">Country *</label>
                        <select
                          id="country"
                          value={formData.country}
                          onChange={e => setFormData({ ...formData, country: e.target.value })}
                          required
                          aria-invalid={!!errors.country}
                        >
                          <option value="">Select Country</option>
                          {countryOptions.map(opt => (
                            <option key={opt.code} value={opt.code}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                        {errors.country && (
                          <p className="form-error" role="alert">
                            {errors.country}
                          </p>
                        )}
                      </div>
                    </motion.div>

                    <motion.div className="form-row" variants={fadeInUp}>
                      <div className="form-group">
                        <label>Preferred Contact Method *</label>
                        <div className="radio-group">
                          {contactMethodOptions.map(opt => (
                            <label key={opt.value} className="radio-label">
                              <input
                                type="radio"
                                name="contactMethod"
                                value={opt.value}
                                checked={formData.contactMethod === opt.value}
                                onChange={e =>
                                  setFormData({ ...formData, contactMethod: e.target.value })
                                }
                              />
                              <span>{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column - Project Details */}
                  <div className="gq-form-col">
                    <h2 className="gq-form-section-title">Project Details</h2>

                    {/* Service Selection */}
                    <motion.div className="form-row" variants={fadeInUp}>
                      <div className="form-group">
                        <label htmlFor="service">Select a Service *</label>
                        <div className="select-wrapper">
                          <select
                            id="service"
                            value={formData.service}
                            onChange={e => setFormData({ ...formData, service: e.target.value })}
                            required
                            aria-invalid={!!errors.service}
                          >
                            {allOptions.map(opt => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.service && (
                          <p className="form-error" role="alert">
                            {errors.service}
                          </p>
                        )}
                      </div>
                    </motion.div>

                    {/* Dynamic Service Details Display */}
                    {formData.service && selectedServiceDetails.features.length > 0 && (
                      <motion.div
                        className="service-details-panel"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="service-details-header">
                          <span className="service-details-label">What's included:</span>
                        </div>
                        <ul className="service-features-list">
                          {selectedServiceDetails.features.map((feature, i) => (
                            <motion.li
                              key={feature}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <CheckCircle size={16} strokeWidth={2} className="feature-check" />
                              <span>{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    )}

                    {/* Budget Selection */}
                    <motion.div className="form-row" variants={fadeInUp}>
                      <div className="form-group">
                        <label htmlFor="budget">Project Budget *</label>
                        <div className="select-wrapper">
                          <select
                            id="budget"
                            value={formData.budget}
                            onChange={e => setFormData({ ...formData, budget: e.target.value })}
                            required
                            aria-invalid={!!errors.budget}
                          >
                            {budgetOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.budget && (
                          <p className="form-error" role="alert">
                            {errors.budget}
                          </p>
                        )}
                      </div>
                    </motion.div>

                    {/* Budget Display */}
                    {formData.budget && (
                      <motion.div
                        className="budget-display"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="budget-label">Selected Budget:</span>
                        <span className="budget-value">{getBudgetLabel()}</span>
                      </motion.div>
                    )}

                    {/* Timeline Selection */}
                    <motion.div className="form-row" variants={fadeInUp}>
                      <div className="form-group">
                        <label htmlFor="timeline">Project Timeline</label>
                        <select
                          id="timeline"
                          value={formData.timeline}
                          onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                        >
                          {timelineOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>

                    {/* Timeline Display */}
                    {formData.timeline && (
                      <motion.div
                        className="timeline-display"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="timeline-label">Selected Timeline:</span>
                        <span className="timeline-value">{getTimelineLabel()}</span>
                      </motion.div>
                    )}

                    {/* Reference URL */}
                    <motion.div className="form-row" variants={fadeInUp}>
                      <div className="form-group">
                        <div className="input-with-validation">
                          <Input
                            label="Reference Website URL (Optional)"
                            id="referenceUrl"
                            type="url"
                            placeholder="https://example.com"
                            value={formData.referenceUrl}
                            onChange={e => {
                              const value = e.target.value
                              setFormData({ ...formData, referenceUrl: value })
                              if (value && !URL_REGEX.test(value)) {
                                setUrlError('Please enter a valid URL (e.g., https://example.com)')
                              } else {
                                setUrlError('')
                              }
                            }}
                          />
                        </div>
                        {urlError && (
                          <p id="url-error" className="form-error" role="alert">
                            {urlError}
                          </p>
                        )}
                      </div>
                    </motion.div>

                    {/* File Upload */}
                    <motion.div className="form-row" variants={fadeInUp}>
                      <div className="form-group">
                        <label htmlFor="file-upload">Upload Project Brief (Optional)</label>
                        <div className="file-upload">
                          <input
                            type="file"
                            id="file-upload"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="file-input"
                            aria-describedby="file-error"
                          />
                          <div className="file-upload-content">
                            <FileText size={24} strokeWidth={2} />
                            <div>
                              <span>Drag &amp; drop a file or click to browse</span>
                              <small>PDF, DOC, DOCX up to 5MB</small>
                            </div>
                          </div>
                          {selectedFile && (
                            <div className="selected-file">
                              <FileText size={16} strokeWidth={2} />
                              <span>{selectedFile.name}</span>
                              <small>{formatFileSize(selectedFile.size)}</small>
                              <button
                                type="button"
                                className="file-remove"
                                onClick={removeFile}
                                aria-label="Remove file"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                        {fileError && (
                          <p id="file-error" className="form-error" role="alert">
                            {fileError}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Project Description - Full Width */}
                <motion.div variants={fadeInUp}>
                  <div className="form-group">
                    <Textarea
                      label="Project Description *"
                      id="projectDescription"
                      value={formData.projectDescription}
                      onChange={e =>
                        setFormData({ ...formData, projectDescription: e.target.value })
                      }
                      required
                      aria-invalid={!!errors.projectDescription}
                    />
                    {errors.projectDescription && (
                      <p className="form-error" role="alert">
                        {errors.projectDescription}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Live Description Preview */}
                {formData.projectDescription.trim() && (
                  <motion.div
                    className="description-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="preview-header">
                      <span className="preview-label">Live Preview:</span>
                    </div>
                    <div className="preview-content">{formData.projectDescription}</div>
                  </motion.div>
                )}

                {/* Reference URL Preview */}
                {formData.referenceUrl && (
                  <motion.div
                    className="url-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="preview-header">
                      <Globe size={14} strokeWidth={2} />
                      <span className="preview-label">Reference URL:</span>
                    </div>
                    <div className="preview-content url-preview-content">
                      <LinkIcon size={14} strokeWidth={2} />
                      <a
                        href={formData.referenceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="preview-url"
                      >
                        {formData.referenceUrl}
                      </a>
                      {!URL_REGEX.test(formData.referenceUrl) && (
                        <span className="url-warning">
                          ⚠ Please enter a valid URL (e.g., https://example.com)
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Project Summary Card */}
                {projectSummary && (
                  <motion.div
                    className="project-summary-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="summary-header">
                      <span className="summary-title">Your Project Summary</span>
                      <span className="summary-subtitle">Review your details before submitting</span>
                    </div>
                    <div className="summary-content">
                      <div className="summary-row">
                        <span className="summary-label">Service:</span>
                        <span className="summary-value">{formData.service || 'Not selected'}</span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Budget:</span>
                        <span className="summary-value">{getBudgetLabel() || 'Not selected'}</span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Timeline:</span>
                        <span className="summary-value">
                          {getTimelineLabel() || 'Not selected'}
                        </span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Description:</span>
                        <span className="summary-value description-text">
                          {formData.projectDescription || 'Not provided'}
                        </span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Reference URL:</span>
                        <span className="summary-value url-text">
                          {formData.referenceUrl ? (
                            <a
                              href={formData.referenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="summary-url"
                            >
                              <Globe size={12} strokeWidth={2} />
                              {formData.referenceUrl}
                            </a>
                          ) : (
                            'Not provided'
                          )}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="btn btn-primary gq-submit-btn"
                  disabled={status === 'loading'}
                  variants={fadeInUp}
                >
                  {status === 'loading' ? (
                    <>
                      Requesting... <span className="loading-spinner" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      REQUEST MY QUOTE <ArrowRight size={16} aria-hidden="true" />
                    </>
                  )}
                </motion.button>

                {status === 'success' && (
                  <motion.p
                    className="form-success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ✓ Request sent! We'll get back to you within 24 hours.
                  </motion.p>
                )}
                {status === 'error' && (
                  <motion.p
                    className="form-error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Failed to send. Please try again or email us directly.
                  </motion.p>
                )}
              </form>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            className="gq-sidebar"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={slideInLeft}
          >
            <motion.div className="gq-sidebar-card" variants={fadeInUp}>
              <h3 className="gq-sidebar-title">Why Choose Quantivo Solutions?</h3>
              <ul className="gq-why-choose">
                {whyChooseItems.map((item, i) => (
                  <motion.li key={item.title} variants={fadeInUp} transition={{ delay: i * 0.1 }}>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="gq-sidebar-card gq-contact-card"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <h3 className="gq-sidebar-title">Contact Information</h3>
              <div className="gq-contact-list">
                <div className="gq-contact-item">
                  <Mail size={20} strokeWidth={2} />
                  <div>
                    <h4>Email</h4>
                    <a href={`mailto:${companyContact.email}`}>{companyContact.email}</a>
                  </div>
                </div>
                <div className="gq-contact-item">
                  <Phone size={20} strokeWidth={2} />
                  <div>
                    <h4>Phone</h4>
                    {companyContact.phoneDisplay.map((display, i) => (
                      <a key={i} href={`tel:${companyContact.phoneDigits[i]}`}>
                        {display}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="gq-contact-item">
                  <MapPin size={20} strokeWidth={2} />
                  <div>
                    <h4>Office</h4>
                    <p>{companyContact.location}</p>
                  </div>
                </div>
                <div className="gq-contact-item">
                  <Clock size={20} strokeWidth={2} />
                  <div>
                    <h4>Support Hours</h4>
                    <p>{companyContact.supportHours}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.aside>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="gq-bottom-cta"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <div className="gq-cta-content">
            <div className="gq-cta-text">
              <h3>Not Sure What You Need?</h3>
              <p>Our team can help you choose the right solution for your business.</p>
            </div>
            <Link to="/contact" className="btn btn-outline gq-cta-btn">
              CONTACT OUR TEAM <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}