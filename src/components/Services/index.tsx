import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { featuredServices } from '../../services/website'
import Pricing from '../Pricing'
import { fadeInUp, staggerContainer } from '../../lib/animations'

export default function Services() {
  return (
    <>
      <section className="section services-premium services-3d">
        <div className="container">
          <motion.div
            className="svc-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.span className="section-label" variants={fadeInUp}>
              Our Services
            </motion.span>
            <motion.h2 className="svc-title" variants={fadeInUp}>
              SERVIC<span>ES</span>
            </motion.h2>
            <motion.p className="svc-subtitle" variants={fadeInUp}>
              We provide end-to-end digital solutions to help your business grow, scale, and
              succeed in the digital world.
            </motion.p>
          </motion.div>

          <motion.div
            className="svc-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {featuredServices.map(service => (
              <Link to={service.to} className="svc-card-link svc-card-3d" key={service.id} aria-label={`View ${service.title} details`}>
                <motion.article className="svc-card svc-card-3d" variants={fadeInUp}>
                  <div className="svc-media svc-media-3d">
                    <img src={service.image} alt={service.title} loading="lazy" width={400} height={260} />
                  </div>
                  <h3 className="svc-card-title">{service.title}</h3>
                  <p className="svc-card-desc">{service.description}</p>
                  <span className="svc-more svc-more-3d">
                    Learn More
                    <span className="svc-arrow svc-arrow-3d">
                      <ArrowRight size={16} strokeWidth={2.5} />
                    </span>
                  </span>
                </motion.article>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      <Pricing />
    </>
  )
}
