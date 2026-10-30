import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react'
import { getServiceBySlug } from '../services/website'
import NotFound from './NotFound'
import { fadeInUp, staggerContainer, scaleIn } from '../lib/animations'

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const service = slug ? getServiceBySlug(slug) : undefined

  if (!service) return <NotFound />

  const quotePath = `/contact?service=${encodeURIComponent(service.title)}`

  return (
    <section className="section service-detail">
      <div className="container">
        <motion.div
          className="sd-top"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Link to="/services" className="sd-back">
              <ArrowLeft size={16} strokeWidth={2.5} />
              Back to Services
            </Link>
          </motion.div>

          <div className="sd-hero">
            <motion.div className="sd-hero-text" variants={fadeInUp}>
              <span className="section-label">Our Services</span>
              <h1 className="sd-title">{service.title}</h1>
              <p className="sd-lead">{service.description}</p>
              <p className="sd-details">{service.details}</p>
              <div className="sd-actions">
                <Link to={quotePath} className="btn btn-primary">
                  Get a Quote
                  <ArrowRight size={16} />
                </Link>
                <Link to="/services" className="btn btn-outline">
                  Back to Services
                </Link>
              </div>
            </motion.div>

            <motion.div className="sd-hero-media" variants={scaleIn}>
              <img src={service.image} alt={service.title} width={400} height={260} />
            </motion.div>
          </div>
        </motion.div>

        <div className="sd-blocks">
          <motion.div
            className="sd-block"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 className="sd-block-title" variants={fadeInUp}>
              Key Features
            </motion.h2>
            <ul className="sd-features">
              {service.features.map(feature => (
                <motion.li key={feature} variants={fadeInUp}>
                  <span className="sd-check">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="sd-block"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 className="sd-block-title" variants={fadeInUp}>
              Benefits
            </motion.h2>
            <ul className="sd-benefits">
              {service.benefits.map(benefit => (
                <motion.li key={benefit} variants={fadeInUp}>
                  <span className="sd-benefit-icon">
                    <Sparkles size={16} strokeWidth={2.5} />
                  </span>
                  {benefit}
                </motion.li>
              ))}
            </ul>

            <motion.h2 className="sd-block-title sd-tech-title" variants={fadeInUp}>
              Technologies We Use
            </motion.h2>
            <motion.div className="sd-tech" variants={fadeInUp}>
              {service.technologies.map(tech => (
                <span className="sd-chip" key={tech}>
                  {tech}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="sd-cta"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp}>
            Ready to start your <span>{service.title}</span> project?
          </motion.h2>
          <motion.p variants={fadeInUp}>
            Tell us about your goals — we will reply within 24 hours with a tailored plan.
          </motion.p>
          <motion.div className="sd-actions sd-cta-actions" variants={fadeInUp}>
            <Link to={quotePath} className="btn btn-primary">
              Get a Quote
              <ArrowRight size={16} />
            </Link>
            <Link to="/services" className="btn btn-outline">
              Back to Services
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
