import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, MapPin, MessageCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/products/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Product } from '@/types/database';
import { companyInfo } from '@/config/company';

export default function Home() {
    // Fetch ALL products for the single page layout
    const { data: products = [] } = useQuery({
        queryKey: ['all-products'],
        queryFn: async () => {
            const data = await api.products.list(); // No limit
            return (data || []).map((p: any) => ({
                ...p,
                specs: p.specs || [],
                images: p.images || [],
                tags: p.tags || []
            })) as Product[];
        },
    });

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section id="hero" className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                            {companyInfo.tagline}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            {companyInfo.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#products">
                                <Button size="lg" className="w-full sm:w-auto">
                                    View Products
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </a>
                            <a href="#contact">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    Request Quote
                                </Button>
                            </a>
                            <a
                                href={`https://wa.me/${companyInfo.contact.whatsapp.replace(/\s/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    WhatsApp
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {companyInfo.services.map((service, index) => (
                            <Card key={index}>
                                <CardContent className="p-6 text-center">
                                    <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                                    <h3 className="font-semibold text-lg">{service}</h3>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* All Products Section */}
            <section id="products" className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Our Products</h2>
                        <p className="text-muted-foreground">Browse our complete extensive catalog</p>
                    </div>
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No products found.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Get In Touch</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">Phone</h3>
                                <a href={`tel:${companyInfo.contact.phone}`} className="text-muted-foreground hover:text-primary">
                                    {companyInfo.contact.phone}
                                </a>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">Email</h3>
                                <a href={`mailto:${companyInfo.contact.emails[0]}`} className="text-muted-foreground hover:text-primary">
                                    {companyInfo.contact.emails[0]}
                                </a>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">Location</h3>
                                <p className="text-muted-foreground">{companyInfo.contact.address}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
