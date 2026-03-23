import { create } from 'zustand';

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  brand: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  originalPrice: number;
  taxIncluded?: boolean;
  discount: number;
  discountType?: string;
  discountAmount?: number;
  offerStartDate?: string;
  offerEndDate?: string;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  gallery?: string[];
  videoUrl?: string;
  delivery: string;
  stock: string;
  stockQuantity?: number;
  lowStockAlert?: string;
  stockStatus?: string;
  unlimitedStock?: boolean;
  serialNumber?: string;
  warehouseLocation?: string;
  condition: 'New' | 'Used' | 'Refurbished' | string;
  vendorId: string;
  category: string;
  subcategory?: string;
  productType?: string;
  sku?: string;
  barcode?: string;
  slug?: string;
  status?: string;
  shortDescription?: string;
  fullDescription?: string;
  keyFeatures?: string[];
  specifications?: Record<string, string>;
  whatsInBox?: string[] | string;
  warranty?: string;
  warrantyDetails?: string;
  returnPolicy?: string;
  deliveryNote?: string;
  deliveryNotes?: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isBestChoice?: boolean;
  isOnSale?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isRecommended?: boolean;
  isFlashDeal?: boolean;
  isBlackFriday?: boolean;
  isOfferCampaign?: boolean;
  isBundleOffer?: boolean;
  isHotDeals?: boolean;
  isLimitedTime?: boolean;
  isOffer?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
  searchTags?: string;
  deliveryCities?: string[];
  isSameDayDelivery?: boolean;
  isCodAvailable?: boolean;
  vatIncluded?: boolean;
  vatHandling?: string;
  isWarrantyUAE?: boolean;
  sellerLocation?: string;
  sellerLocationUAE?: string;
  deliveryOptions?: string[];
  arabic?: {
    title?: string;
    subtitle?: string;
    shortDescription?: string;
    fullDescription?: string;
    keyFeatures?: string[];
    specifications?: Record<string, string>;
  };
  arabicName?: string;
  arabicDescription?: string;
  arabicKeyFeatures?: string[];
  arabicSpecifications?: Record<string, string>;
  createdAt?: string | any;
  updatedAt?: string | any;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, { ...product, quantity: 1 }] };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  totalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
  totalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
