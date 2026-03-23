import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, ChevronDown, Star, ShoppingCart, CheckCircle2, Heart, SlidersHorizontal, Sparkles, Store, Loader2, Search, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useCartStore, Product } from '../store/cart';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export function ProductListing() {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'newest'>('recommended');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showFilters, setShowFilters] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        
        if (category && category !== 'all') {
          const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
          q = query(collection(db, 'products'), where('category', '==', formattedCategory), orderBy('createdAt', 'desc'));
        }

        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];

        if (productsData.length > 0) {
          setProducts(productsData);
        } else {
          const res = await fetch('/api/products');
          const data = await res.json();
          const filtered = category && category !== 'all' 
            ? data.filter((p: Product) => p.category.toLowerCase() === category.toLowerCase())
            : data;
          setProducts(filtered);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'products');
        const res = await fetch('/api/products');
        const data = await res.json();
        const filtered = category && category !== 'all' 
          ? data.filter((p: Product) => p.category.toLowerCase() === category.toLowerCase())
          : data;
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const brands = useMemo(() => {
    const b = new Set(products.map(p => p.brand));
    return Array.from(b).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }

    if (selectedConditions.length > 0) {
      result = result.filter(p => selectedConditions.includes(p.condition));
    }

    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        break;
      default:
        // Recommended: featured first
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, sortBy, selectedBrands, selectedConditions, priceRange]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev => 
      prev.includes(condition) ? prev.filter(c => c !== condition) : [...prev, condition]
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="text-sm text-slate-500 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-violet-600 transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="capitalize text-slate-900 font-bold">{category}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-full lg:w-72 shrink-0 lg:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="glass p-6 rounded-[2rem] sticky top-24 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 font-black text-xl text-slate-900 tracking-tight">
                  <Filter size={22} className="text-violet-600" /> Filters
                </div>
                <button 
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedConditions([]);
                    setPriceRange({ min: 0, max: 10000 });
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-violet-600 hover:text-violet-700 underline underline-offset-4"
                >
                  Reset All
                </button>
              </div>

              {/* Search within Category */}
              <div className="mb-8">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search in category..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/5 transition-all"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-8">
                <h3 className="font-black text-slate-900 mb-4 uppercase text-[10px] tracking-widest flex items-center justify-between">
                  Brands <ChevronDown size={16} className="text-slate-400" />
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${selectedBrands.includes(brand) ? 'bg-violet-600 border-violet-600' : 'border-slate-300 group-hover:border-violet-500'}`}>
                        {selectedBrands.includes(brand) && <CheckCircle2 size={12} className="text-white" />}
                        <input 
                          type="checkbox" 
                          className="opacity-0 absolute" 
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                        />
                      </div>
                      <span className={`text-sm font-bold transition-colors ${selectedBrands.includes(brand) ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-8">
                <h3 className="font-black text-slate-900 mb-4 uppercase text-[10px] tracking-widest flex items-center justify-between">
                  Price Range (AED) <ChevronDown size={16} className="text-slate-400" />
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Min</label>
                      <input 
                        type="number" 
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-violet-500" 
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Max</label>
                      <input 
                        type="number" 
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-violet-500" 
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Condition Filter */}
              <div>
                <h3 className="font-black text-slate-900 mb-4 uppercase text-[10px] tracking-widest flex items-center justify-between">
                  Condition <ChevronDown size={16} className="text-slate-400" />
                </h3>
                <div className="space-y-2">
                  {['New', 'Used', 'Refurbished'].map((cond) => (
                    <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${selectedConditions.includes(cond) ? 'bg-violet-600 border-violet-600' : 'border-slate-300 group-hover:border-violet-500'}`}>
                        {selectedConditions.includes(cond) && <CheckCircle2 size={12} className="text-white" />}
                        <input 
                          type="checkbox" 
                          className="opacity-0 absolute" 
                          checked={selectedConditions.includes(cond)}
                          onChange={() => toggleCondition(cond)}
                        />
                      </div>
                      <span className={`text-sm font-bold transition-colors ${selectedConditions.includes(cond) ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}>{cond}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl lg:text-4xl font-black capitalize text-slate-900 tracking-tight">{category}</h1>
                <span className="bg-slate-100 text-slate-500 text-xs font-black px-3 py-1 rounded-full">{filteredProducts.length} Products</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex-1 flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700"
                >
                  <Filter size={18} /> Filters
                </button>
                <div className="relative flex-1 sm:flex-none">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-violet-500 shadow-sm cursor-pointer"
                  >
                    <option value="recommended">AI Recommended</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
              {loading ? (
                <div className="col-span-full py-20 flex flex-col items-center gap-4">
                  <Loader2 size={40} className="text-violet-600 animate-spin" />
                  <p className="text-slate-500 font-medium">Loading products...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={24} className="text-slate-300" />
                  </div>
                  <p className="text-slate-900 font-black text-xl mb-2">No products found</p>
                  <p className="text-slate-500 font-medium">Try adjusting your filters or search query.</p>
                  <button 
                    onClick={() => {
                      setSelectedBrands([]);
                      setSelectedConditions([]);
                      setPriceRange({ min: 0, max: 10000 });
                      setSearchQuery('');
                    }}
                    className="mt-6 bg-violet-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-violet-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
