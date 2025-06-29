import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-soft">
                <span className="text-white font-bold text-2xl">🍽️</span>
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-white">FoodStore</span>
                <div className="text-sm text-neutral-400 font-medium">Fresh & Quality</div>
              </div>
            </div>
            <p className="text-neutral-300 mb-6 leading-relaxed max-w-md">
              Your trusted local food store offering premium quality packaged food products. 
              We source the finest ingredients and deliver fresh to your doorstep with love and care.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-neutral-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-neutral-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-neutral-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/products" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">All Products</span>
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Categories</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-display text-lg font-semibold mb-6 text-white">Customer Care</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Help Center</span>
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Shipping Info</span>
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Returns & Refunds</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Terms of Service</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Visit Our Store</h4>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  123 Food Street, Fresh Market<br />
                  City Center, State 12345
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Call Us</h4>
                <p className="text-neutral-300 text-sm">
                  <a href="tel:+15551234567" className="hover:text-primary-400 transition-colors">
                    +1 (555) 123-4567
                  </a>
                </p>
                <p className="text-neutral-400 text-xs mt-1">Mon-Sat: 9AM-9PM</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-primary-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Email Us</h4>
                <p className="text-neutral-300 text-sm">
                  <a href="mailto:hello@foodstore.com" className="hover:text-primary-400 transition-colors">
                    hello@foodstore.com
                  </a>
                </p>
                <p className="text-neutral-400 text-xs mt-1">24/7 Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Store Hours */}
        <div className="mt-8 p-6 bg-neutral-800/50 rounded-2xl">
          <h4 className="font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-secondary-500 rounded-full mr-3"></span>
            Store Hours
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-neutral-400">Monday - Friday</span>
              <p className="text-white font-medium">9:00 AM - 9:00 PM</p>
            </div>
            <div>
              <span className="text-neutral-400">Saturday</span>
              <p className="text-white font-medium">9:00 AM - 10:00 PM</p>
            </div>
            <div>
              <span className="text-neutral-400">Sunday</span>
              <p className="text-white font-medium">10:00 AM - 8:00 PM</p>
            </div>
            <div>
              <span className="text-neutral-400">Holidays</span>
              <p className="text-white font-medium">10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-neutral-400 text-sm">
              <span>© {new Date().getFullYear()} FoodStore. Made with</span>
              <Heart className="w-4 h-4 text-accent-500 fill-current" />
              <span>for food lovers.</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="text-neutral-400 hover:text-primary-400 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-neutral-400 hover:text-primary-400 transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-neutral-400 hover:text-primary-400 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
