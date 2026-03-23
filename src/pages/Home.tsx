import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, Clock, Filter, SlidersHorizontal, CheckCircle2, Heart, Play, Sparkles, Store, Mail, Facebook, Instagram, Twitter, Youtube, X, Package, Zap, TrendingUp } from 'lucide-react';
import { useCartStore, Product } from '../store/cart';
import { ProductCard } from '../components/ProductCard';
import { Countdown } from '../components/Countdown';
import { db, collection, getDocs, query, limit, orderBy } from '../firebase';

export function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Categorized products
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 5);
  const bestsellerProducts = products.filter(p => p.isBestseller).slice(0, 5);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 10);
  const offerProducts = products.filter(p => p.isOffer || p.discount > 0).slice(0, 5);
  const hotDeals = products.filter(p => p.isHotDeals).slice(0, 5);
  const limitedTime = products.filter(p => p.isLimitedTime).slice(0, 5);
  const trendingNow = products.filter(p => p.isTrending).slice(0, 5);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        
        if (productsData.length > 0) {
          setProducts(productsData);
        } else {
          // Fallback to mock data if Firestore is empty
          const res = await fetch('/api/products');
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data on error
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#f0fdf4,transparent)] pointer-events-none"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-200/30 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/30 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700"></div>
        
        <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-6 border border-emerald-200 shadow-sm">
              <Sparkles size={14} />
              Exclusive UAE Marketplace
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1] text-slate-900">
              Premium Shopping <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-yellow-500">
                Redefined.
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed font-medium">
              Discover the finest selection of electronics, fashion, and home essentials. Experience lightning-fast delivery and 100% authentic products across the Emirates.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/category/offers" className="bg-slate-900 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2 hover:-translate-y-0.5">
                Shop Now <ChevronRight size={20} />
              </Link>
              <Link to="/category/electronics" className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-0.5 shadow-sm">
                Explore Deals
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative w-full max-w-md">
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 via-yellow-300 to-emerald-500 rounded-[2.5rem] rotate-6 scale-105 blur-2xl opacity-40 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-yellow-50 rounded-[2.5rem] shadow-2xl border border-emerald-100 overflow-hidden flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 border border-emerald-100">
                  <Package size={48} className="text-emerald-500" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">EXSHOPI</h3>
                <p className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-sm">UAE Premium Marketplace</p>
                <div className="mt-8 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                </div>
              </div>
              
              {/* Floating Badges - Clearly Readable */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">
                <div className="bg-emerald-500 p-3 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                  <Truck size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Delivery</p>
                  <p className="font-black text-slate-900">Same-Day UAE</p>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce-slow-delayed">
                <div className="bg-yellow-400 p-3 rounded-xl text-white shadow-lg shadow-yellow-400/20">
                  <Star size={24} className="fill-white" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Rating</p>
                  <p className="font-black text-slate-900">4.9/5 Trusted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions / Trust Badges */}
      <section className="bg-white border-b border-slate-100 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-violet-200 hover:bg-violet-50/30 transition-colors group">
              <div className="text-violet-600 bg-white shadow-sm border border-slate-100 p-3.5 rounded-xl group-hover:scale-110 transition-transform"><Truck size={28} /></div>
              <div>
                <h3 className="font-black text-sm md:text-base text-slate-900">Fast Delivery UAE</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Same-day in Dubai & Sharjah</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-colors group">
              <div className="text-blue-600 bg-white shadow-sm border border-slate-100 p-3.5 rounded-xl group-hover:scale-110 transition-transform"><ShieldCheck size={28} /></div>
              <div>
                <h3 className="font-black text-sm md:text-base text-slate-900">Secure Payment</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">256-bit SSL encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-rose-200 hover:bg-rose-50/30 transition-colors group">
              <div className="text-rose-600 bg-white shadow-sm border border-slate-100 p-3.5 rounded-xl group-hover:scale-110 transition-transform"><RotateCcw size={28} /></div>
              <div>
                <h3 className="font-black text-sm md:text-base text-slate-900">Easy Returns</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">15-day hassle-free return</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors group">
              <div className="text-emerald-600 bg-white shadow-sm border border-slate-100 p-3.5 rounded-xl group-hover:scale-110 transition-transform"><CheckCircle2 size={28} /></div>
              <div>
                <h3 className="font-black text-sm md:text-base text-slate-900">100% Authentic</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Guaranteed genuine products</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Marketplace Layout */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Sidebar Filters */}
            <aside className="w-full lg:w-64 shrink-0 hidden lg:block">
              <div className="glass rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-2 font-black text-lg mb-6 text-slate-900 tracking-tight">
                  <Filter size={20} className="text-violet-600" /> Dynamic Filters
                </div>
                
                <div className="space-y-8">
                  {/* Categories */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Categories</h4>
                    <ul className="space-y-3 text-sm font-medium text-slate-600">
                      {['Mobiles', 'Laptops', 'Gaming', 'Audio', 'Home', 'Beauty'].map(cat => (
                        <li key={cat}>
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded border border-slate-300 group-hover:border-violet-500 flex items-center justify-center transition-colors">
                              {cat === 'Mobiles' && <div className="w-3 h-3 bg-violet-500 rounded-sm"></div>}
                            </div>
                            <span className={cat === 'Mobiles' ? 'text-slate-900 font-bold' : 'group-hover:text-slate-900 transition-colors'}>{cat}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Price Range</h4>
                    <div className="space-y-4">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 w-2/3 rounded-full"></div>
                      </div>
                      <div className="flex items-center gap-4">
                        <input type="text" placeholder="Min" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                        <span className="text-slate-400">-</span>
                        <input type="text" placeholder="Max" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-500" />
                      </div>
                    </div>
                  </div>

                  {/* Brands */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">Brands</h4>
                    <ul className="space-y-3 text-sm font-medium text-slate-600">
                      {['Apple', 'Samsung', 'Sony', 'Dyson', 'Nike'].map(brand => (
                        <li key={brand}>
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded border border-slate-300 group-hover:border-violet-500 transition-colors flex items-center justify-center">
                              <input type="checkbox" className="opacity-0 absolute" />
                            </div>
                            <span className="group-hover:text-slate-900 transition-colors">{brand}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </aside>

            {/* Product Grid Area */}
            <div className="flex-1 space-y-16">
              {/* Featured Products */}
              {featuredProducts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <Zap className="text-yellow-500 fill-yellow-500" size={24} />
                      Featured Products
                    </h2>
                    <Link to="/category/all" className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 group">
                      View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {featuredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* Best Sellers */}
              {bestsellerProducts.length > 0 && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <Star className="text-amber-500 fill-amber-500" size={24} />
                      Best Sellers
                    </h2>
                    <Link to="/category/all" className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 group">
                      View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {bestsellerProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Now */}
              {trendingNow.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-[2.5rem] border border-amber-100">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <TrendingUp className="text-orange-500" size={24} />
                      Trending Now
                    </h2>
                    <Link to="/category/all" className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group">
                      View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {trendingNow.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* Hot Deals */}
              {hotDeals.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <Sparkles className="text-blue-500" size={24} />
                      Hot Deals
                    </h2>
                    <Link to="/category/all" className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 group">
                      View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {hotDeals.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* Sales Offer */}
              {offerProducts.length > 0 && (
                <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <div className="bg-rose-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                      Limited Time
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <Sparkles className="text-rose-500 fill-rose-500" size={24} />
                      Special Offers
                    </h2>
                    <Link to="/category/offers" className="text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 group">
                      View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative z-10">
                    {offerProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* Limited Time */}
              {limitedTime.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <Clock className="text-emerald-500" size={24} />
                      Limited Time Deals
                    </h2>
                    <Link to="/category/all" className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 group">
                      View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {limitedTime.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}

              {/* New Arrivals */}
              {newArrivals.length > 0 && (
                <div className="bg-violet-50 p-8 rounded-[2.5rem] border border-violet-100">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      <Package className="text-violet-500" size={24} />
                      New Arrivals
                    </h2>
                    <Link to="/category/all" className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 group">
                      View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {newArrivals.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Video Product Section */}
      <section className="py-16 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-blue-900/20 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-white/10 border border-white/20 text-violet-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
                Featured Innovation
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Experience the New <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Vision Pro</span>
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
                Immerse yourself in a new era of spatial computing. Watch the video to see how it seamlessly blends digital content with your physical space.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/product/1" className="bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-white/20 flex items-center gap-2 hover:-translate-y-0.5">
                  Shop Now <ChevronRight size={20} />
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <div 
                className="relative aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group cursor-pointer"
                onClick={() => setIsVideoModalOpen(true)}
              >
                <img src="https://picsum.photos/seed/visionpro/1200/675" alt="Video Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors duration-500 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Explore Top Brands</h2>
            <p className="text-slate-500 mt-2 font-medium">Discover current promotions from your favorite brands</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 items-center opacity-60 hover:opacity-100 transition-opacity duration-500">
            {['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'LG'].map((brand) => (
              <Link key={brand} to={`/vendor/${brand.toLowerCase()}`} className="text-2xl md:text-4xl font-black text-slate-300 hover:text-violet-600 transition-colors cursor-pointer grayscale hover:grayscale-0">
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Company Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white mb-6 shadow-lg shadow-violet-500/30">
            <Store size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 tracking-tight">About EXSHOPI</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-12">
            EXSHOPI is a premium multi-vendor marketplace dedicated to providing the best online shopping experience in the UAE. We connect you with top brands and trusted sellers, offering a vast selection of electronics, fashion, and home goods with guaranteed authenticity and lightning-fast delivery.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <ShoppingCart size={24} className="text-violet-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Seamless Shopping</h3>
              <p className="text-sm text-slate-500">Discover millions of products with our AI-powered search and personalized recommendations.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <ShieldCheck size={24} className="text-blue-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Secure Payments</h3>
              <p className="text-sm text-slate-500">Shop with confidence using our secure payment gateways, including Apple Pay and Tabby.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <Truck size={24} className="text-emerald-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Fast Delivery</h3>
              <p className="text-sm text-slate-500">Enjoy same-day delivery in Dubai and next-day delivery across the rest of the UAE.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/40 via-slate-900 to-cyan-900/40 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Stay Connected</h2>
          <p className="text-slate-400 mb-8 text-lg">Subscribe to our newsletter and get a 10% discount on your first order.</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}>
            <div className="relative flex-1 max-w-md">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>
            <button type="submit" className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 whitespace-nowrap">
              Get 10% Discount
            </button>
          </form>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-[3rem] p-8 md:p-16 border border-violet-100 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="max-w-xl relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                Shop Anytime, Anywhere with the EXSHOPI App
              </h2>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                Get exclusive app-only discounts, track your orders in real-time, and enjoy a seamless shopping experience on your mobile device.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl flex items-center gap-3 transition-all hover:-translate-y-0.5 shadow-lg shadow-slate-900/20">
                  <div className="text-left">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Download on the</div>
                    <div className="text-lg font-black leading-tight">App Store</div>
                  </div>
                </button>
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl flex items-center gap-3 transition-all hover:-translate-y-0.5 shadow-lg shadow-slate-900/20">
                  <div className="text-left">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">GET IT ON</div>
                    <div className="text-lg font-black leading-tight">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="relative z-10 hidden md:block w-full max-w-sm">
              <div className="relative mx-auto w-64 h-[500px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <img src="https://picsum.photos/seed/appui/400/800" alt="App UI" className="w-full h-full object-cover opacity-90" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <button 
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={20} />
            </button>
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/TX9qSaGXFyg?autoplay=1" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
