import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";

// Categories Data
let categories = [
  {
    id: "cat1",
    name: "Electronics",
    arabicName: "إلكترونيات",
    slug: "electronics",
    icon: "Smartphone",
    subcategories: [
      { name: "Mobiles", arabicName: "موبايلات", slug: "mobiles" },
      { name: "Laptops", arabicName: "لابتوبات", slug: "laptops" },
      { name: "Tablets", arabicName: "تابلت", slug: "tablets" },
      { name: "Gaming", arabicName: "ألعاب", slug: "gaming" },
      { name: "Cameras & Photography", arabicName: "كاميرات وتصوير", slug: "cameras" },
      { name: "Audio", arabicName: "صوتيات", slug: "audio" },
      { name: "TV & Home Entertainment", arabicName: "تلفزيونات وترفيه منزلي", slug: "tv-entertainment" }
    ]
  },
  {
    id: "cat2",
    name: "Appliances",
    arabicName: "أجهزة منزلية",
    slug: "appliances",
    icon: "Home",
    subcategories: [
      { name: "Kitchen Appliances", arabicName: "أجهزة المطبخ", slug: "kitchen" },
      { name: "Cleaning Equipment", arabicName: "معدات تنظيف", slug: "cleaning" },
      { name: "Office Equipment", arabicName: "معدات مكتبية", slug: "office" }
    ]
  },
  {
    id: "cat3",
    name: "Health & Beauty",
    arabicName: "الصحة والجمال",
    slug: "health-beauty",
    icon: "Heart",
    subcategories: [
      { name: "Health Devices", arabicName: "أجهزة صحية", slug: "health-devices" },
      { name: "Personal Care", arabicName: "عناية شخصية", slug: "personal-care" }
    ]
  }
];

// Initial Professional Products
let products = [
  {
    id: "1",
    title: "Apple iPhone 15 Pro Max 256GB Natural Titanium",
    subtitle: "The ultimate iPhone with A17 Pro chip",
    brand: "Apple",
    category: "Electronics",
    subcategory: "Mobiles",
    productType: "Smartphone",
    condition: "New",
    sku: "IP15PM-256-NT",
    barcode: "194253701234",
    slug: "apple-iphone-15-pro-max-256gb-natural-titanium",
    status: "Active",
    price: 4599,
    salePrice: 4299,
    originalPrice: 5099,
    taxIncluded: true,
    discountType: "Fixed",
    discountAmount: 800,
    stockQuantity: 50,
    stockStatus: "In Stock",
    image: "https://picsum.photos/seed/iphone15/800/800",
    gallery: [
      "https://picsum.photos/seed/iphone15-1/800/800",
      "https://picsum.photos/seed/iphone15-2/800/800",
      "https://picsum.photos/seed/iphone15-3/800/800",
      "https://picsum.photos/seed/iphone15-4/800/800"
    ],
    shortDescription: "Experience the power of titanium with the iPhone 15 Pro Max.",
    fullDescription: "The iPhone 15 Pro Max features a strong and light aerospace-grade titanium design with a textured matte-glass back. It also features a Ceramic Shield front that’s tougher than any smartphone glass. And it’s splash, water, and dust resistant.",
    keyFeatures: [
      "A17 Pro chip with 6-core GPU",
      "Pro camera system (48MP Main, 12MP Ultra Wide, 12MP Telephoto)",
      "Up to 29 hours video playback",
      "USB-C connector with USB 3 speeds",
      "Action button for quick access to features"
    ],
    specifications: {
      "Display": "6.7-inch Super Retina XDR display",
      "Chip": "A17 Pro chip",
      "Camera": "Pro camera system (48MP Main)",
      "Battery": "Built-in rechargeable lithium-ion battery",
      "OS": "iOS 17",
      "Weight": "221 grams",
      "Dimensions": "159.9 x 76.7 x 8.25 mm"
    },
    whatsInBox: ["iPhone 15 Pro Max", "USB-C Charge Cable (1m)", "Documentation"],
    warranty: "1 Year International Warranty",
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    isOffer: true,
    isTrending: true,
    isFlashDeal: true,
    deliveryCities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Fujairah", "Ras Al Khaimah", "Umm Al Quwain"],
    isSameDayDelivery: true,
    isCodAvailable: true,
    vatIncluded: true,
    sellerLocation: "Dubai",
    arabic: {
      title: "أبل آيفون 15 برو ماكس 256 جيجابايت تيتانيوم طبيعي",
      subtitle: "الآيفون الأقوى مع شريحة A17 برو",
      shortDescription: "اختبر قوة التيتانيوم مع آيفون 15 برو ماكس.",
      fullDescription: "يتميز آيفون 15 برو ماكس بتصميم تيتانيوم قوي وخفيف الوزن مع خلفية زجاجية غير لامعة. كما يتميز بواجهة درع السيراميك الأقوى من أي زجاج هاتف ذكي.",
      keyFeatures: [
        "شريحة A17 برو مع وحدة معالجة رسومات سداسية النواة",
        "نظام كاميرا احترافي (48 ميجابكسل رئيسية)",
        "ما يصل إلى 29 ساعة من تشغيل الفيديو",
        "موصل USB-C مع سرعات USB 3"
      ]
    },
    rating: 4.8,
    reviews: 1245,
    vendorId: "v1",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "ASUS ROG Zephyrus G14 Gaming Laptop",
    subtitle: "Powerful 14-inch gaming laptop with AniMe Matrix",
    brand: "ASUS",
    category: "Electronics",
    subcategory: "Laptops",
    productType: "Gaming Laptop",
    condition: "New",
    sku: "ROG-G14-2024",
    slug: "asus-rog-zephyrus-g14-gaming-laptop",
    status: "Active",
    price: 7499,
    salePrice: 6999,
    originalPrice: 7999,
    taxIncluded: true,
    stockQuantity: 15,
    stockStatus: "In Stock",
    image: "https://picsum.photos/seed/rog-g14/800/800",
    gallery: [
      "https://picsum.photos/seed/rog-g14-1/800/800",
      "https://picsum.photos/seed/rog-g14-2/800/800"
    ],
    shortDescription: "The world's most powerful 14-inch gaming laptop.",
    fullDescription: "The 2024 Zephyrus G14 is powered by an AMD Ryzen 9 processor and NVIDIA GeForce RTX 4070 Laptop GPU. It features a stunning OLED ROG Nebula Display.",
    keyFeatures: [
      "AMD Ryzen 9 8945HS Processor",
      "NVIDIA GeForce RTX 4070 8GB GDDR6",
      "16GB LPDDR5X RAM",
      "1TB PCIe 4.0 NVMe M.2 SSD",
      "14-inch 3K 120Hz OLED Display"
    ],
    specifications: {
      "Processor": "AMD Ryzen 9 8945HS",
      "Graphics": "NVIDIA GeForce RTX 4070",
      "Memory": "16GB LPDDR5X",
      "Storage": "1TB SSD",
      "Display": "14-inch OLED, 3K resolution",
      "Operating System": "Windows 11 Home",
      "Weight": "1.50 kg"
    },
    isFeatured: true,
    isHotDeals: true,
    isBestseller: true,
    deliveryCities: ["Dubai", "Abu Dhabi"],
    isSameDayDelivery: false,
    isCodAvailable: true,
    vatIncluded: true,
    sellerLocation: "Dubai",
    rating: 4.9,
    reviews: 85,
    vendorId: "v2",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Samsung Galaxy S24 Ultra 512GB Titanium Gray",
    subtitle: "Galaxy AI is here",
    brand: "Samsung",
    category: "Electronics",
    subcategory: "Mobiles",
    productType: "Smartphone",
    condition: "New",
    sku: "S24U-512-TG",
    slug: "samsung-galaxy-s24-ultra-512gb-titanium-gray",
    status: "Active",
    price: 5099,
    salePrice: 4699,
    originalPrice: 5499,
    taxIncluded: true,
    stockQuantity: 30,
    stockStatus: "In Stock",
    image: "https://picsum.photos/seed/s24ultra/800/800",
    shortDescription: "The ultimate Galaxy Ultra experience with built-in S Pen.",
    fullDescription: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.",
    keyFeatures: [
      "Built-in S Pen",
      "200MP Main Camera",
      "Snapdragon 8 Gen 3 for Galaxy",
      "Long-lasting 5000mAh battery",
      "Titanium frame"
    ],
    specifications: {
      "Display": "6.8-inch Dynamic AMOLED 2X",
      "Processor": "Snapdragon 8 Gen 3",
      "Camera": "200MP + 50MP + 12MP + 10MP",
      "Battery": "5000mAh",
      "Storage": "512GB",
      "5G Support": "Yes",
      "SIM": "Dual SIM (Nano-SIM and eSIM)"
    },
    isBestseller: true,
    isNewArrival: true,
    isLimitedTime: true,
    vatIncluded: true,
    sellerLocation: "Dubai",
    rating: 4.7,
    reviews: 950,
    vendorId: "v2",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Sony PlayStation 5 Slim Console",
    subtitle: "Play Has No Limits",
    brand: "Sony",
    category: "Electronics",
    subcategory: "Gaming",
    productType: "Console",
    condition: "New",
    sku: "PS5-SLIM-DISC",
    slug: "sony-playstation-5-slim-console",
    status: "Active",
    price: 2099,
    salePrice: 1899,
    originalPrice: 2299,
    taxIncluded: true,
    stockQuantity: 100,
    stockStatus: "In Stock",
    image: "https://picsum.photos/seed/ps5slim/800/800",
    shortDescription: "Experience lightning-fast loading with an ultra-high speed SSD.",
    fullDescription: "The PS5 console unleashes new gaming possibilities that you never anticipated. Experience lightning fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.",
    keyFeatures: [
      "Ultra-High Speed SSD",
      "Integrated I/O",
      "Ray Tracing",
      "4K-TV Gaming",
      "Up to 120fps with 120Hz output"
    ],
    specifications: {
      "CPU": "x86-64-AMD Ryzen Zen 2",
      "GPU": "AMD Radeon RDNA 2-based graphics engine",
      "Memory": "GDDR6 16GB",
      "SSD": "1TB",
      "Video Out": "Support of 4K 120Hz TVs, 8K TVs"
    },
    isFeatured: true,
    isBestseller: true,
    isOffer: true,
    vatIncluded: true,
    sellerLocation: "Abu Dhabi",
    rating: 4.9,
    reviews: 3200,
    vendorId: "v3",
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Dyson V15 Detect Absolute Cordless Vacuum",
    subtitle: "The most powerful, intelligent cordless vacuum",
    brand: "Dyson",
    category: "Appliances",
    subcategory: "Cleaning Equipment",
    productType: "Vacuum Cleaner",
    condition: "New",
    sku: "DYSON-V15-ABS",
    slug: "dyson-v15-detect-absolute-cordless-vacuum",
    status: "Active",
    price: 2899,
    salePrice: 2499,
    originalPrice: 3099,
    taxIncluded: true,
    stockQuantity: 20,
    stockStatus: "In Stock",
    image: "https://picsum.photos/seed/dysonv15/800/800",
    shortDescription: "Dyson's most powerful, intelligent cordless vacuum with laser illumination.",
    fullDescription: "A piezo sensor continuously sizes and counts dust particles – automatically increasing suction power when needed. LCD screen shows what’s been sucked up in real time.",
    keyFeatures: [
      "Laser detects the particles you can’t normally see",
      "Counts and sizes dust particles",
      "Scientific proof of a deep clean",
      "Dyson Hyperdymium motor",
      "Root Cyclone technology"
    ],
    specifications: {
      "Suction Power": "240 AW",
      "Bin Volume": "0.76 L",
      "Run Time": "Up to 60 min",
      "Charge Time": "4.5 hours",
      "Weight": "3 kg",
      "Filtration": "99.99% up to 0.3 microns"
    },
    isFeatured: true,
    isHotDeals: true,
    vatIncluded: true,
    sellerLocation: "Dubai",
    rating: 4.8,
    reviews: 450,
    vendorId: "v1",
    createdAt: new Date().toISOString()
  },
  {
    id: "6",
    title: "Nespresso Vertuo Pop Coffee Machine",
    subtitle: "Add a pop of color to your life",
    brand: "Nespresso",
    category: "Appliances",
    subcategory: "Kitchen Appliances",
    productType: "Coffee Maker",
    condition: "New",
    sku: "NES-V-POP-RED",
    slug: "nespresso-vertuo-pop-coffee-machine",
    status: "Active",
    price: 699,
    salePrice: 499,
    originalPrice: 799,
    taxIncluded: true,
    stockQuantity: 40,
    stockStatus: "In Stock",
    image: "https://picsum.photos/seed/nespresso/800/800",
    shortDescription: "Compact and colorful coffee machine for Vertuo capsules.",
    fullDescription: "Vertuo Pop is the most compact Vertuo machine on the market. It comes in a range of vibrant colors to suit your style. With four cup sizes, from Espressos to Mugs, simply choose your Nespresso capsule, pop it in, and you’re away at the touch of a button.",
    keyFeatures: [
      "Centrifusion technology",
      "One-touch brewing",
      "4 cup sizes",
      "Fast heat-up time",
      "Automatic power off"
    ],
    specifications: {
      "Water Tank": "0.6 L",
      "Capsule Container": "8 small capsules",
      "Dimensions": "13.6 x 42.6 x 25 cm",
      "Weight": "3.5 kg",
      "Cable Length": "75 cm",
      "Power": "1260 Watts"
    },
    isNewArrival: true,
    isOffer: true,
    isLimitedTime: true,
    vatIncluded: true,
    sellerLocation: "Sharjah",
    rating: 4.5,
    reviews: 210,
    vendorId: "v2",
    createdAt: new Date().toISOString()
  },
  {
    id: "7",
    title: "Used MacBook Pro 14 (2021) M1 Pro 16GB/512GB",
    subtitle: "Excellent condition, barely used",
    brand: "Apple",
    category: "Electronics",
    subcategory: "Laptops",
    productType: "Laptop",
    condition: "Used",
    sku: "USED-MBP14-2021",
    slug: "used-macbook-pro-14-2021-m1-pro",
    status: "Active",
    price: 4200,
    originalPrice: 7500,
    taxIncluded: true,
    stockQuantity: 1,
    stockStatus: "In Stock",
    image: "https://picsum.photos/seed/usedmac/800/800",
    shortDescription: "Pre-owned MacBook Pro in Space Gray. 95% battery health.",
    fullDescription: "This MacBook Pro is in excellent cosmetic condition with minimal signs of use. It has been fully tested and is 100% functional. Comes with original charger.",
    keyFeatures: [
      "M1 Pro chip with 8-core CPU and 14-core GPU",
      "16GB Unified Memory",
      "512GB SSD Storage",
      "Liquid Retina XDR display",
      "95% Battery Health"
    ],
    specifications: {
      "Processor": "Apple M1 Pro",
      "RAM": "16GB",
      "Storage": "512GB SSD",
      "Battery Health": "95%",
      "Cycle Count": "120",
      "Cosmetic Condition": "Grade A (Like New)",
      "Warranty Status": "Expired"
    },
    isTrending: true,
    isRecommended: true,
    vatIncluded: true,
    sellerLocation: "Dubai",
    rating: 4.6,
    reviews: 12,
    vendorId: "v3",
    createdAt: new Date().toISOString()
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Categories API
  app.get("/api/categories", (req, res) => {
    res.json(categories);
  });

  // Products API
  app.get("/api/products", (req, res) => {
    let filteredProducts = [...products];
    const { category, subcategory, brand, condition, isFeatured, isBestseller, isTrending, isNewArrival, isHotDeals, isLimitedTime, isOffer } = req.query;

    if (category) filteredProducts = filteredProducts.filter(p => p.category === category);
    if (subcategory) filteredProducts = filteredProducts.filter(p => p.subcategory === subcategory);
    if (brand) filteredProducts = filteredProducts.filter(p => p.brand === brand);
    if (condition) filteredProducts = filteredProducts.filter(p => p.condition === condition);
    if (isFeatured === 'true') filteredProducts = filteredProducts.filter(p => p.isFeatured);
    if (isBestseller === 'true') filteredProducts = filteredProducts.filter(p => p.isBestseller);
    if (isTrending === 'true') filteredProducts = filteredProducts.filter(p => p.isTrending);
    if (isNewArrival === 'true') filteredProducts = filteredProducts.filter(p => p.isNewArrival);
    if (isHotDeals === 'true') filteredProducts = filteredProducts.filter(p => p.isHotDeals);
    if (isLimitedTime === 'true') filteredProducts = filteredProducts.filter(p => p.isLimitedTime);
    if (isOffer === 'true') filteredProducts = filteredProducts.filter(p => p.isOffer);

    res.json(filteredProducts);
  });

  app.get("/api/products/:id", (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ error: "Product not found" });
  });

  // AI Image Generation (Placeholder using Picsum with keywords)
  app.post("/api/admin/generate-image", async (req, res) => {
    const { title, category } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    try {
      // In a real app, we'd use Imagen or DALL-E. 
      // For now, we'll use a high-quality placeholder with a seed based on the title.
      const seed = title.toLowerCase().replace(/\s+/g, '-');
      const imageUrl = `https://picsum.photos/seed/${seed}/800/800`;
      
      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate image" });
    }
  });

  // Gemini Content Generation
  app.post("/api/admin/generate-content", async (req, res) => {
    const { title, category, subcategory, condition } = req.body;
    if (!title || !category) return res.status(400).json({ error: "Title and Category are required" });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const prompt = `You are a professional e-commerce content writer for a premium UAE marketplace.
      Generate highly detailed, professional, and UNIQUE content for the following product:
      
      Product Title: ${title}
      Category: ${category}
      Subcategory: ${subcategory}
      Condition: ${condition}

      CRITICAL RULES:
      1. DO NOT use generic templates. Every product must have unique phrasing.
      2. If category is 'Electronics' (Mobiles/Laptops), focus on technical specs like RAM, Storage, Processor, Camera, Display.
      3. If category is 'Appliances', focus on energy efficiency, capacity, and smart features.
      4. If condition is 'Used' or 'Refurbished', include a section in the description about the inspection process and cosmetic grade.
      5. Specifications must be a flat object with key-value pairs relevant to the category.
      6. Key features must be 5-7 compelling bullet points.
      7. Provide high-quality Arabic translations for title, description, and key features.

      Return a JSON object with EXACTLY these fields:
      - subtitle (A catchy marketing tagline)
      - shortDescription (A 2-sentence summary)
      - fullDescription (A detailed, multi-paragraph description highlighting benefits and use cases)
      - keyFeatures (Array of strings)
      - specifications (Object with key-value pairs)
      - whatsInBox (A string listing items included)
      - arabicName (Arabic translation of the title)
      - arabicDescription (Arabic translation of the full description)
      - arabicKeyFeatures (Array of translated key features)

      Ensure the tone is premium, trustworthy, and tailored to the UAE market (mentioning UAE warranty or local support where applicable).`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      res.json(JSON.parse(response.text));
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  app.post("/api/admin/products", (req, res) => {
    const newProduct = {
      id: Math.random().toString(36).substr(2, 9),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    products.unshift(newProduct);
    res.status(201).json(newProduct);
  });

  app.put("/api/admin/products/:id", (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...req.body, updatedAt: new Date().toISOString() };
      res.json(products[index]);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  app.delete("/api/admin/products/:id", (req, res) => {
    const { id } = req.params;
    products = products.filter(p => p.id !== id);
    res.json({ success: true });
  });

  // Vendors API
  let vendors = [
    { id: 'v1', name: 'Apple Official', email: 'apple@example.com', role: 'vendor', productsCount: 45, totalSales: 1200000, status: 'Active' },
    { id: 'v2', name: 'Samsung Gulf', email: 'samsung@example.com', role: 'vendor', productsCount: 32, totalSales: 850000, status: 'Active' },
    { id: 'v3', name: 'Sony Middle East', email: 'sony@example.com', role: 'vendor', productsCount: 28, totalSales: 640000, status: 'Active' },
  ];

  app.get("/api/vendors", (req, res) => {
    res.json(vendors);
  });

  // Orders API
  let orders = [
    { id: '1001', customerName: 'John Doe', date: 'Mar 22, 2026', amount: 4599, status: 'Processing' },
    { id: '1002', customerName: 'Jane Smith', date: 'Mar 21, 2026', amount: 1899, status: 'Shipped' },
    { id: '1003', customerName: 'Ahmed Ali', date: 'Mar 20, 2026', amount: 4299, status: 'Delivered' },
  ];

  app.get("/api/orders", (req, res) => {
    res.json(orders);
  });

  // Customers API
  let customers = [
    { id: 'c1', name: 'John Doe', email: 'john@example.com', ordersCount: 5, totalSpent: 12450 },
    { id: 'c2', name: 'Jane Smith', email: 'jane@example.com', ordersCount: 3, totalSpent: 5670 },
    { id: 'c3', name: 'Ahmed Ali', email: 'ahmed@example.com', ordersCount: 8, totalSpent: 24300 },
  ];

  app.get("/api/customers", (req, res) => {
    res.json(customers);
  });

  // Dashboard Stats API
  app.get("/api/admin/stats", (req, res) => {
    res.json({
      revenue: 124500,
      orders: orders.length,
      customers: customers.length,
      products: products.length
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
