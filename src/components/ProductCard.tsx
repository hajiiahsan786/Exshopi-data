import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Store, CheckCircle2, Sparkles, Flame, Clock } from 'lucide-react';
import { useCartStore, Product } from '../store/cart';
import { useWishlistStore } from '../store/wishlist';

interface ProductCardProps {
  product: Product;
  isAIPick?: boolean;
  variant?: 'default' | 'dark';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isAIPick = false, variant = 'default' }) => {
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const isDark = variant === 'dark';
  const inWishlist = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Use actual product data or fallbacks
  const reviewsCount = product.reviews || Math.floor(Math.random() * 500) + 50;
  const isBestSeller = product.isBestseller || product.rating >= 4.8;
  const isNewArrival = product.isNewArrival;
  const isOffer = product.isOffer || product.discount > 0;

  return (
    <div className={`
      relative flex flex-col w-[240px] h-[480px] overflow-hidden transition-all duration-300 group transform hover:-translate-y-1 hover:scale-[1.02]
      ${isDark 
        ? 'glass-dark border border-white/10 rounded-[12px] hover:shadow-[0_8px_30px_rgba(139,92,246,0.2)] hover:border-violet-400/50' 
        : 'bg-white border border-slate-100 rounded-[12px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:border-violet-200'}
    `}>
      
      {/* Product Image Section (~60% height) */}
      <Link to={`/product/${product.id}`} className={`
        relative h-[240px] p-3 flex items-center justify-center transition-colors overflow-hidden shrink-0
        ${isDark ? 'bg-white/5' : 'bg-slate-50/30'}
      `}>
        {/* Top Badges */}
        <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
          {isBestSeller && (
            <div className="bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={10} /> Best Seller
            </div>
          )}
          {isNewArrival && (
            <div className="bg-emerald-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
              New Arrival
            </div>
          )}
          {product.isHotDeals && (
            <div className="bg-rose-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider flex items-center gap-1">
              <Flame size={10} /> Hot Deal
            </div>
          )}
          {product.isFlashDeal && (
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={10} /> Flash Deal
            </div>
          )}
          {product.isSameDayDelivery && (
            <div className="bg-indigo-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider flex items-center gap-1">
              <Clock size={10} /> Same Day Delivery
            </div>
          )}
          {product.isWarrantyUAE && (
            <div className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 size={10} /> UAE Warranty
            </div>
          )}
          {product.condition !== 'New' && (
            <div className="bg-slate-700 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
              {product.condition}
            </div>
          )}
          {product.discount > 0 && (
            <div className="bg-rose-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wider">
              {product.discount}% OFF
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={toggleWishlist}
          className={`
          absolute top-2 right-2 z-20 p-1.5 rounded-full shadow-sm transition-all
          ${inWishlist 
            ? 'bg-rose-500 text-white border-rose-500' 
            : isDark 
              ? 'bg-white/10 text-slate-300 hover:text-rose-400 border border-white/10' 
              : 'bg-white/90 text-slate-400 hover:text-rose-500 border border-slate-100'}
        `}>
          <Heart size={14} className={inWishlist ? 'fill-current' : ''} />
        </button>

        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg relative z-10"
          referrerPolicy="no-referrer"
        />
      </Link>
      
      {/* Product Info Section */}
      <div className={`
        p-[12px] flex flex-col flex-1 
        ${isDark ? 'bg-slate-900/50' : 'bg-white'}
      `}>
        {/* Vendor & Rating */}
        <div className="flex items-center justify-between mb-1">
          <Link 
            to={`/vendor/${product.brand.toLowerCase().replace(/\s+/g, '-')}`} 
            className={`
              flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider transition-colors
              ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-violet-600'}
            `}
          >
            <span className="truncate max-w-[80px]">{product.brand}</span>
          </Link>
          <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
            <Star size={10} className="fill-amber-500" /> 
            {product.rating || '4.9'}
            <span className="text-[8px] text-slate-400 font-medium ml-0.5">({reviewsCount})</span>
          </div>
        </div>

        {/* Title (2 lines max) */}
        <Link 
          to={`/product/${product.id}`} 
          className={`
            font-bold text-[11px] line-clamp-2 mb-2 transition-colors leading-tight h-7
            ${isDark ? 'text-white hover:text-violet-400' : 'text-slate-900 hover:text-violet-600'}
          `}
        >
          {product.title}
        </Link>
        
        <div className="mt-auto">
          {/* Price Section */}
          <div className="flex flex-wrap items-baseline gap-1 mb-1">
            <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AED {product.price}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-[9px] font-medium text-slate-400 line-through">
                  AED {product.originalPrice}
                </span>
                <span className="text-[9px] font-bold text-rose-600">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          {/* Delivery Info */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={10} /> In Stock
            </span>
            <span className="text-[8px] font-bold text-slate-500 bg-slate-100 px-1 py-0.5 rounded">Free Delivery</span>
          </div>
          
          {/* Add to Cart Button (Small) */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className={`
              w-full py-1.5 rounded-lg font-bold text-[10px] transition-all flex items-center justify-center gap-1.5
              active:scale-95 active:opacity-80
              ${isDark 
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                : 'bg-slate-900 hover:bg-violet-600 text-white'}
            `}
          >
            <ShoppingCart size={12} /> 
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
