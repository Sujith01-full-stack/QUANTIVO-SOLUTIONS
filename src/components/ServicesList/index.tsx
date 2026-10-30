import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Cube, Zap, ShieldCheck, Layers } from 'lucide-react'
import { featuredServices } from '../../services/website'
import { fadeInUp, staggerContainer } from '../../lib/animations'

export default function ServicesList() {
  return (
    <section className="services-list-section services-list-3d">
      <div className="container">
        <motion.h2
          className="services-list-title"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
        >
          SERVICES
        </motion.h2>
        <motion.div
          className="services-list-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          {featuredServices.map(service => (
            <Link to={service.to} className="sl-card-link sl-card-3d" key={service.id} aria-label={`View ${service.title} details`}>
              <motion.article className="sl-card sl-card-3d" variants={fadeInUp}>
                <div className="sl-media sl-media-3d">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    width={400}
                    height={260}
                  />
                </div>
                <h3 className="sl-card-title">{service.title}</h3>
                <p className="sl-card-desc">{service.description}</p>
                <span className="sl-more sl-more-3d">
                  Learn More
                  <span className="sl-arrow sl-arrow-3d">
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </span>
                </span>
              </motion.article>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}