import { Link } from 'react-router-dom';
import { Droplets, Phone, Mail, MapPin } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Droplets className="h-6 w-6 text-primary" />
              <span className="font-bold">{COMPANY_INFO.name}</span>
            </div>
            <p className="text-sm text-secondary-foreground/80">
              {COMPANY_INFO.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-secondary-foreground/80 hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-secondary-foreground/80 hover:text-primary">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/quote" className="text-secondary-foreground/80 hover:text-primary">
                  Request Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="font-semibold">Our Products</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li>RO Systems</li>
              <li>UF Systems</li>
              <li>Stainless steel equipments</li>
              <li>milk processing Equipment</li>
              <li>Water refill, milk and salad atms</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-secondary-foreground/80">
                <Phone className="h-4 w-4" />
                <span>+254 728542796</span>
              </li>
              <li className="flex items-center gap-2 text-secondary-foreground/80">
                <Mail className="h-4 w-4" />
                <span>humblebosstechnical@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-secondary-foreground/80">
                <MapPin className="h-4 w-4" />
                <span>Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-sm text-secondary-foreground/60">
          <p>© {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
