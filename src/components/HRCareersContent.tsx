import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, ShieldCheck, Rocket, HeartHandshake, ArrowRight, Briefcase, MapPin, Clock } from 'lucide-react'
import { fadeInUp, staggerContainer, scaleIn } from '../lib/animations'
import { careerOpenings } from '../services/siteConfig'
import ResumeModal from './ResumeModal'

const perks = [
  {
    Icon: ShieldCheck,
    title: 'Health & Wellness',
    desc: 'Comprehensive health cover and wellness support so you can do your best work.',
  },
  {
    Icon: Rocket,
    title: 'Learning Budget',
    desc: 'Annual budget for courses, certifications, and conference attendance.',
  },
  {
    Icon: HeartHandshake,
    title: 'Work-Life Balance',
    desc: 'Flexible hours, remote-friendly setup, and generous time off.',
  },
  {
    Icon: Users,
    title: 'Real Collaboration',
    desc: 'Small, flat team where your ideas ship and your voice is heard.',
  },
]

export default function HRCareersContent() {
  const [modalOpen, setModalOpen] = useState(false)
  const [presetPosition, setPresetPosition] = useState('')

  const openFor = (position = '') => {
    setPresetPosition(position)
    setModalOpen(true)
  }

  return (
    <section className="section">
      <div className="container">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <span className="section-label">HR &amp; Careers</span>
          </motion.div>

          <motion.h1 className="section-title" variants={fadeInUp}>
            People Build <span style={{ color: 'var(--accent)' }}>Our Future</span>
          </motion.h1>

          <motion.p className="section-subtitle" variants={fadeInUp}>
            At QUANTIVO SOLUTIONS, we believe great people create great digital experiences. We welcome
            talented, passionate individuals who want to grow with us and build innovative solutions.
          </motion.p>
        </motion.div>

        <div className="svc-grid" style={{ marginTop: '3rem' }}>
          {perks.map(({ Icon, title, desc }) => (
            <motion.div
              className="svc-card"
              key={title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scaleIn}
            >
              <span
                className="ab-service-icon"
                style={{ marginBottom: '1rem', display: 'inline-flex' }}
              >
                <Icon size={20} strokeWidth={2.2} />
              </span>
              <h3 className="svc-card-title">{title}</h3>
              <p className="svc-card-desc" style={{ marginBottom: 0 }}>
                {desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          style={{ marginTop: '4.5rem' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.h2 className="section-title" variants={fadeInUp}>
            Career <span style={{ color: 'var(--accent)' }}>Opportunities</span>
          </motion.h2>
        </motion.div>

        <div className="svc-grid hr-openings">
          {careerOpenings.map(job => (
            <motion.div
              className="svc-card"
              key={job.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={scaleIn}
            >
              <h3 className="svc-card-title">{job.title}</h3>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <Briefcase size={14} /> {job.type}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={14} /> {job.location}
                </span>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => openFor(job.title)}>
                Apply Now <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          style={{ marginTop: '3.5rem' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
        >
          <p
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--text-secondary)',
              marginBottom: '1.25rem',
            }}
          >
            <Clock size={16} /> We review every application within 5 working days.
          </p>
          <div>
            <button type="button" className="btn btn-primary" onClick={() => openFor()}>
              Send Your Resume <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>

      <ResumeModal
        open={modalOpen}
        defaultPosition={presetPosition}
        onClose={() => setModalOpen(false)}
      />
    </section>
  )
}