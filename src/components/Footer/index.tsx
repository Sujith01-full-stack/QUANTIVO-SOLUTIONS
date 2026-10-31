import { Link } from 'react-router-dom'
import { companyContact } from '../../services/siteConfig'

const companyLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Our Team', to: '/team' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'HR & Careers', to: '/hr-careers' },
  { label: 'Contact', to: '/contact' },
]

const serviceLinks = [
  { label: 'E-Commerce', to: '/services/ecommerce-development' },
  { label: 'Website Development', to: '/services/website-development' },
  { label: 'Hosting', to: '/services/domain-hosting' },
  { label: 'Full Support', to: '/services/technical-support' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <img
                src="/images/quantivo-logo.svg"
                alt="Quantivo Solutions Logo"
                className="logo-img"
                width={52}
                height={52}
              />
              <span className="logo-text">QUANTIVO <span>SOLUTIONS</span></span>
            </div>
            <p>
              We build e-commerce stores, professional websites, reliable hosting,
              and provide full support — so your business never goes offline.
            </p>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              {companyLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              {serviceLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href={`mailto:${companyContact.email}`}>{companyContact.email}</a></li>
              {companyContact.phoneDisplay.map((display, i) => (
                <li key={i}><a href={`tel:${companyContact.phoneDigits[i]}`}>{display}</a></li>
              ))}
              <li>{companyContact.location}</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Quantivo Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
