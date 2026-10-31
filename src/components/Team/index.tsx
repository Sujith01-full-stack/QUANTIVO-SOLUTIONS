import { motion } from 'framer-motion'
import { LinkedinIcon, GithubIcon } from '../UI/SocialIcons'
import { teamMembers } from '../../services/contact'
import { fadeInUp, staggerContainer } from '../../lib/animations'
import Card from '../UI/Card'

export default function Team() {
  return (
    <section className="section team-section">
      <div className="container">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.span className="section-label" variants={fadeInUp}>Our Team</motion.span>
          <motion.h2 className="section-title" variants={fadeInUp}>
            Meet Our Developers
          </motion.h2>
          <motion.p className="section-subtitle" variants={fadeInUp}>
            The full stack team that builds every project from idea to launch and beyond.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {teamMembers.map(member => (
            <motion.div key={member.id} variants={fadeInUp}>
              <Card className="team-card">
                <img src="/images/services/team-avatar.png" alt={member.name} className="team-avatar" />
                <h3>{member.name}</h3>
                <span className="team-role">{member.role}</span>
                <p>{member.bio}</p>
                <div className="team-social">
                  <a href={member.social.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                    <LinkedinIcon />
                  </a>
                  <a href={member.social.github} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                    <GithubIcon />
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
