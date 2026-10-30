import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from './hooks/useTheme'
import SmoothScroll from './components/SmoothScroll'
import ScrollToTop from './components/ScrollToTop'
import Header from './components/Header'
import Footer from './components/Footer'
import AppRoutes from './routes'

function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <SmoothScroll>
          <ScrollToTop />
          <div className="app">
            <Header />
            <main>
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      </MotionConfig>
    </ThemeProvider>
  )
}

export default App
