import Hero from '../components/Hero'
import Services from '../components/Services'
import ServicesList from '../components/ServicesList'
import About from '../components/About'
import Portfolio from '../components/Portfolio'
import Team from '../components/Team'
import CTA from '../components/CTA'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesList />
      <Services />
      <About />
      <Portfolio />
      <Team />
      <CTA />
      <Contact />
    </>
  )
}
