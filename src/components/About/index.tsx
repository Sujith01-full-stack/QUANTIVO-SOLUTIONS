import { motion } from 'framer-motion'
import {
  Play,
  ShoppingCart,
  Monitor,
  Server,
  Headset,
  ChartNoAxesColumnIncreasing,
  ShieldCheck,
  Smartphone,
  Settings,
  Rocket,
  Layers,
  Users,
  Smile,
} from 'lucide-react'
import { fadeInUp, staggerContainer, slideInLeft, scaleIn } from '../../lib/animations'

const services = [
  { icon: ShoppingCart, label: 'E-Commerce Store Development' },
  { icon: Monitor, label: 'Corporate & Portfolio Websites' },
  { icon: Server, label: 'Domain & Hosting Setup' },
  { icon: Headset, label: '24/7 Technical Support' },
  { icon: ChartNoAxesColumnIncreasing, label: 'SEO & Performance Optimization' },
  { icon: ShieldCheck, label: 'Security & Daily Backups' },
  { icon: Smartphone, label: 'Responsive Mobile Design' },
  { icon: Settings, label: 'Ongoing Maintenance' },
]

const stats = [
  { icon: Rocket, value: '5+', label: 'Years of Experience' },
  { icon: Layers, value: '150+', label: 'Projects Completed' },
  { icon: Users, value: '3', label: 'Team Members' },
  { icon: Smile, value: '100+', label: 'Happy Clients' },
]

export default function About() {
  return (
    <section className="section ab-section">
      <div className="ab-deco ab-deco-glow" aria-hidden="true" />
      <div className="ab-deco ab-deco-dots-tl" aria-hidden="true" />
      <div className="ab-deco ab-deco-dots-br" aria-hidden="true" />
      <div className="ab-deco ab-deco-arc" aria-hidden="true" />
      <div className="ab-deco ab-deco-diag" aria-hidden="true" />

      <div className="container ab-container">
        <div className="ab-hero">
          <motion.div
            className="ab-collage"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={slideInLeft}
          >
            <div className="ab-promo">
              <span className="ab-promo-line">Digital Solutions</span>
              <span className="ab-promo-line">For a Brighter</span>
              <span className="ab-promo-big">Tomorrow</span>
              <span className="ab-promo-bar" aria-hidden="true" />
            </div>

            <div className="ab-main-img">
              <img src="/images/about/quantivo-office.svg" alt="Quantivo Solutions modern office interior with workstations and branding" />
            </div>

            <div className="ab-team-img">
              <img src="/images/about/quantivo-team.svg" alt="Three Quantivo developers collaborating on a project" />
            </div>

            <div className="ab-team-badge">
              <span className="ab-badge-play" aria-hidden="true">
                <Play size={16} fill="currentColor" strokeWidth={0} />
              </span>
              <div className="ab-badge-text">
                <strong>Our Team</strong>
                <span>Our Strength</span>
              </div>
            </div>

            <div className="ab-exp-card">
              <div className="ab-exp-ring" aria-hidden="true">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none" stroke="#FF6A00" strokeWidth="8"
                    strokeLinecap="round" strokeDasharray="264" strokeDashoffset="66"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <span className="ab-exp-num">5+</span>
              </div>
              <div className="ab-exp-body">
                <h3>Years of Excellence</h3>
                <p>Delivering innovative digital solutions since 2020.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="ab-content"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.span className="ab-badge" variants={fadeInUp}>About Us</motion.span>

            <div className="ab-title-wrap">
              <motion.h1 className="ab-title" variants={fadeInUp}>
                Who We <span>Are</span>
              </motion.h1>
              <motion.div className="ab-script" variants={fadeInUp} aria-hidden="true">
                <span>Your</span>
                <span>Digital Growth</span>
                <span>Partner</span>
              </motion.div>
            </div>

            <motion.p className="ab-lead" variants={fadeInUp}>
              Quantivo Solutions is a digital agency run by a 3-member developer team
              passionate about building e-commerce stores, websites, hosting infrastructure,
              and providing full support to businesses of all sizes.
            </motion.p>

            <motion.p className="ab-desc" variants={fadeInUp}>
              We do not just deliver projects — we become your long-term technology partner,
              keeping your site fast, secure, and online every single day.
            </motion.p>

            <motion.div className="ab-services" variants={staggerContainer}>
              {services.map(({ icon: Icon, label }) => (
                <motion.div className="ab-service" key={label} variants={fadeInUp}>
                  <span className="ab-service-icon">
                    <Icon size={20} strokeWidth={2.2} />
                  </span>
                  <span className="ab-service-label">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="ab-stats"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <motion.div className="ab-stat" key={label} variants={scaleIn}>
              <span className="ab-stat-icon">
                <Icon size={24} strokeWidth={2.2} />
              </span>
              <div className="ab-stat-body">
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
