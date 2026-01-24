# HumbleBoss Technical Services

A modern, professional website showcasing industrial water treatment equipment, stainless steel fabrication, and technical services.

## 🚀 Features

- **Hero Carousel**: Auto-playing background carousel with industry imagery (milk processing, water refilling, welding)
- **Product Catalog**: 9 categories with 35+ products including:
  - Water Treatment Setups
  - Reverse Osmosis Filters
  - Stainless Steel Products
  - Industrial Purifiers
  - Milk Processing Equipment
  - Water Refill & ATM Systems
  - Kitchen Equipment
  - Medical Stainless Steel
  - Accessories (pumps, filters, valves)
- **Smart Navigation**: Category filtering, direct WhatsApp integration
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **SEO Optimized**: Meta tags, semantic HTML, proper heading structure

## 📦 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS + Shadcn/ui components
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **Carousel**: Embla Carousel with Autoplay

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd humbleflow-quotes

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:5173`

### Build for Production

```bash
# Build static files
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/        # React components
│   ├── layout/       # Header, Footer, Navbar
│   ├── products/     # ProductCard, CategoryFilter
│   └── ui/           # Shadcn/ui components
├── config/           # Company info & settings
├── lib/              # Data, API, utilities
├── pages/            # Route pages (Home, Products, ProductDetail)
└── types/            # TypeScript type definitions

public/
├── Images/           # Product images
├── accessories/      # Accessory product images
└── logo.png          # Company logo
```

## 🎨 Customization

### Update Company Information

Edit `src/config/company.ts`:
```typescript
export const companyInfo = {
  name: "Your Company Name",
  tagline: "Your Tagline",
  contact: { ... },
  services: [ ... ]
}
```

### Add Products

Edit `src/lib/data.ts`:
```typescript
export const PRODUCTS: Product[] = [
  {
    id: 'your-id',
    title: 'Product Name',
    short_description: 'Compelling benefit-focused description',
    category_id: 'service-X',
    // ... other fields
  }
]
```

### Styling

- Global styles: `src/index.css`
- Tailwind config: `tailwind.config.ts`
- Component variants: `src/components/ui/`

## 📱 Key Pages

- **/** - Home with hero, services, products by category
- **/products** - All products with category filtering
- **/products/:slug** - Individual product details

## 🚢 Deployment

This is a static site. Deploy to:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag `dist/public` folder
- **GitHub Pages**: Enable in repo settings

Build output is in `dist/public/`

## 📞 Contact Integration

WhatsApp integration for quote requests:
- Click "Add to Quote" on any product
- Opens WhatsApp with pre-filled message
- Phone number configured in `src/config/company.ts`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is private and proprietary.

## 🔧 Support

For technical support, contact [your-email@example.com]

---

Built with ❤️ for HumbleBoss Technical Services
