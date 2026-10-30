import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import NotFound from '../pages/NotFound'

const Home = lazy(() => import('../pages/Home'))
const About = lazy(() => import('../pages/About'))
const Services = lazy(() => import('../pages/Services'))
const ServiceDetail = lazy(() => import('../pages/ServiceDetail'))
const Portfolio = lazy(() => import('../pages/Portfolio'))
const PortfolioDetail = lazy(() => import('../pages/PortfolioDetail'))
const Team = lazy(() => import('../pages/Team'))
const HRCareers = lazy(() => import('../pages/HRCareers'))
const Contact = lazy(() => import('../pages/Contact'))
const GetAQuote = lazy(() => import('../pages/GetAQuote'))

function PageLoader() {
  return (
    <div className="page-loader">
      <div className="page-loader-spinner" />
      <span>Loading...</span>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
        <Route path="/team" element={<Team />} />
        <Route path="/hr-careers" element={<HRCareers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/get-a-quote" element={<GetAQuote />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
