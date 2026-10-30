import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Layers, Cpu, Globe, ExternalLink, MessageCircle, AlertTriangle, Lightbulb } from 'lucide-react'
import { getPortfolioItemBySlug, portfolioItems } from '../services/contact'
import NotFound from './NotFound'
import { fadeInUp, staggerContainer, scaleIn } from '../lib/animations'

export default function PortfolioDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getPortfolioItemBySlug(slug) : undefined

  if (!project) return <NotFound />

  const related = portfolioItems
    .filter(item => item.category === project.category && item.id !== project.id)
    .slice(0, 3)

  return (
    <section className="section pd-section">
      <div className="pd-deco pd-deco-dots" aria-hidden="true" />
      <div className="pd-deco pd-deco-glow" aria-hidden="true" />

      <div className="container">
        <motion.div
          className="pd-top"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Link to="/portfolio" className="pd-back">
              <ArrowLeft size={16} strokeWidth={2.5} />
              Back to Portfolio
            </Link>
          </motion.div>

          <div className="pd-hero">
            <motion.div className="pd-hero-text" variants={fadeInUp}>
              <span className="pd-category">{project.category}</span>
              <h1 className="pd-title">{project.title}</h1>
              <p className="pd-lead">{project.description}</p>
              <p className="pd-details">{project.details}</p>
              <div className="pd-actions">
                {project.liveDemoUrl && (
                  <Link to={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <Globe size={16} />
                    Live Demo
                  </Link>
                )}
                {project.githubUrl && (
                  <Link to={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                    <ExternalLink size={16} />
                    GitHub
                  </Link>
                )}
                <Link to="/contact" className="btn btn-primary">
                  <MessageCircle size={16} />
                  Get a Quote
                </Link>
                <Link to="/portfolio" className="btn btn-outline">
                  Back to Portfolio
                </Link>
              </div>
            </motion.div>

            <motion.div className="pd-hero-media" variants={scaleIn}>
              <img src={project.image} alt={project.title} />
            </motion.div>
          </div>
        </motion.div>

        {project.objectives && project.objectives.length > 0 && (
          <motion.div
            className="pd-block pd-objectives"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 className="pd-block-title" variants={fadeInUp}>
              <Layers size={20} strokeWidth={2.5} />
              Project Objectives
            </motion.h2>
            <ul className="pd-features pd-objectives-list">
              {project.objectives.map(objective => (
                <motion.li key={objective} variants={fadeInUp}>
                  <span className="pd-check">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {objective}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        <motion.div
          className="pd-block"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.h2 className="pd-block-title" variants={fadeInUp}>
            <Layers size={20} strokeWidth={2.5} />
            Key Features
          </motion.h2>
          <ul className="pd-features">
            {project.features.map(feature => (
              <motion.li key={feature} variants={fadeInUp}>
                <span className="pd-check">
                  <Check size={14} strokeWidth={3} />
                </span>
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {project.mainFunctionalities && project.mainFunctionalities.length > 0 && (
          <motion.div
            className="pd-block"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 className="pd-block-title" variants={fadeInUp}>
              <Cpu size={20} strokeWidth={2.5} />
              Main Functionalities
            </motion.h2>
            <ul className="pd-features pd-functionalities-list">
              {project.mainFunctionalities.map(func => (
                <motion.li key={func} variants={fadeInUp}>
                  <span className="pd-check">
                    <Check size={14} strokeWidth={3} />
                  </span>
                  {func}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {project.challenges && project.challenges.length > 0 && project.solutions && project.solutions.length > 0 && (
          <motion.div
            className="pd-block pd-challenges"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 className="pd-block-title" variants={fadeInUp}>
              <AlertTriangle size={20} strokeWidth={2.5} />
              Challenges & Solutions
            </motion.h2>
            <div className="pd-challenges-grid">
              {project.challenges.map((challenge, index) => {
                const solution = project.solutions?.[index] || 'Custom solution implemented';
                return (
                  <motion.div className="pd-challenge-card" key={index} variants={fadeInUp}>
                    <div className="pd-challenge-icon">
                      <AlertTriangle size={24} strokeWidth={2.5} />
                    </div>
                    <div className="pd-challenge-content">
                      <h4>Challenge</h4>
                      <p>{challenge}</p>
                    </div>
                    <div className="pd-solution-content">
                      <h4>Solution</h4>
                      <p>{solution}</p>
                    </div>
                    <div className="pd-solution-icon">
                      <Lightbulb size={24} strokeWidth={2.5} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div
          className="pd-block"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.h2 className="pd-block-title" variants={fadeInUp}>
            <Cpu size={20} strokeWidth={2.5} />
            Technologies Used
          </motion.h2>
          <motion.div className="pd-tech" variants={fadeInUp}>
            {project.technologies.map(tech => (
              <span className="pd-chip" key={tech}>
                {tech}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="pd-cta"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp}>
            Ready to start your <span>{project.title}</span> project?
          </motion.h2>
          <motion.p variants={fadeInUp}>
            Tell us about your goals — we will reply within 24 hours with a tailored plan.
          </motion.p>
          <motion.div className="pd-actions pd-cta-actions" variants={fadeInUp}>
            <Link to="/contact" className="btn btn-primary">
              Get a Quote
              <ArrowRight size={16} />
            </Link>
            <Link to="/portfolio" className="btn btn-outline">
              Back to Portfolio
            </Link>
          </motion.div>
        </motion.div>

        {related.length > 0 && (
          <motion.div
            className="pd-related"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 className="pd-block-title" variants={fadeInUp}>
              More {project.category} Projects
            </motion.h2>
            <motion.div className="pd-related-grid" variants={staggerContainer}>
              {related.map(item => (
                <motion.div variants={fadeInUp} key={item.id}>
                  <Link to={`/portfolio/${item.slug}`} className="pd-related-card">
                    <div className="pd-related-media">
                      <img src={item.image} alt={item.title} loading="lazy" />
                    </div>
                    <div className="pd-related-body">
                      <span className="pd-related-cat">{item.category}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <span className="pd-related-link">
                        View Details <ArrowRight size={14} strokeWidth={2.5} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}