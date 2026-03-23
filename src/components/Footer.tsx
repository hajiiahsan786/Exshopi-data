import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowRight, Package } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-800 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand & Contact */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="bg-gradient-to-br from-violet-600 to-blue-600 text-white p-2.5 rounded-2xl shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all duration-300 group-hover:scale-110">
                <Package size={28} strokeWidth={2.5} />
              </div>
              <span className="text-3xl font-black tracking-tight text-white">
                EXSHOPI<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed max-w-sm">
              Your premium destination for online shopping in the UAE. Fast delivery, secure payments, and authentic products curated for you.
            </p>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-violet-600 group-hover:border-violet-500 transition-colors">
                  <Phone size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <span className="group-hover:text-white transition-colors">+971 800 EXSHOPI (3974674)</span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-violet-600 group-hover:border-violet-500 transition-colors">
                  <Mail size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <span className="group-hover:text-white transition-colors">support@exshopi.ae</span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-violet-600 group-hover:border-violet-500 transition-colors">
                  <MapPin size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <span className="group-hover:text-white transition-colors">Dubai Design District, UAE</span>
              </div>
            </div>
          </div>

          {/* Customer Service */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-white font-bold mb-6 text-lg">Customer Service</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/support" className="hover:text-violet-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Help Center & Support</Link></li>
              <li><Link to="/track-order" className="hover:text-violet-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Track Your Order</Link></li>
              <li><Link to="/returns" className="hover:text-violet-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Returns & Refunds</Link></li>
              <li><Link to="/shipping" className="hover:text-violet-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Shipping Info</Link></li>
              <li><Link to="/warranty" className="hover:text-violet-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Warranty Policy</Link></li>
              <li><Link to="/contact" className="hover:text-violet-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Contact Us</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link to="/about" className="hover:text-violet-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> About EXSHOPI</Link></li>
              <li><Link to="/careers" className="hover:text-violet-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Careers</Link></li>
              <li><Link to="/sell" className="hover:text-violet-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Sell on EXSHOPI</Link></li>
              <li><Link to="/terms" className="hover:text-violet-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-violet-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Privacy Policy</Link></li>
              <li><Link to="/sitemap" className="hover:text-violet-400 transition-colors flex items-center gap-2 group"><ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" /> Sitemap</Link></li>
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold mb-6 text-lg">Stay Connected</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">Subscribe to our newsletter for exclusive offers and updates.</p>
            <form className="flex mb-8 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="relative bg-slate-900 text-white px-5 py-3.5 rounded-l-xl w-full outline-none border border-slate-800 focus:border-violet-500/50 transition-colors text-sm font-medium"
              />
              <button className="relative bg-violet-600 hover:bg-violet-700 text-white px-6 py-3.5 rounded-r-xl font-bold transition-colors text-sm">
                Subscribe
              </button>
            </form>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-violet-600 hover:border-violet-500 hover:text-white transition-all hover:-translate-y-1">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-violet-600 hover:border-violet-500 hover:text-white transition-all hover:-translate-y-1">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-violet-600 hover:border-violet-500 hover:text-white transition-all hover:-translate-y-1">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-violet-600 hover:border-violet-500 hover:text-white transition-all hover:-translate-y-1">
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} EXSHOPI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="flex gap-2">
              <div className="h-8 px-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer">VISA</div>
              <div className="h-8 px-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer">Mastercard</div>
              <div className="h-8 px-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer">Apple Pay</div>
              <div className="h-8 px-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer">Tabby</div>
              <div className="h-8 px-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer">COD</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
