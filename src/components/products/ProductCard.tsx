import { Link } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/database';
import { toast } from 'sonner';

import { getImageUrl } from '@/lib/utils';

import { companyInfo } from '@/config/company';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const handleAddToQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const message = encodeURIComponent(
      `Hi HumbleBoss, I'm interested in the product: ${product.title}\n\nLink: ${window.location.origin}/products/${product.slug}`
    );
    const whatsappUrl = `https://wa.me/${companyInfo.contact.whatsapp.replace(/\s+/g, '')}?text=${message}`;

    window.open(whatsappUrl, '_blank');
    toast.success(`Opening WhatsApp for ${product.title}`);
  };

  const mainSpec = product.specs?.[0];
  const imageUrl = getImageUrl(product.images?.[0]);

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {product.is_featured && (
            <Badge className="absolute top-3 left-3 bg-primary">
              Featured
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.title}
          </h3>
          {product.short_description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {product.short_description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {mainSpec && (
              <Badge variant="secondary" className="text-xs">
                {mainSpec.label}: {mainSpec.value}
              </Badge>
            )}
            {product.price_range && (
              <Badge variant="outline" className="text-xs">
                {product.price_range}
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={handleAddToQuote}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add to Quote
        </Button>
        <Link to={`/products/${product.slug}`}>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
