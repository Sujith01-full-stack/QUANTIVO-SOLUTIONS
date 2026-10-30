# QUANTIVO SOLUTIONS

A full UI company website built with **React + TypeScript + Vite**.

## Brand

- **Name:** Quantivo Solutions
- **Colors:** Black · Orange (#ff6600) · White only
- **Themes:** White (light) and Black (dark) — toggle in navbar
- **Team:** 3 team leaders
- **Services:** E-Commerce · Website Development · Hosting · Full Support
- **Demo Projects:** Included in Portfolio with category filters

## Getting Started

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview build
```

## Folder Structure

```
quantivo-company-react/
├── public/
│   ├── images/        hero.svg, about.svg (black/orange/white)
│   ├── logos/         logo.svg, favicon.svg
│   ├── icons/         UI icons
│   └── portfolio/     project1-3.svg demo project images
│
├── src/
│   ├── components/
│   │   ├── Header/    sticky navbar + theme toggle
│   │   ├── Footer/    dark footer
│   │   ├── Hero/      hero with stats + service card
│   │   ├── Services/  4 services + 3 pricing plans
│   │   ├── About/     about + features
│   │   ├── Portfolio/ 6 demo projects with filters
│   │   ├── Team/      3 team leaders
│   │   ├── Contact/   contact form + info
│   │   ├── CTA/       orange call-to-action banner
│   │   └── UI/        Button, Card, Input, Textarea
│   │
│   ├── pages/
│   │   ├── Home.tsx  About.tsx  Services.tsx
│   │   ├── Portfolio.tsx  Team.tsx  Contact.tsx
│   │
│   ├── services/
│   │   ├── ecommerce.ts   product data
│   │   ├── website.ts     services + pricing data
│   │   └── contact.ts     team, portfolio, form API
│   │
│   ├── hooks/
│   │   └── useTheme.tsx   light/dark theme provider
│   │
│   ├── styles/
│   │   ├── global.css     all component styles
│   │   ├── light.css      white theme variables
│   │   └── dark.css       black theme variables
│   │
│   ├── App.tsx   routes
│   └── main.tsx  entry
│
├── package.json  vite.config.ts  tsconfig.json  index.html
└── README.md  .gitignore
```

## Routes

| Route       | Page                              |
|-------------|-----------------------------------|
| `/`         | Home (Hero, Services, About, Work, Team, CTA, Contact) |
| `/about`    | About + Team + CTA                |
| `/services` | Services + Pricing + CTA + Contact |
| `/portfolio`| Demo Projects + CTA + Contact      |
| `/team`     | 3 Team Leaders + CTA + Contact     |
| `/contact`  | Contact form                      |

## Theme

Toggle 🌙/☀️ in the navbar. Colors are controlled by CSS variables:

- `light.css` → white background, black text, orange accent
- `dark.css` → black background, white text, orange accent
