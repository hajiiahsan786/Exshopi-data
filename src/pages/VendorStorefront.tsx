import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, ShieldCheck, Search, Filter, SlidersHorizontal, ShoppingCart, Heart, CheckCircle2, Store, Award, Clock, Sparkles } from 'lucide-react';
import { useCartStore, Product } from '../store/cart';

export function VendorStorefront() {
  const { vendorId } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  // Mock vendor data
  const vendor = {
    id: vendorId,
    name: 'Tech Haven UAE',
    logo: 'https://picsum.photos/seed/techhaven/200/200',
    banner: 'https://picsum.photos/seed/techbanner/1200/400',
    rating: 4.9,
    reviews: 12450,
    joined: '2022',
    location: 'Dubai, UAE',
    description: 'Your trusted partner for premium electronics and smart home devices. Authorized reseller for top brands.',
    badges: ['Top Rated', 'Fast Shipper', 'Verified'],
  };

  useEffect(() => {
    // Fetch products for this vendor (mocking with all products for now)
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [vendorId]);

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Vendor Banner & Profile */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
        <img src={vendor.banner} alt={`${vendor.name} Banner`} className="w-full h-full object-cover" />
        
        <div className="absolute inset-0 z-20 container mx-auto px-4 flex flex-col justify-end pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white shrink-0 relative">
              <img src={vendor.logo} alt={vendor.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-tl-xl rounded-br-2xl">
                <CheckCircle2 size={16} />
              </div>
            </div>
            
            <div className="flex-1 text-white">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight">{vendor.name}</h1>
                <div className="flex gap-2">
                  {vendor.badges.map((badge, idx) => (
                    <span key={idx} className="bg-white/20 backdrop-blur-md border border-white/30 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                      {badge === 'Top Rated' && <Award size={12} className="text-amber-400" />}
                      {badge === 'Fast Shipper' && <Clock size={12} className="text-cyan-400" />}
                      {badge === 'Verified' && <ShieldCheck size={12} className="text-emerald-400" />}
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-slate-200 max-w-2xl text-sm md:text-base mb-4 leading-relaxed line-clamp-2 md:line-clamp-none">
                {vendor.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star size={16} className="fill-amber-400" />
                  <span className="font-bold text-white">{vendor.rating}</span>
                  <span className="text-slate-300">({vendor.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin size={16} />
                  <span>{vendor.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Store size={16} />
                  <span>Joined {vendor.joined}</span>
                </div>
              </div>
            </div>
            
            <div className="shrink-0 flex gap-3 w-full md:w-auto mt-4 md:mt-0">
              <button className="flex-1 md:flex-none glass-dark hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border border-white/20">
                <Heart size={18} /> Follow
              </button>
              <button className="flex-1 md:flex-none bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-xl font-bold transition-all shadow-lg">
                Contact Vendor
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="glass p-6 rounded-2xl sticky top-24">
              <div className="flex items-center gap-2 font-black text-lg mb-6 text-slate-900 tracking-tight">
                <Filter size={20} className="text-violet-600" /> Store Filters
              </div>

              {/* Search in Store */}
              <div className="mb-8 relative">
                <input 
                  type="text" 
                  placeholder="Search in store..." 
                  className="w-full bg-white/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
                <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              </div>

              {/* Categories Filter */}
              <div className="mb-8">
                <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider flex items-center justify-between">
                  Categories
                </h3>
                <div className="space-y-3">
                  {['Smartphones', 'Laptops', 'Audio', 'Accessories'].map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded border border-slate-300 group-hover:border-violet-500 transition-colors flex items-center justify-center">
                        <input type="checkbox" className="opacity-0 absolute" />
                      </div>
                      <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider flex items-center justify-between">
                  Price (AED)
                </h3>
                <div className="space-y-4">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 w-2/3 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <input type="number" placeholder="Min" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                    <span className="text-slate-400">-</span>
                    <input type="number" placeholder="Max" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <h2 className="text-2xl font-black text-slate-900">All Products</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-500">Sort by:</span>
                <button className="flex items-center gap-2 bg-gradient-to-r from-violet-50 to-cyan-50 border border-violet-200 px-4 py-2 rounded-xl text-sm font-bold text-violet-700 hover:bg-violet-100 transition-colors shadow-sm">
                  <Sparkles size={16} className="text-violet-500" /> AI Recommended
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="glass rounded-2xl overflow-hidden group hover:shadow-[0_8px_30px_rgba(139,92,246,0.12)] transition-all duration-300 border border-white/60 hover:border-violet-200 flex flex-col h-full relative">
                  
                  {/* AI Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5">
                      <Sparkles size={12} className="text-violet-600" />
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Top Pick</span>
                    </div>
                  </div>

                  {/* Wishlist Button */}
                  <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors shadow-sm">
                    <Heart size={16} />
                  </button>

                  <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-white p-6">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                    />
                  </Link>
                  
                  <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-white/40 to-white/80">
                    <Link to={`/product/${product.id}`} className="block mb-2">
                      <h3 className="font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-violet-600 transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-1.5 mb-4">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'fill-amber-400' : 'fill-slate-200 text-slate-200'} />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                      <span className="text-xs text-slate-400 font-medium">({product.reviews})</span>
                    </div>
                    
                    <div className="mt-auto flex items-end justify-between">
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-0.5">Price</p>
                        <p className="text-xl font-black text-slate-900 tracking-tight">
                          AED {product.price.toLocaleString()}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          addItem(product);
                        }}
                        className="w-10 h-10 bg-slate-900 hover:bg-violet-600 text-white rounded-xl flex items-center justify-center transition-colors shadow-md hover:shadow-lg hover:shadow-violet-500/30"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
