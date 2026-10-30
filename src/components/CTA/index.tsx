import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { fadeInUp, staggerContainer } from '../../lib/animations'

export default function CTA() {
  return (
    <section className="cta-section">
      <motion.div
        className="container"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={staggerContainer}
      >
        <motion.span className="section-label" variants={fadeInUp}>
          Our Services
        </motion.span>
        <motion.h2 variants={fadeInUp}>
          Ready to Launch <span>Your Project?</span>
        </motion.h2>
        <motion.p variants={fadeInUp}>
          Whether you need an online store, a business website, reliable hosting,
          or full ongoing support — Quantivo Solutions has you covered.
        </motion.p>
        <motion.div variants={fadeInUp}>
          <Link to="/contact" className="btn">
            Get Started Today <ArrowRight size={18} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
