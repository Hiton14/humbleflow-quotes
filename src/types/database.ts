export interface Category {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  images: string[];
  category_id: string | null;
  specs: ProductSpec[];
  price_range: string | null;
  tags: string[];
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
  category?: Category;
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  product_id: string;
  quantity: number;
  selected_options: Record<string, string>;
  created_at: string;
  product?: Product;
}

export type QuoteStatus = 'new' | 'contacted' | 'quoted' | 'closed';

export interface Quote {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company: string | null;
  county: string;
  town: string | null;
  notes: string | null;
  status: QuoteStatus;
  created_at: string;
  updated_at: string;
  items?: QuoteItem[];
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  company: string | null;
  created_at: string;
  updated_at: string;
}

export type AppRole = 'admin' | 'staff';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

// Cart types (stored in localStorage)
export interface CartItem {
  productId: string;
  productSlug: string;
  productTitle: string;
  productImage: string | null;
  quantity: number;
  selectedOptions: Record<string, string>;
}
