import { useState, useMemo, FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import { submitContactForm } from '../../services/contact'
import { offerings } from '../../services/website'
import { companyContact } from '../../services/siteConfig'
import { fadeInUp, staggerContainer, slideInLeft } from '../../lib/animations'
import Input from '../UI/Input'
import Textarea from '../UI/Textarea'

const serviceOptions = [
  ...offerings.map(o => o.title),
  'Full Support & Maintenance',
  'Other',
]

export default function Contact() {
  const [searchParams] = useSearchParams()
  const serviceParam = searchParams.get('service')
  const planParam = searchParams.get('plan')
  const planLabels: Record<string, string> = {
    starter: 'Starter Plan ($999)',
    business: 'Business Plan ($2,999)',
    enterprise: 'Enterprise Plan (Custom)',
  }
  const planOption = planParam ? planLabels[planParam] : undefined
  const initialService = useMemo(() => {
    if (planOption) return planOption
    if (serviceParam && serviceOptions.includes(serviceParam)) return serviceParam
    return serviceOptions[0]
  }, [serviceParam, planOption])
  const allOptions = useMemo(
    () => (planOption ? [planOption, ...serviceOptions] : serviceOptions),
    [planOption],
  )
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: initialService,
    message: planOption ? `I'm interested in the ${planOption}. Please share more details.` : '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await submitContactForm(formData)
      setStatus('success')
      setFormData({ name: '', email: '', phone: '', service: initialService, message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.span className="section-label" variants={fadeInUp}>Contact</motion.span>
          <motion.h2 className="section-title" variants={fadeInUp}>
            Let's Build Something Great
          </motion.h2>
          <motion.p className="section-subtitle" variants={fadeInUp}>
            Tell us about your project — e-commerce, website, hosting, or support. We reply within 24 hours.
          </motion.p>
        </motion.div>

        <div className="contact-grid">
          <motion.div
            className="contact-info"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideInLeft}
          >
            <h3>Get in Touch</h3>
            <p>Our team of 3 developers is ready to help you launch and grow online.</p>
            <div className="contact-detail">
              <div className="contact-detail-icon">
                <Mail size={20} strokeWidth={2} />
              </div>
              <div>
                <h4>Email</h4>
                <a href={`mailto:${companyContact.email}`}>{companyContact.email}</a>
              </div>
            </div>
            <div className="contact-detail">
              <div className="contact-detail-icon">
                <Phone size={20} strokeWidth={2} />
              </div>
              <div>
                <h4>Phone</h4>
                <div className="phone-numbers">
                  {companyContact.phoneDisplay.map((display, i) => (
                    <a key={i} href={`tel:${companyContact.phoneDigits[i]}`}>
                      {display}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="contact-detail">
              <div className="contact-detail-icon">
                <MapPin size={20} strokeWidth={2} />
              </div>
              <div>
                <h4>Office</h4>
                <p>{companyContact.location}</p>
              </div>
            </div>
            <div className="contact-detail">
              <div className="contact-detail-icon">
                <Clock size={20} strokeWidth={2} />
              </div>
              <div>
                <h4>Support Hours</h4>
                <p>{companyContact.supportHours}</p>
              </div>
            </div>
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div className="form-row" variants={fadeInUp}>
              <Input
                label="Your Name"
                id="name"
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Email"
                id="email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </motion.div>
            <motion.div className="form-row" variants={fadeInUp}>
              <Input
                label="Phone (optional)"
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
              <div className="form-group">
                <label htmlFor="service">Service Interested In</label>
                <select
                  id="service"
                  value={formData.service}
                  onChange={e => setFormData({ ...formData, service: e.target.value })}
                >
                  {allOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Textarea
                label="Tell Us About Your Project"
                id="message"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </motion.div>
            <motion.button type="submit" className="btn btn-primary" disabled={status === 'loading'} variants={fadeInUp}>
              {status === 'loading' ? 'Sending...' : <>Send Message <Send size={16} /></>}
            </motion.button>
            {status === 'success' && <p className="form-success">✓ Message sent! We'll get back to you soon.</p>}
            {status === 'error' && <p className="form-error">Failed to send. Please try again.</p>}
          </motion.form>
        </div>
      </div>
    </section>
  )
}
