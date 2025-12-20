import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { companyInfo } from '@/config/company';

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img
                            src="/logo.png"
                            alt="HumbleBoss Technical Services"
                            className="h-28 w-auto"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Contact Info & CTA */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <a href={`tel:${companyInfo.contact.phone}`} className="flex items-center text-sm text-muted-foreground hover:text-primary">
                            <Phone className="h-4 w-4 mr-1" />
                            {companyInfo.contact.phone}
                        </a>
                        <a
                            href={`https://wa.me/${companyInfo.contact.whatsapp.replace(/\s/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                WhatsApp
                            </Button>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t">
                        <div className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`text-sm font-medium ${isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 border-t space-y-2">
                                <a href={`tel:${companyInfo.contact.phone}`} className="flex items-center text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4 mr-2" />
                                    {companyInfo.contact.phone}
                                </a>
                                <a href={`mailto:${companyInfo.contact.emails[0]}`} className="flex items-center text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4 mr-2" />
                                    {companyInfo.contact.emails[0]}
                                </a>
                                <a
                                    href={`https://wa.me/${companyInfo.contact.whatsapp.replace(/\s/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        WhatsApp Us
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
