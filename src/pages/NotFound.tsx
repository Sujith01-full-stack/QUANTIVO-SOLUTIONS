import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { fadeInUp, staggerContainer } from '../lib/animations'

export default function NotFound() {
  return (
    <section className="notfound-section">
      <motion.div
        className="container text-center"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1 className="notfound-code" variants={fadeInUp}>404</motion.h1>
        <motion.h2 className="notfound-title" variants={fadeInUp}>
          Page Not Found
        </motion.h2>
        <motion.p className="notfound-text" variants={fadeInUp}>
          The page you are looking for does not exist or has been moved.
        </motion.p>
        <motion.div className="notfound-actions" variants={fadeInUp}>
          <Link to="/" className="btn btn-primary">
            <Home size={18} /> Back to Home
          </Link>
          <button className="btn btn-outline" onClick={() => history.back()}>
            <ArrowLeft size={18} /> Go Back
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
