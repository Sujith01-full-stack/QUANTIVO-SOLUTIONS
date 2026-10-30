import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, FolderOpen } from 'lucide-react'
import { portfolioItems } from '../../services/contact'
import { cn } from '../../lib/utils'
import { fadeInUp, staggerContainer, scaleIn } from '../../lib/animations'

const categories = ['All', ...Array.from(new Set(portfolioItems.map(i => i.category)))]

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? portfolioItems
      : portfolioItems.filter(item => item.category === activeCategory)

  return (
    <section className="section pf-section">
      <div className="pf-deco pf-deco-dots-left" aria-hidden="true" />
      <div className="pf-deco pf-deco-dots-right" aria-hidden="true" />
      <div className="pf-deco pf-deco-arc-left" aria-hidden="true" />
      <div className="pf-deco pf-deco-arc-right" aria-hidden="true" />
      <div className="pf-deco pf-deco-glow" aria-hidden="true" />

      <div className="container pf-container">
        <motion.div
          className="pf-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.span className="pf-badge" variants={fadeInUp}>
            Our Portfolio
          </motion.span>
          <motion.h2 className="pf-title" variants={fadeInUp}>
            Our Latest <span>Work</span>
          </motion.h2>
          <motion.p className="pf-subtitle" variants={fadeInUp}>
            Explore our recent projects across e-commerce, business websites, hosting platforms,
            and customer support systems — each crafted with performance and polish in mind.
          </motion.p>
        </motion.div>

        <motion.div
          className="pf-filters"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {categories.map(cat => (
            <motion.button
              key={cat}
              className={cn('pf-filter-btn', activeCategory === cat && 'active')}
              onClick={() => setActiveCategory(cat)}
              variants={fadeInUp}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {filtered.length === 0 ? (
          <motion.div
            className="pf-empty"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <FolderOpen size={40} strokeWidth={1.5} />
            <h3>No projects in this category yet</h3>
            <p>Try another filter, or browse all of our work.</p>
          </motion.div>
        ) : (
          <motion.div
            className="pf-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            key={activeCategory}
          >
            {filtered.map(item => (
              <Link to={`/portfolio/${item.slug}`} className="pf-card-link" key={item.id} aria-label={`View ${item.title} details`}>
                <motion.article className="pf-card" variants={scaleIn}>
                  <div className="pf-media">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>

                  <div className="pf-body">
                    <span className="pf-category">{item.category}</span>
                    <h3 className="pf-card-title">{item.title}</h3>
                    <p className="pf-desc">{item.description}</p>

                    <div className="pf-tags">
                      {item.technologies.slice(0, 3).map(tech => (
                        <span className="pf-tag" key={tech}>
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="pf-footer">
                      <span className="pf-view">
                        View Details
                      </span>
                      <span className="pf-arrow">
                        <ArrowUpRight size={18} strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
