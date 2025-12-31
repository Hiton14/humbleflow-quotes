export interface Category {
    id: string;
    title: string;
    slug: string;
    description: string;
    image_url: string;
}

export interface Product {
    id: string;
    title: string;
    slug: string;
    description: string;
    short_description: string;
    price_range: string;
    category_id: string;
    is_featured: boolean;
    specs: { label: string; value: string }[];
    tags: string[];
    images: string[];
}

export const CATEGORIES: Category[] = [
    {
        id: '1',
        title: 'Electronics',
        slug: 'electronics',
        description: 'Latest gadgets and electronic devices',
        image_url: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?auto=format&fit=crop&q=80&w=2070',
    },
    {
        id: '2',
        title: 'Office Supplies',
        slug: 'office-supplies',
        description: 'Essential supplies for your office',
        image_url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070',
    },
];

export const PRODUCTS: Product[] = [
    {
        id: '1',
        title: 'Premium Wireless Headphones',
        slug: 'premium-wireless-headphones',
        description: 'Experience high-fidelity sound with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions.',
        short_description: 'High-fidelity wireless headphones with noise cancellation.',
        price_range: '$250 - $300',
        category_id: '1',
        is_featured: true,
        specs: [
            { label: 'Battery Life', value: '30 hours' },
            { label: 'Connectivity', value: 'Bluetooth 5.0' },
        ],
        tags: ['audio', 'wireless', 'premium'],
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=2070',
        ],
    },
    {
        id: '2',
        title: 'Ergonomic Office Chair',
        slug: 'ergonomic-office-chair',
        description: 'Boost your productivity with this ergonomic office chair. Designed for comfort with lumbar support, adjustable height, and breathable mesh back.',
        short_description: 'Comfortable ergonomic chair for long work hours.',
        price_range: '$150 - $200',
        category_id: '2',
        is_featured: true,
        specs: [
            { label: 'Material', value: 'Mesh & Plastic' },
            { label: 'Max Load', value: '120kg' },
        ],
        tags: ['furniture', 'office', 'ergonomic'],
        images: [
            'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1000',
        ],
    },
    {
        id: '3',
        title: 'Mechanical Keyboard',
        slug: 'mechanical-keyboard',
        description: 'Tactile and responsive mechanical keyboard with RGB backlighting. Perfect for typing enthusiasts and gamers alike.',
        short_description: 'RGB mechanical keyboard with blue switches.',
        price_range: '$80 - $120',
        category_id: '1',
        is_featured: false,
        specs: [
            { label: 'Switch Type', value: 'Blue clicky' },
            { label: 'Backlight', value: 'RGB' },
        ],
        tags: ['electronics', 'keyboard', 'gaming'],
        images: [
            'https://images.unsplash.com/photo-1587829741301-dc798b91add1?auto=format&fit=crop&q=80&w=2070',
        ],
    },
];
