import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/products/ProductCard';
import { useCart } from '@/hooks/useCart';
import { Product, ProductSpec } from '@/types/database';
import { useState } from 'react';
import { toast } from 'sonner';
import { getImageUrl } from '@/lib/utils';
import { companyInfo } from '@/config/company';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  // Fetch product
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const products = await api.products.list({ slug });
      if (products.length === 0) throw new Error('Product not found');

      const data = products[0];
      return {
        ...data,
        specs: data.specs || [],
        images: data.images || [],
        tags: data.tags || []
      } as Product;
    },
    enabled: !!slug,
  });

  // Fetch related products
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.category_id, product?.id],
    queryFn: async () => {
      const data = await api.products.list({
        category_id: product?.category_id || undefined,
        exclude_id: product?.id,
        limit: 4
      });

      return (data || []).map((p: any) => ({
        ...p,
        specs: p.specs || [],
        images: p.images || [],
        tags: p.tags || []
      })) as Product[];
    },
    enabled: !!product?.category_id,
  });

  const handleAddToQuote = () => {
    if (!product) return;

    const message = encodeURIComponent(
      `Hi HumbleBoss, I'm interested in: ${product.title}\nQuantity: ${quantity}\n\nLink: ${window.location.href}`
    );
    const whatsappUrl = `https://wa.me/${companyInfo.contact.whatsapp.replace(/\s+/g, '')}?text=${message}`;

    window.open(whatsappUrl, '_blank');
    toast.success(`Opening WhatsApp for ${product.title}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <Skeleton className="h-6 w-32 mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const images = product.images.length > 0 ? product.images : ['/placeholder.svg'];

  return (
    <Layout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>

        {/* Product Detail */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={getImageUrl(images[selectedImage])}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.category && (
              <Link
                to={`/products?category=${product.category.id}`}
                className="text-sm text-primary hover:underline"
              >
                {product.category.title}
              </Link>
            )}

            <h1 className="text-3xl font-bold text-foreground mt-2 mb-4">
              {product.title}
            </h1>

            {product.short_description && (
              <p className="text-lg text-muted-foreground mb-6">
                {product.short_description}
              </p>
            )}

            {product.price_range && (
              <div className="mb-6">
                <span className="text-2xl font-bold text-primary">
                  {product.price_range}
                </span>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-foreground">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Quote Button */}
            <Button size="lg" className="w-full mb-8" onClick={handleAddToQuote}>
              <Plus className="mr-2 h-5 w-5" />
              Add to Quote Cart
            </Button>

            {/* Specifications */}
            {product.specs.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <h3 className="font-semibold text-foreground p-4 border-b">
                    Technical Specifications
                  </h3>
                  <div className="divide-y">
                    {product.specs.map((spec, index) => (
                      <div key={index} className="flex justify-between p-4">
                        <span className="text-muted-foreground">{spec.label}</span>
                        <span className="font-medium text-foreground">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Description</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
