import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, Search, User, Heart, MapPin, Menu, ChevronDown, 
  Package, Zap, Globe, LogOut, LayoutDashboard, Store, 
  Smartphone, Laptop, Shirt, Home as HomeIcon, Sparkles, 
  Gamepad2, Watch, Headphones, Camera, Coffee, Baby, Dumbbell, X,
  AlertCircle
} from 'lucide-react';
import { useCartStore } from '../store/cart';
import { useWishlistStore } from '../store/wishlist';
import { useLanguageStore } from '../store/language';
import { useAuthStore } from '../store/auth';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';
import { AuthModal } from './AuthModal';

const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: Headphones, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'mobiles', name: 'Mobiles', icon: Smartphone, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'laptops', name: 'Laptops', icon: Laptop, color: 'text-violet-500', bg: 'bg-violet-50' },
  { id: 'fashion', name: 'Fashion', icon: Shirt, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'home', name: 'Home & Kitchen', icon: HomeIcon, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'beauty', name: 'Beauty', icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-50' },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'watches', name: 'Watches', icon: Watch, color: 'text-slate-500', bg: 'bg-slate-50' },
  { id: 'cameras', name: 'Cameras', icon: Camera, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  { id: 'appliances', name: 'Appliances', icon: Coffee, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'baby', name: 'Baby & Toys', icon: Baby, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { id: 'sports', name: 'Sports', icon: Dumbbell, color: 'text-lime-500', bg: 'bg-lime-50' },
];

export function Navbar() {
  const totalItems = useCartStore((state) => state.totalItems());
  const totalPrice = useCartStore((state) => state.totalPrice());
  const wishlistItems = useWishlistStore((state) => state.items);
  const wishlistCount = wishlistItems.length;
  const { lang, toggleLang } = useLanguageStore();
  const { user, role } = useAuthStore();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock search results for preview
  const searchResults = searchQuery.length > 2 
    ? CATEGORIES.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const t = {
    en: {
      deliverTo: 'Deliver to',
      sameDay: 'Same-Day Delivery Available',
      trackOrder: 'Track Order',
      support: 'Help & Support',
      searchPlaceholder: 'Search products, brands, and categories...',
      all: 'All',
      search: 'Search',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      account: 'Account',
      cart: 'Cart',
      categories: 'Categories',
      deals: 'Today\'s Deals',
      newArrivals: 'New Arrivals',
      bestsellers: 'Bestsellers',
      brands: 'Top Brands',
      sellOn: 'Sell on EXSHOPI',
      dashboard: 'Dashboard',
      profile: 'My Profile',
      orders: 'My Orders'
    },
    ar: {
      deliverTo: 'التوصيل إلى',
      sameDay: 'توصيل في نفس اليوم متاح',
      trackOrder: 'تتبع الطلب',
      support: 'المساعدة والدعم',
      searchPlaceholder: 'ابحث عن المنتجات والعلامات التجارية والفئات...',
      all: 'الكل',
      search: 'بحث',
      signIn: 'تسجيل الدخول',
      signOut: 'تسجيل الخروج',
      account: 'الحساب',
      cart: 'عربة التسوق',
      categories: 'الفئات',
      deals: 'عروض اليوم',
      newArrivals: 'وصل حديثاً',
      bestsellers: 'الأكثر مبيعاً',
      brands: 'أفضل العلامات التجارية',
      sellOn: 'بيع على EXSHOPI',
      dashboard: 'لوحة التحكم',
      profile: 'ملفي الشخصي',
      orders: 'طلباتي'
    }
  };

  const currentT = t[lang];

  return (
    <header className="w-full glass sticky top-0 z-40 border-b border-white/50 shadow-sm transition-all duration-300">
      {/* Top Bar */}
      <div className="relative z-10 bg-slate-900/95 backdrop-blur-md text-slate-300 text-xs py-2 px-4 hidden md:flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative group/location cursor-pointer">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <MapPin size={14} className="text-violet-400" />
              {currentT.deliverTo} <span className="font-semibold text-white">Dubai</span>
              <ChevronDown size={12} className="opacity-50" />
            </span>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover/location:opacity-100 group-hover/location:visible transition-all z-50 overflow-hidden">
              {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'].map(city => (
                <div key={city} className="px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700 cursor-pointer transition-colors">
                  {city}
                </div>
              ))}
            </div>
          </div>
          <span className="w-px h-3 bg-slate-700"></span>
          <span className="flex items-center gap-1.5 text-violet-300">
            <Zap size={14} className="fill-violet-400 text-violet-400" />
            {currentT.sameDay}
          </span>
        </div>
        <div className="flex items-center gap-4 font-bold">
          <Link to="/track-order" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Package size={14} className="text-violet-400" />
            {currentT.trackOrder}
          </Link>
          <span className="w-px h-3 bg-slate-700"></span>
          <Link to="/support" className="hover:text-white transition-colors flex items-center gap-1.5">
            <AlertCircle size={14} className="text-violet-400" />
            {currentT.support}
          </Link>
          <span className="w-px h-3 bg-slate-700"></span>
          {!user && (
            <>
              <button onClick={handleLogin} className="hover:text-white transition-colors flex items-center gap-1.5 font-bold">
                <User size={14} className="text-violet-400" />
                {currentT.signIn}
              </button>
              <span className="w-px h-3 bg-slate-700"></span>
            </>
          )}
          <button onClick={toggleLang} className="flex items-center gap-1.5 hover:text-white transition-colors font-medium">
            <Globe size={14} className="text-violet-400" />
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="relative z-20 container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="bg-gradient-to-br from-violet-600 to-blue-600 text-white p-2 rounded-xl shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300 group-hover:scale-110">
              <Package size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              EXSHOPI<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600">.</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-4xl items-center gap-2 group relative">
            {/* Categories Dropdown */}
            <div className="relative shrink-0">
              <button className="flex items-center gap-2 h-12 px-5 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-600 font-bold hover:bg-white hover:border-violet-500 hover:text-violet-600 transition-all shadow-sm">
                {currentT.all} <ChevronDown size={14} />
              </button>
            </div>

            {/* Search Input Field */}
            <div className="flex-1 relative flex items-center h-12 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-all focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/10 px-4 group/input">
              <Search size={18} className="text-slate-400 group-focus-within/input:text-violet-500 transition-colors shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={currentT.searchPlaceholder}
                className="w-full px-3 bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
              />

              {/* Search Results Preview */}
              {isSearchFocused && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Suggested Categories</div>
                      {searchResults.map((result) => (
                        <Link
                          key={result.id}
                          to={`/category/${result.id}`}
                          onClick={() => {
                            setSearchQuery('');
                            setIsSearchFocused(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group/item"
                        >
                          <div className={`p-2 rounded-lg ${result.bg} ${result.color}`}>
                            <result.icon size={16} />
                          </div>
                          <span className="text-sm font-bold text-slate-900 group-hover/item:text-violet-600 transition-colors">{result.name}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search size={20} className="text-slate-300" />
                      </div>
                      <p className="text-sm font-bold text-slate-900">Searching for "{searchQuery}"</p>
                      <p className="text-xs text-slate-400 mt-1">Press enter to see all results</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-2 h-12 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all hover:scale-[1.02] active:scale-95 border border-white/10 whitespace-nowrap">
                <Sparkles size={16} />
                AI Search
              </button>
              <button className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-black transition-all shadow-md hover:shadow-lg active:scale-95 border border-white/5 whitespace-nowrap">
                {currentT.search}
              </button>
            </div>

          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {/* Wishlist */}
            <Link to="/wishlist" className="hidden md:flex items-center gap-2 text-slate-600 hover:text-rose-500 transition-colors group">
              <div className="p-2.5 bg-white/50 border border-slate-200 group-hover:border-rose-200 group-hover:bg-rose-50/50 rounded-full relative transition-colors backdrop-blur-sm shadow-sm">
                <Heart size={20} className="group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border-2 border-white animate-in zoom-in duration-300">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>

            <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>

            {/* User Account */}
            {user ? (
              <div className="relative group/user">
                <button className="flex items-center gap-3 text-slate-700 bg-white border border-slate-200 hover:border-violet-200 hover:bg-violet-50/30 transition-all px-3 md:px-4 py-2 rounded-2xl shadow-sm hover:shadow-md active:scale-95">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-violet-500/20">
                    {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-0.5">Welcome,</span>
                    <span className="text-sm font-black text-slate-900 leading-tight">{user.displayName?.split(' ')[0] || 'User'}</span>
                  </div>
                  <ChevronDown size={16} className="text-slate-400 group-hover:text-violet-500 transition-colors hidden md:block" />
                </button>
                
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all z-50 transform origin-top-right scale-95 group-hover/user:scale-100">
                  <div className="px-6 py-4 border-b border-slate-50 mb-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">
                    <User size={18} /> {currentT.profile}
                  </Link>
                  <Link to="/orders" className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">
                    <Package size={18} /> {currentT.orders}
                  </Link>
                  {role === 'admin' && (
                    <Link to="/admin" className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">
                      <LayoutDashboard size={18} /> Admin Dashboard
                    </Link>
                  )}
                  {role === 'vendor' && (
                    <Link to="/vendor-dashboard" className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors">
                      <Store size={18} /> {currentT.dashboard}
                    </Link>
                  )}
                  <div className="h-px bg-slate-100 my-2 mx-6"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-6 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut size={18} /> {currentT.signOut}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleLogin}
                  className="flex items-center gap-3 text-slate-900 bg-white border border-slate-200 hover:border-slate-900 transition-all px-3 md:px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-md active:scale-95"
                >
                  <User size={18} className="text-slate-400" />
                  <span className="text-sm font-black hidden md:block">{currentT.signIn}</span>
                </button>
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="hidden md:flex items-center gap-3 text-white bg-slate-900 hover:bg-slate-800 transition-all px-6 py-2.5 rounded-2xl shadow-lg shadow-slate-900/10 active:scale-95 border border-white/10"
                >
                  <span className="text-sm font-black">Join Free</span>
                </button>
              </div>
            )}

            <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>

            <Link to="/cart" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors group relative">
              <div className="p-2.5 bg-white/50 border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50/50 rounded-full relative transition-colors backdrop-blur-sm shadow-sm">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm shadow-violet-500/30 border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider leading-none mb-0.5">{currentT.cart}</span>
                <span className="text-sm font-bold text-slate-900 leading-tight">AED {totalPrice.toFixed(2)}</span>
              </div>
            </Link>

            <button className="md:hidden p-2 text-slate-700">
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 lg:hidden flex items-center gap-2">
          <div className="flex-1 relative flex items-center h-11 bg-slate-50 border border-slate-200 rounded-full px-4 focus-within:bg-white focus-within:border-violet-500 transition-all shadow-sm">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={currentT.searchPlaceholder}
              className="w-full px-3 bg-transparent text-sm font-medium outline-none"
            />
          </div>
          <button className="h-11 px-6 bg-slate-900 text-white rounded-full text-sm font-black active:scale-95 transition-transform shadow-md">
            {currentT.search}
          </button>
        </div>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </div>

      {/* Categories Bar */}
      <div className="relative z-30 border-t border-white/40 hidden md:block bg-white/30 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-8 text-sm font-medium text-slate-600 py-3">
            <li className="relative" ref={categoriesRef}>
              <button 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={`flex items-center gap-2 font-black uppercase tracking-wider text-xs transition-all duration-300 ${isCategoriesOpen ? 'text-violet-600' : 'text-slate-900 hover:text-violet-600'}`}
              >
                <Menu size={18} className={isCategoriesOpen ? 'rotate-90 transition-transform' : 'transition-transform'} />
                {currentT.categories}
                <ChevronDown size={14} className={`transition-transform duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Categories Dropdown */}
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 mt-3 w-[600px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 grid grid-cols-3 gap-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {CATEGORIES.map((cat) => (
                    <Link 
                      key={cat.id}
                      to={`/category/${cat.id}`}
                      onClick={() => setIsCategoriesOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group"
                    >
                      <div className={`p-2 rounded-lg ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                        <cat.icon size={20} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-slate-900">{cat.name}</span>
                        <span className="block text-[10px] text-slate-400 font-medium">Shop Now</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </li>
            <li><Link to="/category/offers" className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500 font-bold hover:opacity-80 transition-opacity">🔥 {currentT.deals}</Link></li>
            <li><Link to="/category/electronics" className="hover:text-violet-600 transition-colors">Electronics</Link></li>
            <li><Link to="/category/mobiles" className="hover:text-violet-600 transition-colors">Mobiles</Link></li>
            <li><Link to="/category/laptops" className="hover:text-violet-600 transition-colors">Laptops</Link></li>
            <li><Link to="/category/fashion" className="hover:text-violet-600 transition-colors">Fashion</Link></li>
            <li><Link to="/category/home" className="hover:text-violet-600 transition-colors">Home & Kitchen</Link></li>
            <li><Link to="/category/beauty" className="hover:text-violet-600 transition-colors">Beauty</Link></li>
            <li><Link to="/category/gaming" className="hover:text-violet-600 transition-colors">Gaming</Link></li>
          </ul>
        </div>
      </div>
    </header>
  );
}
