import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../lib/utils'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/team', label: 'Team' },
  { path: '/hr-careers', label: 'HR & Careers' },
  { path: '/get-a-quote', label: 'Get a Quote' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const themeLabel = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'

  return (
    <header className="header header-3d">
      <div className="container">
        <nav className="nav nav-3d">
          <Link to="/" className="logo logo-3d" aria-label="Quantivo Solutions home">
            <img
              src="/images/quantivo-logo.svg"
              alt="Quantivo Solutions Logo"
              className="logo-img logo-img-3d"
              width={52}
              height={52}
            />
            <span className="logo-text logo-text-3d">QUANTIVO <span>SOLUTIONS</span></span>
          </Link>

          <ul id="primary-nav" className={cn('nav-links nav-links-3d', isOpen && 'open')}>
            {navLinks.map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={cn('nav-link-3d', location.pathname === link.path ? 'active' : '')}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-right nav-right-3d">
            <button
              className="theme-toggle theme-toggle-3d"
              onClick={toggleTheme}
              aria-label={themeLabel}
              title={themeLabel}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              className="menu-toggle menu-toggle-3d"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              aria-controls="primary-nav"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}