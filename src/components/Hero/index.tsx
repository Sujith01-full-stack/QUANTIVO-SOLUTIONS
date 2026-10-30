import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ShoppingCart, Globe, Cloud, ShieldCheck, ArrowRight, ArrowUpRight, Cube, Zap, Layers, Rocket } from 'lucide-react'
import { fadeInUp, staggerContainer, slideInRight } from '../../lib/animations'

const panelServices = [
  { icon: ShoppingCart, label: 'E-Commerce', desc: 'Stores that sell 24/7' },
  { icon: Globe, label: 'Websites', desc: 'Fast, responsive builds' },
  { icon: Cloud, label: 'Hosting', desc: '99.9% uptime & CDN' },
  { icon: ShieldCheck, label: 'Full Support', desc: '24/7 maintenance' },
]

export default function Hero() {
  const reduceMotion = useReducedMotion()
  const initial = reduceMotion ? false : 'hidden'

  return (
    <section className="hero hero-3d">
      {/* 3D Background Effects */}
      <div className="hero-3d-bg" aria-hidden="true" />
      <div className="hero-shapes" aria-hidden="true">
        <div className="hero-shape" style={{ width: 200, height: 200, top: '10%', left: '5%', animationDelay: '0s' }} />
        <div className="hero-shape" style={{ width: 150, height: 150, top: '60%', right: '5%', animationDelay: '-2s' }} />
        <div className="hero-shape" style={{ width: 100, height: 100, bottom: '20%', left: '15%', animationDelay: '-4s' }} />
        <div className="hero-shape" style={{ width: 180, height: 180, top: '30%', right: '20%', animationDelay: '-6s' }} />
        <div className="hero-shape" style={{ width: 80, height: 80, bottom: '30%', right: '10%', animationDelay: '-1s' }} />
      </div>
      <div className="hero-3d-grid" aria-hidden="true" />

      <div className="container">
        <motion.div
          className="hero-content"
          initial={false}
          animate="visible"
          variants={staggerContainer}
        >
          <motion.span className="hero-badge" variants={fadeInUp}>
            🚀 Digital Agency · Est. 2020
          </motion.span>
          <motion.h1 variants={fadeInUp}>
            We Turn Ideas Into Powerful Digital Experiences
          </motion.h1>
          <motion.p variants={fadeInUp}>
            Quantivo Solutions delivers end-to-end digital services — from online stores
            and corporate websites to rock-solid hosting and 24/7 full support.
          </motion.p>
          <motion.div className="hero-actions" variants={fadeInUp}>
            <Link to="/get-a-quote" className="btn btn-primary btn-3d-primary">
              Start Your Project <ArrowRight size={18} />
            </Link>
            <Link to="/portfolio" className="btn btn-outline btn-3d-outline">
              View Demo Projects
            </Link>
          </motion.div>
          <motion.div className="hero-stats" variants={fadeInUp}>
            <div className="stat-item stat-item-3d">
              <span className="stat-number">150+</span>
              <span className="stat-label">Projects Delivered</span>
            </div>
            <div className="stat-item stat-item-3d">
              <span className="stat-number">3</span>
              <span className="stat-label">Team Leaders</span>
            </div>
            <div className="stat-item stat-item-3d">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Hosting Uptime</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual hero-visual-3d"
          initial={false}
          animate="visible"
          variants={slideInRight}
        >
          <div className="hero-card hero-card-3d">
            <div className="hero-card-header">
              <span className="hero-card-dot" />
              <span className="hero-card-dot" />
              <span className="hero-card-dot" />
              <span className="hero-card-title">quantivosolutions.com/services</span>
            </div>
            <div className="hero-card-body">
              {panelServices.map(item => (
                <Link to="/services" className="hero-card-item hero-card-item-3d" key={item.label}>
                  <span className="icon icon-3d">
                    <item.icon size={20} strokeWidth={2} />
                  </span>
                  <span className="text">
                    <span className="label">{item.label}</span>
                    <span className="desc">{item.desc}</span>
                  </span>
                  <span className="arrow arrow-3d">
                    <ArrowUpRight size={15} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Floating 3D decorative elements */}
          <div className="hero-floating-elements" aria-hidden="true">
            <div className="floating-orb float-3d" style={{ top: '15%', right: '-5%', animationDelay: '0s' }} />
            <div className="floating-orb float-gentle" style={{ bottom: '20%', left: '-5%', animationDelay: '-2s' }} />
            <div className="floating-orb float-subtle" style={{ top: '50%', right: '-10%', animationDelay: '-3s' }} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}