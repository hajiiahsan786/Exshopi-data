import { Link } from 'react-router-dom';
import { Trash2, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cart';

export function Cart() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 text-center max-w-lg">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-slate-100 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-blue-500/10 rounded-full"></div>
            <ShoppingBag size={48} className="text-slate-300 relative z-10" />
          </div>
          <h2 className="text-3xl font-black mb-4 text-slate-900 tracking-tight">Your cart is empty!</h2>
          <p className="text-slate-500 mb-8 font-medium leading-relaxed">Looks like you haven't added anything to your cart yet. Explore our top categories and find something you love.</p>
          <Link to="/" className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all inline-block shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-0.5">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
          <span className="bg-violet-100 text-violet-700 text-sm font-bold px-3 py-1 rounded-full">{totalItems()} items</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="glass p-4 md:p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-sm hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)] hover:border-violet-300 transition-all duration-500 group">
                <Link to={`/product/${item.id}`} className="w-28 h-28 shrink-0 bg-white/50 backdrop-blur-sm rounded-2xl p-3 border border-slate-100 group-hover:bg-violet-50/30 transition-colors">
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md" />
                </Link>
                
                <div className="flex-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">{item.brand}</div>
                  <Link to={`/product/${item.id}`} className="text-lg font-bold text-slate-900 line-clamp-2 mb-2 hover:text-violet-600 transition-colors leading-tight">
                    {item.title}
                  </Link>
                  <div className="text-xs font-bold text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded-md mb-4 uppercase tracking-wider">
                    {item.delivery}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-slate-100 text-slate-600 transition-colors font-medium"
                      >-</button>
                      <div className="w-12 h-10 flex items-center justify-center font-black text-slate-900 text-sm">
                        {item.quantity}
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:bg-slate-100 text-slate-600 transition-colors font-medium"
                      >+</button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
                    >
                      <Trash2 size={18} /> <span className="hidden md:inline">Remove</span>
                    </button>
                  </div>
                </div>

                <div className="md:text-right shrink-0 w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <div className="text-2xl font-black text-slate-900 tracking-tight">AED {item.price * item.quantity}</div>
                  {item.originalPrice > item.price && (
                    <div className="text-sm font-medium text-slate-400 line-through mt-1">AED {item.originalPrice * item.quantity}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="glass-dark border border-white/10 p-8 rounded-[2rem] sticky top-24 shadow-[0_8px_30px_rgba(6,182,212,0.15)] neon-border">
              <h2 className="text-xl font-black mb-8 text-white">Order Summary</h2>
              
              <div className="space-y-4 text-sm font-medium mb-8">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal ({totalItems()} items)</span>
                  <span className="font-bold text-white">AED {totalPrice()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] bg-emerald-500/20 px-2 py-1 rounded-md">Free</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>VAT (5%)</span>
                  <span className="font-bold text-white">Included</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="font-black text-white text-lg">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-white tracking-tighter">AED {totalPrice()}</span>
                    <p className="text-xs font-medium text-slate-400 mt-1">Inclusive of VAT</p>
                  </div>
                </div>
              </div>

              <Link 
                to="/checkout"
                className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 mb-6 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] group"
              >
                Proceed to Checkout <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center justify-center gap-3 text-sm font-medium text-slate-300 bg-white/5 p-4 rounded-xl border border-white/10">
                <ShieldCheck size={20} className="text-cyan-400" />
                <span>Secure Checkout Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
