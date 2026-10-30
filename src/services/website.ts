export interface Service {
  id: number
  title: string
  description: string
  icon: string
  features: string[]
}

export interface PricingPlan {
  id: number
  name: string
  tag: string
  subtitle: string
  price: string
  period: string
  features: string[]
  highlighted: boolean
  image: string
}

export const services: Service[] = [
  {
    id: 1,
    title: 'E-Commerce Solutions',
    description: 'Powerful online stores that sell. We build scalable e-commerce platforms with secure payments and smooth checkout experiences.',
    icon: 'shopping-cart',
    features: [
      'Custom Store Design',
      'Payment Gateway Integration',
      'Inventory & Order Management',
      'Mobile-First Shopping Experience',
      'SEO & Conversion Optimization',
    ],
  },
  {
    id: 2,
    title: 'Website Development',
    description: 'Professional websites built with modern technologies. Fast, responsive, and designed to convert visitors into customers.',
    icon: 'globe',
    features: [
      'React / Next.js Development',
      'Fully Responsive Design',
      'SEO Optimized Architecture',
      'CMS Integration',
      'Lightning Fast Performance',
    ],
  },
  {
    id: 3,
    title: 'Hosting & Infrastructure',
    description: 'Reliable, secure, and lightning-fast hosting. We keep your website online with 99.9% uptime and global CDN delivery.',
    icon: 'cloud',
    features: [
      '99.9% Uptime Guarantee',
      'SSL Certificates Included',
      'Global CDN & Caching',
      'Daily Automated Backups',
      'Domain & DNS Management',
    ],
  },
  {
    id: 4,
    title: 'Full Support & Maintenance',
    description: 'We do not disappear after launch. Ongoing support, updates, monitoring, and improvements to keep your business running.',
    icon: 'shield-check',
    features: [
      '24/7 Technical Support',
      'Regular Updates & Security Patches',
      'Performance Monitoring',
      'Bug Fixes & Improvements',
      'Monthly Reporting',
    ],
  },
]

export interface ServiceOffering {
  id: number
  slug: string
  title: string
  description: string
  details: string
  image: string
  to: string
  features: string[]
  benefits: string[]
  technologies: string[]
}

export const offerings: ServiceOffering[] = [
  {
    id: 1,
    slug: 'ecommerce-development',
    title: 'E-Commerce Development',
    description:
      'Custom online stores with secure payment, inventory management, and a smooth shopping experience.',
    details:
      'We build conversion-focused online stores tailored to your brand — from product catalog and cart to secure checkout and post-purchase flows. Every store is engineered for speed, mobile shoppers, and reliable order management, so you can sell more with less friction.',
    image: '/services/ecommerce.svg',
    to: '/services/ecommerce-development',
    features: [
      'Custom storefront design aligned with your brand',
      'Secure payment gateway integration (cards, UPI, wallets)',
      'Inventory, order & shipping management',
      'Mobile-first, high-converting checkout flows',
      'Discounts, coupons & abandoned cart recovery',
    ],
    benefits: [
      'Launch faster with a store built for sales, not just looks',
      'Reduce cart abandonment with a smooth checkout',
      'Manage products and orders from one dashboard',
    ],
    technologies: ['React', 'Node.js', 'Stripe', 'Razorpay', 'MongoDB', 'Cloud Hosting'],
  },
  {
    id: 2,
    slug: 'website-development',
    title: 'Website Development',
    description:
      'Responsive, modern and high-performance websites for all types of businesses.',
    details:
      'From corporate sites to landing pages, we craft fast, SEO-ready websites that look sharp on every device. Clean code, semantic structure, and optimized assets ensure your site ranks well and loads instantly for every visitor.',
    image: '/services/website.svg',
    to: '/services/website-development',
    features: [
      'Responsive design for mobile, tablet and desktop',
      'SEO-optimized semantic architecture',
      'CMS integration for easy content updates',
      'Lightning-fast page load performance',
      'Accessibility and cross-browser polish',
    ],
    benefits: [
      'A professional presence that builds instant trust',
      'Better rankings with SEO-ready foundations',
      'Easy content updates without touching code',
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vercel'],
  },
  {
    id: 3,
    slug: 'domain-hosting',
    title: 'Domain & Hosting Setup',
    description:
      'Reliable domain registration and high-speed hosting with 99.9% uptime and CDN.',
    details:
      'We handle everything from domain registration and DNS to server setup, SSL, and CDN configuration. Your site stays fast and online with monitored infrastructure, automated backups, and security patched at the server level.',
    image: '/services/hosting.svg',
    to: '/services/domain-hosting',
    features: [
      'Domain registration, transfer & DNS management',
      '99.9% uptime on premium cloud hosting',
      'Free SSL certificates and hardened security',
      'Global CDN for fast worldwide delivery',
      'Daily automated backups with one-click restore',
    ],
    benefits: [
      'Zero downtime worries with monitored infrastructure',
      'Faster load times for visitors anywhere',
      'One team for domain, hosting and support',
    ],
    technologies: ['AWS', 'Cloudflare', 'Nginx', 'Linux', 'Let’s Encrypt', 'cPanel'],
  },
  {
    id: 4,
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    description:
      'Creative and user-friendly designs that improve engagement and brand identity.',
    details:
      'We design interfaces people love to use — research-driven wireframes, striking visuals, and interactive prototypes validated before a single line of code. The result is a product that feels effortless and looks unmistakably yours.',
    image: '/services/uiux.svg',
    to: '/services/ui-ux-design',
    features: [
      'User research, personas & journey mapping',
      'Wireframes and interactive prototypes',
      'Modern, brand-consistent visual design',
      'Usability testing & iteration',
      'Design systems for long-term consistency',
    ],
    benefits: [
      'Higher engagement through intuitive flows',
      'Stronger, more memorable brand identity',
      'Fewer costly redesigns after launch',
    ],
    technologies: ['Figma', 'Adobe XD', 'Illustrator', 'Photoshop', 'Framer', 'Maze'],
  },
  {
    id: 5,
    slug: 'seo-optimization',
    title: 'SEO & Performance Optimization',
    description:
      "Improve your website's visibility, speed, and performance to attract more customers.",
    details:
      'We combine technical SEO, Core Web Vitals tuning, and content strategy to move your site up the rankings and keep it there. Every page is audited for speed, crawlability, and conversion so more of your traffic turns into customers.',
    image: '/services/seo.svg',
    to: '/services/seo-optimization',
    features: [
      'Full technical SEO audit & fixes',
      'Core Web Vitals and page-speed optimization',
      'Keyword research & on-page optimization',
      'Structured data and sitemap setup',
      'Monthly performance & ranking reports',
    ],
    benefits: [
      'More organic traffic without paid ads',
      'Faster pages that keep visitors engaged',
      'Clear reporting on rankings and ROI',
    ],
    technologies: ['Google Search Console', 'GA4', 'Lighthouse', 'Screaming Frog', 'Schema.org'],
  },
  {
    id: 6,
    slug: 'technical-support',
    title: '24/7 Technical Support',
    description:
      'Get continuous support for maintenance, updates, and troubleshooting.',
    details:
      'Real humans, around the clock. Whether it is a midnight outage, a content update, or a tricky bug, our support team responds fast and resolves issues before they impact your customers — with clear communication at every step.',
    image: '/services/support.svg',
    to: '/services/technical-support',
    features: [
      '24/7 availability via chat, email and phone',
      'Fast response and resolution SLAs',
      'Proactive monitoring & alerting',
      'Bug fixes, updates and emergency patches',
      'Dedicated support portal with ticket history',
    ],
    benefits: [
      'Peace of mind — help is always one click away',
      'Less downtime for your business',
      'Predictable support costs, no surprises',
    ],
    technologies: ['Slack', 'Jira', 'Zendesk', 'PagerDuty', 'GitHub'],
  },
  {
    id: 9,
    slug: 'full-support',
    title: 'Full Support',
    description:
      '24/7 technical support, maintenance, and troubleshooting to keep your business running smoothly.',
    details:
      'We provide comprehensive support and maintenance services to keep your digital presence running smoothly. From 24/7 monitoring and emergency patches to regular updates and performance optimization, we ensure your website and applications are always at their best.',
    image: '/services/support.svg',
    to: '/services/full-support',
    features: [
      '24/7 Technical Support via chat, email and phone',
      'Fast response and resolution SLAs',
      'Proactive monitoring & alerting',
      'Bug fixes, updates and emergency patches',
      'Regular security updates & patches',
      'Performance monitoring & optimization',
      'Content & layout updates on request',
      'Monthly reporting & insights',
    ],
    benefits: [
      'Peace of mind — help is always one click away',
      'Less downtime for your business',
      'Predictable support costs, no surprises',
      'Proactive issue prevention',
    ],
    technologies: ['Slack', 'Jira', 'Zendesk', 'PagerDuty', 'GitHub', 'Datadog', 'Sentry'],
  },
  {
    id: 7,
    slug: 'security-backups',
    title: 'Security & Daily Backups',
    description:
      'Keep your website and data safe with advanced security and automatic backups.',
    details:
      'From firewall rules and malware scanning to encrypted daily backups stored off-site, we protect your site against attacks, hacks, and data loss. If anything ever goes wrong, your data is restored within minutes — guaranteed.',
    image: '/services/security.svg',
    to: '/services/security-backups',
    features: [
      'Web application firewall & DDoS protection',
      'Continuous malware scanning & removal',
      'Encrypted daily off-site backups',
      'One-click disaster recovery & restore',
      'Uptime and security monitoring with alerts',
    ],
    benefits: [
      'Protect your revenue and customer trust',
      'Recover from incidents in minutes, not days',
      'Audit-ready security posture',
    ],
    technologies: ['Cloudflare', 'Wordfence', 'AWS S3', 'SSL/TLS', 'Fail2Ban'],
  },
  {
    id: 8,
    slug: 'maintenance',
    title: 'Ongoing Maintenance',
    description:
      'Regular updates, feature enhancements, and performance monitoring for long-term growth.',
    details:
      'Your website is a living product. Our maintenance plans keep it fresh with dependency updates, security patches, performance tuning, and a steady stream of small improvements — so it keeps pace with your business year after year.',
    image: '/services/maintenance.svg',
    to: '/services/maintenance',
    features: [
      'Weekly core, plugin & dependency updates',
      'Continuous performance monitoring',
      'Monthly improvement sprints',
      'Content & layout updates on request',
      'Quarterly strategy & growth reviews',
    ],
    benefits: [
      'Your site stays fast, modern and secure',
      'Small issues fixed before they become big ones',
      'A long-term partner invested in your growth',
    ],
    technologies: ['GitHub Actions', 'Lighthouse CI', 'Sentry', 'Datadog', 'Notion'],
  },
]

export function getServiceBySlug(slug: string): ServiceOffering | undefined {
  return offerings.find(o => o.slug === slug)
}

const featuredSlugs = [
  'ecommerce-development',
  'website-development',
  'domain-hosting',
  'full-support',
]

export const featuredServices: ServiceOffering[] = featuredSlugs
  .map(slug => offerings.find(o => o.slug === slug))
  .filter((o): o is ServiceOffering => Boolean(o))

export const pricingPlans: PricingPlan[] = [
  {
    id: 1,
    name: 'Starter',
    tag: 'starter',
    subtitle: 'For starting businesses',
    price: '$999',
    period: 'one-time payment',
    features: [
      '5 Page Business Website',
      'Responsive Mobile Design',
      'Basic SEO Setup',
      'Contact Form Integration',
      '1 Month Hosting Free',
      '30 Days Technical Support',
    ],
    highlighted: false,
    image: '/pricing/starter.svg',
  },
  {
    id: 2,
    name: 'Business',
    tag: 'business',
    subtitle: 'Best for growing businesses',
    price: '$2,999',
    period: 'one-time payment',
    features: [
      '15 Page Professional Website',
      'Responsive Mobile Design',
      'E-Commerce Ready',
      'Advanced SEO Optimization',
      'CMS Integration',
      '1 Year Hosting Free',
      '6 Months Technical Support',
    ],
    highlighted: true,
    image: '/pricing/business.svg',
  },
  {
    id: 3,
    name: 'Enterprise',
    tag: 'enterprise',
    subtitle: 'For ambitious businesses',
    price: 'Custom',
    period: 'quote based on your needs',
    features: [
      'Unlimited Pages',
      'Full E-Commerce Platform',
      'Custom Features & API',
      'Premium Hosting Included',
      '12 Months Full Support',
      'Dedicated Account Manager',
    ],
    highlighted: false,
    image: '/pricing/enterprise.svg',
  },
]

export function getServices(): Service[] {
  return services
}

export function getServiceById(id: number): Service | undefined {
  return services.find(s => s.id === id)
}
