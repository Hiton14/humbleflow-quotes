import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Mail, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { companyInfo } from '@/config/company';
import { getImageUrl } from '@/lib/utils';

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Home', path: '/#hero' },
        { name: 'Services', path: '/#services' },
        { name: 'Products', path: '/products' },
        { name: 'Contact', path: '/#contact' },
    ];

    const isActive = (path: string) => {
        if (path === '/#hero' && location.pathname === '/' && !location.hash) return true;
        if (path.includes('#')) {
            return location.hash === path.substring(1);
        }
        return location.pathname === path;
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        setMobileMenuOpen(false);

        const [pathname, hash] = path.split('#');

        if (location.pathname !== pathname) {
            navigate(path);
            return;
        }

        const element = document.getElementById(hash);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            // Update URL hash without scroll jump
            window.history.pushState(null, '', path);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="/" onClick={(e) => handleNavClick(e, '/#hero')} className="flex items-center">
                        <img
                            src={getImageUrl("logo.png")}
                            alt="HumbleBoss Technical Services"
                            className="h-28 w-auto"
                        />
                    </a>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.path}
                                href={link.path}
                                onClick={(e) => handleNavClick(e, link.path)}
                                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                                    }`}
                            >
                                {link.name}
                            </a>
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
                                <a
                                    key={link.path}
                                    href={link.path}
                                    onClick={(e) => handleNavClick(e, link.path)}
                                    className={`text-sm font-medium ${isActive(link.path) ? 'text-primary' : 'text-muted-foreground'
                                        }`}
                                >
                                    {link.name}
                                </a>
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
