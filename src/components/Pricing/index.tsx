import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, ShieldCheck, Headset, Check, Crown, Database } from 'lucide-react'
import { pricingPlans } from '../../services/website'
import { cn } from '../../lib/utils'
import { fadeInUp, staggerContainer, scaleIn } from '../../lib/animations'

const benefits = [
  { icon: Zap, title: 'No Hidden Fees', desc: 'Transparent Pricing' },
  { icon: ShieldCheck, title: 'Secure & Reliable', desc: 'Hosting Included' },
  { icon: Headset, title: "Dedicated Support", desc: "We're Always Here" },
]

export default function Pricing() {
  return (
    <section className="section pricing-premium">
      <div className="pr-deco pr-deco-dots-left" aria-hidden="true" />
      <div className="pr-deco pr-deco-dots-right" aria-hidden="true" />
      <div className="pr-deco pr-deco-arc-left" aria-hidden="true" />
      <div className="pr-deco pr-deco-arc-right" aria-hidden="true" />
      <div className="pr-deco pr-deco-glow" aria-hidden="true" />

      <div className="container pr-container">
        <motion.div
          className="pr-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.span className="pr-badge" variants={fadeInUp}>
            Pricing
          </motion.span>
          <motion.h2 className="pr-title" variants={fadeInUp}>
            Simple, Transparent <span>Plans</span>
          </motion.h2>
          <motion.p className="pr-subtitle" variants={fadeInUp}>
            Pick a plan that fits your budget. Hosting and support included.
          </motion.p>

          <motion.div className="pr-benefits" variants={staggerContainer}>
            {benefits.map(benefit => (
              <motion.div className="pr-benefit" key={benefit.title} variants={fadeInUp}>
                <span className="pr-benefit-icon">
                  <benefit.icon size={20} strokeWidth={2.5} />
                </span>
                <div>
                  <strong>{benefit.title}</strong>
                  <p>{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="pr-grid-wrap">
          <motion.div
            className="pr-float pr-float-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="pr-float-icon">
              <Database size={20} strokeWidth={2.5} />
            </span>
            <div>
              <strong>High ROI</strong>
              <p>Scalable Solutions for Long-Term Growth</p>
            </div>
          </motion.div>

          <motion.div
            className="pr-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {pricingPlans.map(plan => (
              <motion.div
                key={plan.id}
                className={cn('pr-card-wrap', plan.highlighted && 'featured')}
                variants={scaleIn}
              >
                {plan.highlighted && (
                  <span className="pr-popular">
                    <Crown size={13} strokeWidth={2.5} />
                    Most Popular
                    <Crown size={13} strokeWidth={2.5} />
                  </span>
                )}
                <div className="pr-card">
                  <div className="pr-media">
                    <img src={plan.image} alt={`${plan.name} plan illustration`} width={400} height={260} />
                  </div>
                  <h3 className="pr-name">{plan.name}</h3>
                  <p className="pr-sub">{plan.subtitle}</p>
                  <div className="pr-price">{plan.price}</div>
                  <div className="pr-period">{plan.period}</div>
                  <ul className="pr-features">
                    {plan.features.map((f, i) => (
                      <li key={i}>
                        <span className="pr-check">
                          <Check size={12} strokeWidth={3.5} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/contact?plan=${plan.tag}`}
                    className={cn('pr-cta', plan.highlighted && 'filled')}
                    aria-label={`Choose the ${plan.name} plan`}
                  >
                    Choose {plan.name}
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="pr-float pr-float-right"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="pr-float-icon">
              <Headset size={20} strokeWidth={2.5} />
            </span>
            <div>
              <strong>Need Help?</strong>
              <p>Talk to Our Experts Before You Choose</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
