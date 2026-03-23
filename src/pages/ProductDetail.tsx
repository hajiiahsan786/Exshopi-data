import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Share2, Info, CheckCircle2, Sparkles, Store, Loader2, Package, Clock, Flame } from 'lucide-react';
import { useCartStore, Product } from '../store/cart';
import { ProductCard } from '../components/ProductCard';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'box' | 'reviews'>('overview');
  const addItem = useCartStore((state) => state.addItem);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const pData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(pData);
          fetchRelated(pData.category);
        } else {
          // Fallback to mock API
          const res = await fetch('/api/products');
          const data = await res.json();
          const found = data.find((p: Product) => p.id === id);
          if (found) {
            setProduct(found);
            fetchRelated(found.category);
          }
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `products/${id}`);
        // Fallback
        const res = await fetch('/api/products');
        const data = await res.json();
        const found = data.find((p: Product) => p.id === id);
        if (found) {
          setProduct(found);
          fetchRelated(found.category);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async (category: string) => {
      try {
        const res = await fetch(`/api/products?category=${category}`);
        const data = await res.json();
        setRelatedProducts(data.filter((p: Product) => p.id !== id).slice(0, 4));
      } catch (e) {
        console.error("Related fetch error:", e);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={40} className="text-violet-600 animate-spin" />
        <div className="text-slate-500 font-medium">Loading product details...</div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-slate-500 font-medium">Product not found.</div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="text-sm text-slate-500 mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-violet-600 transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-violet-600 transition-colors capitalize">{product.category}</Link>
          {product.subcategory && (
            <>
              <span className="text-slate-300">/</span>
              <Link to={`/category/${product.category.toLowerCase()}/${product.subcategory.toLowerCase()}`} className="hover:text-violet-600 transition-colors capitalize">{product.subcategory}</Link>
            </>
          )}
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold line-clamp-1 inline-block align-bottom max-w-xs">{product.title}</span>
        </div>

        <div className="glass rounded-[2rem] p-6 lg:p-10 shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Image Gallery */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="aspect-square bg-slate-50/50 rounded-3xl flex items-center justify-center p-8 relative border border-slate-100 group overflow-hidden">
                {/* Background Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                  {product.discount > 0 && (
                    <div className="bg-gradient-to-r from-rose-500 to-orange-600 text-white text-sm font-black px-4 py-2 rounded-xl shadow-sm">
                      {product.discount}% OFF
                    </div>
                  )}
                  {product.isBestseller && (
                    <div className="bg-amber-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={12} /> Best Seller
                    </div>
                  )}
                  {product.isFlashDeal && (
                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={12} /> Flash Deal
                    </div>
                  )}
                  {product.isSameDayDelivery && (
                    <div className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider flex items-center gap-1">
                      <Clock size={12} /> Same Day Delivery
                    </div>
                  )}
                  {product.isWarrantyUAE && (
                    <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 size={12} /> UAE Warranty
                    </div>
                  )}
                  {product.isHotDeals && (
                    <div className="bg-rose-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wider flex items-center gap-1">
                      <Flame size={12} /> Hot Deal
                    </div>
                  )}
                </div>
                
                <div className="absolute top-6 right-6 flex flex-col gap-3 z-10">
                  <button className="w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all hover:scale-110">
                    <Heart size={22} />
                  </button>
                  <button className="w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all hover:scale-110">
                    <Share2 size={22} />
                  </button>
                </div>
                <img src={product.image} alt={product.title} className="w-full h-full object-contain relative z-0 group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {(product.images && product.images.length > 0 ? product.images : [product.image]).map((img, i) => (
                  <button key={i} className={`aspect-square rounded-2xl bg-slate-50/50 border-2 flex items-center justify-center p-3 transition-all ${i === 0 ? 'border-violet-500 bg-violet-50/30' : 'border-transparent hover:border-slate-200 hover:bg-slate-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-contain drop-shadow-md" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Link to={`/vendor/${product.brand.toLowerCase().replace(/\s+/g, '-')}`} className="text-violet-600 font-black uppercase tracking-widest text-[10px] bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                  <Store size={14} /> {product.brand}
                </Link>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1.5 rounded-lg">
                  <CheckCircle2 size={12} className="text-blue-500" /> Verified
                </div>
                {product.isFeatured && (
                  <div className="flex items-center gap-1 text-[10px] font-bold text-violet-600 uppercase tracking-wider bg-violet-50 px-2 py-1.5 rounded-lg border border-violet-100">
                    <Sparkles size={12} /> Featured
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-2 tracking-tight">
                {product.title}
              </h1>
              {product.arabicName && (
                <h2 className="text-2xl font-bold text-slate-700 mb-2 font-arabic text-right" dir="rtl">
                  {product.arabicName}
                </h2>
              )}
              {product.subtitle && (
                <p className="text-lg font-bold text-slate-500 mb-6 leading-tight">{product.subtitle}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg">
                  <Star size={18} className="fill-amber-500 text-amber-500" />
                  <span className="font-black text-amber-700">{product.rating || '4.9'}</span>
                </div>
                <span className="text-sm font-medium text-slate-500 underline decoration-slate-200 underline-offset-4 cursor-pointer hover:text-violet-600 transition-colors">{product.reviews || '128'} Ratings</span>
                <span className="text-slate-300">|</span>
                <span className="text-sm text-slate-500">Condition: <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md ml-1">{product.condition}</span></span>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-4 mb-2">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">AED {product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-xl font-medium text-slate-400 line-through mb-1.5">AED {product.originalPrice}</span>
                  )}
                </div>
                <p className="text-sm font-medium text-slate-500">{product.vatIncluded ? 'Inclusive of VAT' : 'Exclusive of VAT'}</p>
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                    "{product.shortDescription}"
                  </p>
                </div>
              )}

              {/* Key Features */}
              {product.keyFeatures && product.keyFeatures.length > 0 && (
                <div className="space-y-5 mb-10">
                  <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                    <Sparkles size={20} className="text-violet-600" /> Key Features
                  </h3>
                  <ul className="space-y-3 text-sm font-medium text-slate-600">
                    {product.keyFeatures.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-2 shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warranty Info */}
              <div className="mt-auto flex items-center gap-5 p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100"><ShieldCheck size={28} className="text-violet-600" /></div>
                <div>
                  <p className="font-bold text-slate-900">{product.warranty || '1 Year Warranty'}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Provided by {product.brand} UAE</p>
                </div>
              </div>
            </div>

            {/* Buy Box */}
            <div className="lg:col-span-3">
              <div className="glass-dark border border-white/10 rounded-[2rem] p-8 sticky top-24 shadow-[0_8px_30px_rgba(6,182,212,0.15)] neon-border">
                <div className="mb-8 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-400 font-black mb-2">
                    <Truck size={20} />
                    <span>Free Delivery</span>
                  </div>
                  <p className="text-sm font-medium text-slate-300 leading-relaxed">
                    Order within <span className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded shadow-sm">5 hrs 30 mins</span> to get it by <span className="font-bold text-white">{product.delivery}</span>
                  </p>
                  {product.deliveryNote && (
                    <p className="text-[10px] text-emerald-300/70 mt-2 font-medium italic">*{product.deliveryNote}</p>
                  )}
                </div>

                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-slate-300">Quantity</span>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider bg-emerald-500/20 px-2.5 py-1 rounded-lg">
                      {product.stockQuantity ? `In Stock: ${product.stockQuantity}` : `Status: ${product.stock}`}
                    </span>
                  </div>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl shadow-sm hover:bg-white/20 text-white transition-colors text-xl font-medium"
                    >-</button>
                    <div className="flex-1 h-12 flex items-center justify-center font-black text-lg text-white">
                      {quantity}
                    </div>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl shadow-sm hover:bg-white/20 text-white transition-colors text-xl font-medium"
                    >+</button>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <button 
                    onClick={() => {
                      for(let i=0; i<quantity; i++) addItem(product);
                    }}
                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group"
                  >
                    <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" /> Add to Cart
                  </button>
                  <Link 
                    to="/checkout"
                    onClick={() => {
                      for(let i=0; i<quantity; i++) addItem(product);
                    }}
                    className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center text-center shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
                  >
                    Buy Now
                  </Link>
                </div>

                <div className="space-y-5 pt-8 border-t border-white/10">
                  <div className="flex items-start gap-4 text-sm">
                    <RotateCcw size={20} className="text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300 font-medium leading-relaxed">
                      {product.returnPolicy || 'Enjoy hassle free returns with this offer.'} <a href="#" className="text-cyan-400 font-bold hover:underline">Learn more</a>
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <ShieldCheck size={20} className="text-slate-400 shrink-0" />
                    <span className="text-slate-300 font-medium">Secure transaction</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <Info size={20} className="text-slate-400 shrink-0" />
                    <span className="text-slate-300 font-medium">Sold by <Link to={`/vendor/${product.brand.toLowerCase().replace(/\s+/g, '-')}`} className="font-black text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md ml-1 transition-colors">{product.brand} Direct</Link></span>
                  </div>
                  {product.sellerLocation && (
                    <div className="flex items-center gap-4 text-sm">
                      <Store size={20} className="text-slate-400 shrink-0" />
                      <span className="text-slate-300 font-medium">Location: <span className="text-white font-bold">{product.sellerLocation}</span></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Product Details Tabs (Description, Specifications, Reviews) */}
          <div className="mt-16 pt-16 border-t border-slate-100">
            <div className="flex items-center gap-8 border-b border-slate-200 mb-8 overflow-x-auto custom-scrollbar pb-px">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`text-lg font-black pb-4 whitespace-nowrap transition-all ${activeTab === 'overview' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-slate-500 hover:text-slate-900 border-b-2 border-transparent'}`}
              >Overview</button>
              <button 
                onClick={() => setActiveTab('specs')}
                className={`text-lg font-black pb-4 whitespace-nowrap transition-all ${activeTab === 'specs' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-slate-500 hover:text-slate-900 border-b-2 border-transparent'}`}
              >Specifications</button>
              <button 
                onClick={() => setActiveTab('box')}
                className={`text-lg font-black pb-4 whitespace-nowrap transition-all ${activeTab === 'box' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-slate-500 hover:text-slate-900 border-b-2 border-transparent'}`}
              >What's in the Box</button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`text-lg font-black pb-4 whitespace-nowrap transition-all ${activeTab === 'reviews' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-slate-500 hover:text-slate-900 border-b-2 border-transparent'}`}
              >Reviews ({product.reviews || '128'})</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-12">
                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="space-y-12">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Product Description</h3>
                      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                        {product.fullDescription ? (
                          <div className="whitespace-pre-line">{product.fullDescription}</div>
                        ) : (
                          <p>No detailed description available for this product.</p>
                        )}
                      </div>
                    </div>

                    {product.arabicDescription && (
                      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                        <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight font-arabic text-right">وصف المنتج</h3>
                        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-arabic text-right text-lg" dir="rtl">
                          <div className="whitespace-pre-line">{product.arabicDescription}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Specifications</h3>
                    {product.specifications && Object.keys(product.specifications).length > 0 ? (
                      <div className="border border-slate-200 rounded-2xl overflow-hidden">
                        <table className="w-full text-left text-sm">
                          <tbody className="divide-y divide-slate-100">
                            {Object.entries(product.specifications).map(([key, value], idx) => (
                              <tr key={key} className={idx % 2 === 0 ? "bg-slate-50/50" : ""}>
                                <th className="px-6 py-4 font-bold text-slate-700 w-1/3 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</th>
                                <td className="px-6 py-4 text-slate-600">{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">No specifications available for this product.</p>
                    )}
                  </div>
                )}

                {activeTab === 'box' && (
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">What's in the Box</h3>
                    {product.whatsInBox ? (
                      <div className="p-8 bg-white border border-slate-200 rounded-[2rem] shadow-sm flex items-start gap-6">
                        <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 shrink-0">
                          <Package size={32} />
                        </div>
                        <div className="text-slate-600 font-medium leading-relaxed whitespace-pre-line">
                          {typeof product.whatsInBox === 'string' ? product.whatsInBox : (Array.isArray(product.whatsInBox) ? product.whatsInBox.join('\n') : '')}
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">No information about box contents available.</p>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Customer Reviews</h3>
                    <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center min-w-[200px]">
                        <div className="text-5xl font-black text-slate-900 mb-2">{product.rating}</div>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={20} className={star <= Math.floor(product.rating) ? "fill-amber-500 text-amber-500" : "text-slate-300"} />
                          ))}
                        </div>
                        <div className="text-sm font-medium text-slate-500">Based on {product.reviews} reviews</div>
                      </div>
                      <div className="flex-1 w-full space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-4">
                            <div className="flex items-center gap-1 w-12 text-sm font-bold text-slate-700">
                              {rating} <Star size={14} className="fill-slate-400 text-slate-400" />
                            </div>
                            <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-500 rounded-full" 
                                style={{ width: `${rating === 5 ? 75 : rating === 4 ? 15 : rating === 3 ? 5 : 2}%` }}
                              ></div>
                            </div>
                            <div className="w-10 text-right text-sm font-medium text-slate-500">
                              {rating === 5 ? '75%' : rating === 4 ? '15%' : rating === 3 ? '5%' : '2%'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Individual Review */}
                    <div className="space-y-6">
                      <div className="border-b border-slate-100 pb-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold">
                              JD
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">John Doe</p>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={12} className="fill-amber-500 text-amber-500" />
                                  ))}
                                </div>
                                <span className="text-xs font-medium text-slate-400">2 days ago</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                            <CheckCircle2 size={12} /> Verified Purchase
                          </div>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">Absolutely amazing device!</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          The titanium build makes it noticeably lighter than the previous pro models. The battery life is fantastic and the new camera system is out of this world. Highly recommend upgrading if you're coming from an iPhone 13 or older.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-4 hidden lg:block">
                {/* Empty space for layout balance, or could put related products here */}
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Sparkles size={24} className="text-violet-600" /> Related Products
              </h3>
              <Link to={`/category/${product.category.toLowerCase()}`} className="text-sm font-bold text-violet-600 hover:text-violet-700 underline underline-offset-4">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))
              ) : (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-slate-100 rounded-[2rem] h-[400px]"></div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
