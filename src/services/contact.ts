export interface ContactFormData {
  name: string
  email: string
  phone?: string
  service: string
  message: string
}

export interface TeamMember {
  id: number
  name: string
  role: string
  initials: string
  bio: string
  social: {
    linkedin?: string
    twitter?: string
    github?: string
  }
}

export interface PortfolioItem {
  id: number
  slug: string
  title: string
  category: 'E-Commerce' | 'Website' | 'Hosting' | 'Support'
  image: string
  description: string
  details: string
  technologies: string[]
  features: string[]
  objectives?: string[]
  challenges?: string[]
  solutions?: string[]
  mainFunctionalities?: string[]
  liveDemoUrl?: string
  githubUrl?: string
  link?: string
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Shyam',
    role: 'Full Stack Developer',
    initials: 'S',
    bio: 'Full stack developer with 2+ years of experience — Angular on the frontend and .NET on the backend.',
    social: { linkedin: '#', twitter: '#', github: '#' },
  },
  {
    id: 2,
    name: 'Ajay',
    role: 'Full Stack Developer',
    initials: 'A',
    bio: 'Full stack developer with 1.8+ years of experience — React on the frontend, .NET and Django on the backend, and Flutter mobile apps.',
    social: { linkedin: '#', twitter: '#', github: '#' },
  },
  {
    id: 3,
    name: 'Sujith',
    role: 'Full Stack Developer',
    initials: 'S',
    bio: 'Full stack developer with 1+ year of experience — React and Next.js on the frontend, Django on the backend.',
    social: { linkedin: '#', twitter: '#', github: '#' },
  },
]

export const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    slug: 'nova-fashion-store',
    title: 'Nova Fashion Store',
    category: 'E-Commerce',
    image: '/images/portfolio/nova-fashion-store.svg',
    description: 'Full-featured fashion e-commerce store with 500+ products, wishlist, and secure checkout.',
    details:
      'Nova Fashion Store is a complete fashion e-commerce platform built for a growing retail brand. The storefront supports advanced product filtering, wishlist management, abandoned cart recovery, and PCI-compliant checkout with multiple payment gateways. An admin dashboard handles inventory, orders, coupons, and sales analytics in real time.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
    features: [
      '500+ product catalog with smart search and filters',
      'Secure checkout with Stripe and COD options',
      'Wishlist, cart, and abandoned cart recovery',
      'Admin dashboard with live sales analytics',
      'Responsive design optimized for mobile shopping',
    ],
    objectives: [
      'Build a scalable e-commerce platform for 500+ products',
      'Implement seamless checkout with multiple payment options',
      'Provide real-time inventory and order management',
      'Create an intuitive admin dashboard for store management',
    ],
    mainFunctionalities: [
      'Product catalog with categories, filters, and search',
      'Shopping cart with persistent storage',
      'Multi-payment gateway integration (Stripe, COD)',
      'Order tracking and status notifications',
      'Admin panel for products, orders, and analytics',
    ],
    challenges: [
      'Handling high traffic during flash sales',
      'Ensuring PCI compliance for payment processing',
      'Real-time inventory sync across multiple warehouses',
    ],
    solutions: [
      'Implemented Redis caching and CDN for performance',
      'Used Stripe Elements for PCI-compliant payments',
      'Built event-driven inventory sync with WebSocket updates',
    ],
    liveDemoUrl: 'https://nova-fashion-demo.quantivosolutions.com',
    githubUrl: 'https://github.com/quantivo/nova-fashion-store',
  },
  {
    id: 2,
    slug: 'quantivo-demo-website',
    title: 'Quantivo Demo Website',
    category: 'Website',
    image: '/images/portfolio/quantivo-demo-website.svg',
    description: 'This very website — a modern React agency template with dark/light themes and animations.',
    details:
      'The Quantivo Solutions website itself — a premium agency marketing site built with React, TypeScript, and Vite. It features a hand-crafted dark/light theme system, smooth scroll, framer-motion page transitions, lazy-loaded routes, and fully responsive layouts from 320px to 1440px+. Every section was designed and animated in-house.',
    technologies: ['React', 'TypeScript', 'Vite', 'Framer Motion', 'CSS Variables'],
    features: [
      'Dark and light theme with system-aware toggle',
      'Smooth scroll and animated section reveals',
      'Lazy-loaded routes with a custom 404 page',
      'Mobile-first responsive design (320px–1440px+)',
      'Accessible focus states and semantic markup',
    ],
    objectives: [
      'Create a modern, performant agency website',
      'Implement seamless dark/light theme switching',
      'Achieve 90+ Lighthouse scores across all metrics',
      'Showcase Quantivo\'s capabilities through the site itself',
    ],
    mainFunctionalities: [
      'Smooth page transitions with Framer Motion',
      'System-aware dark/light mode with localStorage persistence',
      'Lazy-loaded code splitting for optimal performance',
      'Responsive layouts from 320px to 1440px+',
    ],
    challenges: [
      'Balancing animation performance with visual impact',
      'Maintaining 60fps animations on low-end devices',
      'Ensuring accessibility compliance with animations',
    ],
    solutions: [
      'Used CSS transforms and GPU acceleration for animations',
      'Implemented reduced-motion media query support',
      'Added prefers-reduced-motion to disable non-essential animations',
    ],
    liveDemoUrl: 'https://quantivosolutions.com',
    githubUrl: 'https://github.com/quantivo/quantivo-website',
  },
  {
    id: 3,
    slug: 'cloudhost-panel',
    title: 'CloudHost Panel',
    category: 'Hosting',
    image: '/images/portfolio/cloudhost-panel.svg',
    description: 'Custom hosting control panel with domain management, SSL, backups, and real-time monitoring.',
    details:
      'CloudHost Panel is a custom hosting control panel that gives customers and admins full control over domains, SSL certificates, backups, and server health. Real-time CPU, memory, and bandwidth charts update live, while automated workflows handle provisioning, renewal reminders, and one-click restores.',
    technologies: ['React', '.NET', 'PostgreSQL', 'SignalR', 'Docker'],
    features: [
      'Domain, DNS, and SSL management from one dashboard',
      'Real-time server monitoring with live charts',
      'Automated backups with one-click restore',
      'Role-based access for admins and customers',
      'Billing integration and renewal automation',
    ],
    objectives: [
      'Build a unified hosting control panel for customers and admins',
      'Provide real-time server health monitoring',
      'Automate routine hosting tasks (backups, SSL, renewals)',
      'Support multi-tenant architecture for hosting providers',
    ],
    mainFunctionalities: [
      'Domain registration, DNS management, and SSL provisioning',
      'Real-time resource monitoring (CPU, RAM, bandwidth, disk)',
      'Automated daily backups with one-click restore',
      'Multi-user roles (admin, reseller, customer)',
      'Automated billing and invoice generation',
    ],
    challenges: [
      'Real-time data streaming from multiple servers',
      'Secure multi-tenant isolation',
      'Handling long-running backup operations',
    ],
    solutions: [
      'Used SignalR for real-time server-to-client updates',
      'Implemented container-level isolation with Docker',
      'Used background job queues for async backup processing',
    ],
    liveDemoUrl: 'https://panel.cloudhost.demo',
    githubUrl: 'https://github.com/quantivo/cloudhost-panel',
  },
  {
    id: 4,
    slug: 'spiceroute-restaurant',
    title: 'SpiceRoute Restaurant',
    category: 'E-Commerce',
    image: '/images/portfolio/spiceroute-restaurant.svg',
    description: 'Online ordering system for a restaurant chain with table booking and delivery tracking.',
    details:
      'SpiceRoute is an online ordering and reservation platform for a multi-location restaurant chain. Guests can browse the live menu, place takeaway or delivery orders, book tables, and track delivery in real time. The kitchen display system syncs orders across branches, and the admin panel manages menus, staff, and promotions.',
    technologies: ['Next.js', 'Django', 'PostgreSQL', 'Google Maps', 'Twilio'],
    features: [
      'Live multi-location menu management',
      'Table booking with instant confirmation',
      'Real-time delivery tracking on the map',
      'Kitchen display system for order flow',
      'Promotions, loyalty points, and SMS alerts',
    ],
    objectives: [
      'Build a unified ordering platform for multi-location restaurants',
      'Enable real-time order tracking for customers',
      'Streamline kitchen operations with display system',
      'Integrate SMS and push notifications',
    ],
    mainFunctionalities: [
      'Multi-location menu management with real-time sync',
      'Table reservation system with availability calendar',
      'Live delivery tracking with Google Maps integration',
      'Kitchen display system (KDS) for order management',
      'SMS notifications via Twilio for order updates',
    ],
    challenges: [
      'Syncing menu changes across multiple locations in real-time',
      'Accurate ETA calculation for delivery tracking',
      'Handling high concurrency during peak hours',
    ],
    solutions: [
      'Used WebSockets for real-time menu and order sync',
      'Implemented Google Maps Directions API for ETA',
      'Used Redis caching and connection pooling for concurrency',
    ],
    liveDemoUrl: 'https://spiceroute-demo.quantivosolutions.com',
    githubUrl: 'https://github.com/quantivo/spiceroute-restaurant',
  },
  {
    id: 5,
    slug: 'buildright-construction',
    title: 'BuildRight Construction',
    category: 'Website',
    image: '/images/portfolio/buildright-construction.svg',
    description: 'Corporate website with project portfolio, quote calculator, and lead generation forms.',
    details:
      'BuildRight Construction needed a corporate website that showcases large-scale projects and converts visitors into qualified leads. The site includes an interactive project portfolio with photo galleries, an instant quote calculator for common services, and multi-step lead forms that route enquiries to the right sales rep automatically.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MySQL'],
    features: [
      'Interactive project portfolio with galleries',
      'Instant online quote calculator',
      'Multi-step lead generation forms',
      'CMS-backed content for case studies',
      'SEO-optimized pages for local search',
    ],
    objectives: [
      'Showcase construction projects with high-quality galleries',
      'Generate qualified leads through interactive tools',
      'Provide instant project estimates for common services',
      'Improve local SEO for construction services',
    ],
    mainFunctionalities: [
      'Project portfolio with filtering and lightbox galleries',
      'Instant quote calculator with dynamic pricing',
      'Multi-step lead forms with conditional logic',
      'CMS for team to update projects and case studies',
      'Local SEO optimization with structured data',
    ],
    challenges: [
      'Balancing visual-heavy portfolio with performance',
      'Complex quote calculator with many variables',
      'Form routing to correct sales representatives',
    ],
    solutions: [
      'Used next/image with lazy loading and blur placeholders',
      'Built calculator with modular pricing rules engine',
      'Implemented form routing based on project type and location',
    ],
    liveDemoUrl: 'https://buildright-demo.quantivosolutions.com',
    githubUrl: 'https://github.com/quantivo/buildright-construction',
  },
  {
    id: 6,
    slug: 'support-desk-24x7',
    title: '24/7 Support Desk',
    category: 'Support',
    image: '/images/portfolio/support-desk.svg',
    description: 'Ticket-based customer support portal with live chat integration and SLA tracking.',
    details:
      'The 24/7 Support Desk is a ticket-based customer support portal built for a SaaS client. Customers raise tickets through a web portal or live chat, agents respond from a unified inbox with canned replies, and managers track SLA compliance, first-response time, and CSAT scores on a live dashboard.',
    technologies: ['React', 'Django', 'WebSockets', 'Redis', 'Elasticsearch'],
    features: [
      'Ticket portal with live chat and email sync',
      'Agent inbox with canned replies and tagging',
      'SLA tracking with breach alerts',
      'Knowledge base and self-service articles',
      'CSAT reporting and agent performance metrics',
    ],
    objectives: [
      'Build a unified support platform for tickets and chat',
      'Provide real-time SLA monitoring and breach alerts',
      'Enable self-service through knowledge base',
      'Track agent performance and customer satisfaction',
    ],
    mainFunctionalities: [
      'Multi-channel ticketing (web, email, live chat)',
      'Real-time agent dashboard with ticket queues',
      'SLA timers with automated escalation',
      'Canned replies and macros for common issues',
      'CSAT surveys and detailed analytics dashboard',
    ],
    challenges: [
      'Real-time chat with WebSocket scaling',
      'Search across millions of tickets and articles',
      'Accurate SLA calculation with business hours',
    ],
    solutions: [
      'Used Redis Pub/Sub for WebSocket horizontal scaling',
      'Implemented Elasticsearch for full-text search',
      'Built configurable SLA engine with holiday calendars',
    ],
    liveDemoUrl: 'https://support-desk-demo.quantivosolutions.com',
    githubUrl: 'https://github.com/quantivo/support-desk-24x7',
  },
]

export function getPortfolioItemBySlug(slug: string): PortfolioItem | undefined {
  return portfolioItems.find(item => item.slug === slug)
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean }> {
  await new Promise(resolve => setTimeout(resolve, 900))
  console.log('Contact form submitted:', data)
  return { success: true }
}
