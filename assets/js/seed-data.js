/**
 * MUSAFIR - Islamic Lifestyle E-commerce
 * Initial Catalog & Seed Data
 * Dual Language (EN / BN) with Multiple Gallery Images, Stock Quantity & Product Highlights
 */

window.DEFAULT_CATEGORIES = [
  {
    id: "quran-tafsir",
    name_en: "Quran & Tafsir",
    name_bn: "কুরআন ও তাফসীর",
    image: "assets/images/product-quran.jpg",
    icon: `<svg class="w-8 h-8 mx-auto text-[#D6A63A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`,
    count: 4
  },
  {
    id: "prayer-essentials",
    name_en: "Prayer Essentials",
    name_bn: "নামাজের অনুষঙ্গ",
    image: "assets/images/product-tasbih.jpg",
    icon: `<svg class="w-8 h-8 mx-auto text-[#D6A63A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/><circle cx="12" cy="7" r="1" fill="#D6A63A"/><circle cx="15.5" cy="8.5" r="1" fill="#D6A63A"/><circle cx="17" cy="12" r="1" fill="#D6A63A"/><circle cx="15.5" cy="15.5" r="1" fill="#D6A63A"/><circle cx="12" cy="17" r="1" fill="#D6A63A"/><circle cx="8.5" cy="15.5" r="1" fill="#D6A63A"/><circle cx="7" cy="12" r="1" fill="#D6A63A"/><circle cx="8.5" cy="8.5" r="1" fill="#D6A63A"/></svg>`,
    count: 6
  },
  {
    id: "home-decor",
    name_en: "Islamic Home Decor",
    name_bn: "ইসলামিক হোম ডেকর",
    image: "assets/images/product-wallart.jpg",
    icon: `<svg class="w-8 h-8 mx-auto text-[#D6A63A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
    count: 5
  },
  {
    id: "books-learning",
    name_en: "Books & Learning",
    name_bn: "বই ও শিক্ষা",
    image: "assets/images/product-quran.jpg",
    icon: `<svg class="w-8 h-8 mx-auto text-[#D6A63A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></svg>`,
    count: 8
  },
  {
    id: "gifts-hampers",
    name_en: "Gifts & Hampers",
    name_bn: "গিফট ও হ্যাম্পার",
    image: "assets/images/product-giftbox.jpg",
    icon: `<svg class="w-8 h-8 mx-auto text-[#D6A63A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v13m0-13V4.5a2.5 2.5 0 10-5 0V8m5 0V4.5a2.5 2.5 0 115 0V8m-10 0h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V10a2 2 0 012-2z"/></svg>`,
    count: 4
  },
  {
    id: "accessories",
    name_en: "Accessories",
    name_bn: "এক্সেসরিজ ও সুগন্ধি",
    image: "assets/images/product-attar.jpg",
    icon: `<svg class="w-8 h-8 mx-auto text-[#D6A63A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>`,
    count: 7
  }
];

window.DEFAULT_SEED_ITEMS = [
  {
    id: "p1",
    title_en: "Quran (With Translation)",
    title_bn: "পবিত্র কুরআন (অনুবাদসহ)",
    slug: "quran-with-translation",
    category: "quran-tafsir",
    category_en: "Quran & Tafsir",
    category_bn: "কুরআন ও তাফসীর",
    price: 550,
    originalPrice: 650,
    isPopular: true,
    rating: 5.0,
    reviewsCount: 38,
    stockQuantity: 45,
    inStock: true,
    image: "assets/images/product-quran.jpg",
    gallery: [
      "assets/images/product-quran.jpg",
      "assets/images/Hero-Banner-Background-Image.webp",
      "assets/images/product-wallart.jpg"
    ],
    highlights_en: [
      "Authentic Uthmani Script with Clear Fonts",
      "Word-by-word Bengali & English Meaning",
      "Luxury Hardcover with Embossed Gold Foil",
      "Thick Fine-Grade Eye-Care Archival Paper"
    ],
    highlights_bn: [
      "নির্ভুল উসমানী লিপি ও অত্যন্ত স্পষ্ট হরফ",
      "সহজ প্রাঞ্জল বাংলা ও ইংরেজি শব্দার্থ ও অনুবাদ",
      "স্বর্ণালী ফয়েল এমবসড লাক্সারি হার্ডকভার বাঁধাই",
      "দীর্ঘস্থায়ী ও চোখের জন্য আরামদায়ক প্রিমিয়াম আর্ট পেপার"
    ],
    shortDesc_en: "Beautiful foil-embossed Holy Quran with lucid Bengali and English word-by-word translation.",
    shortDesc_bn: "স্বর্ণালী ফয়েল এমবসড বাঁধাইয়ে সহজ ও প্রাঞ্জল বাংলা ও ইংরেজি অনুবাদসহ পবিত্র কুরআন মাজীদ।",
    desc_en: "A masterpiece of craftsmanship featuring premium art paper, clear Uthmani script font, elegant margins, and authentic explanatory footnotes. Perfect for daily recitation, deep contemplation, and as a blessed gift for loved ones.",
    desc_bn: "প্রিমিয়াম আর্ট পেপার, নির্ভুল উসমানী স্ক্রিপ্ট এবং সহজ ও সাবলীল অনুবাদ সম্বলিত এই কুরআন মাজীদ প্রতিদিনের তিলাওয়াত ও গভীর উপলব্ধির জন্য অসাধারণ একটি উপহার।",
    specs: {
      "Script / লিপি": "Uthmani / উসমানী",
      "Pages / পৃষ্ঠা": "624 Pages",
      "Cover / কভার": "Hardcover Luxury Gold Foil",
      "Language / ভাষা": "Arabic with Bengali & English Meaning"
    }
  },
  {
    id: "p2",
    title_en: "Premium Tasbih",
    title_bn: "প্রিমিয়াম অনিক্স তসবিহ",
    slug: "premium-tasbih",
    category: "prayer-essentials",
    category_en: "Prayer Essentials",
    category_bn: "নামাজের অনুষঙ্গ",
    price: 250,
    originalPrice: 320,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 52,
    stockQuantity: 60,
    inStock: true,
    image: "assets/images/product-tasbih.jpg",
    gallery: [
      "assets/images/product-tasbih.jpg",
      "assets/images/product-digital-tasbih.jpg",
      "assets/images/product-janamaz.jpg"
    ],
    highlights_en: [
      "Handcrafted from 100% Genuine Black Onyx",
      "Smooth Finger Glide for Seamless Daily Dhikr",
      "Antique Gold Spacers & Pure Silk Tassel",
      "Reinforced High-Tensile Cord for Durability"
    ],
    highlights_bn: [
      "১০০% খাঁটি প্রাকৃতিক মসৃণ ব্ল্যাক অনিক্স পাথর",
      "জিকিরের সময় আরামদায়ক ও নিখুঁত আঙ্গুল সঞ্চালন",
      "এন্টিক গোল্ড ডিভাইডার এবং খাঁটি রেশমি সুতার টার্সেল",
      "ছিঁড়ে না যাওয়ার মতো অত্যন্ত মজবুত ও টেকসই সুতায় গাঁথা"
    ],
    shortDesc_en: "High-grade handcrafted black onyx prayer beads with antique gold dividers and silk tassel.",
    shortDesc_bn: "উন্নতমানের ব্ল্যাক অনিক্স পাথরের ৯৯ দানার হস্তনির্মিত তসবিহ, যাতে রয়েছে সোনালী বিভাজক ও রেশমি সুতার টার্সেল।",
    desc_en: "Handcrafted 99-bead tasbih featuring smooth, cool-to-the-touch polished black onyx stones. Designed with ergonomic spacing for smooth daily remembrance (Dhikr) and effortless finger glide.",
    desc_bn: "৯৯ দানার এই দৃষ্টিনন্দন তসবিহটি মসৃণ ও দীর্ঘস্থায়ী। জিকির ও তাসবীহ পাঠের সময় আঙ্গুলের সহজ সঞ্চালনের জন্য বিশেষভাবে গাঁথা হয়েছে।",
    specs: {
      "Bead Count / দানা": "99 Beads + Minaret Tassel",
      "Material / উপাদান": "Polished Natural Onyx Stone & Metal",
      "Tassel / টার্সেল": "Pure Silk Blend Thread",
      "Durability / স্থায়িত্ব": "High Tensile Cord"
    }
  },
  {
    id: "p3",
    title_en: "Islamic Wall Art",
    title_bn: "ইসলামিক ক্যালিগ্রাফি ওয়াল আর্ট",
    slug: "islamic-wall-art",
    category: "home-decor",
    category_en: "Islamic Home Decor",
    category_bn: "ইসলামিক হোম ডেকর",
    price: 450,
    originalPrice: 580,
    isPopular: false,
    rating: 4.8,
    reviewsCount: 29,
    stockQuantity: 20,
    inStock: true,
    image: "assets/images/product-wallart.jpg",
    gallery: [
      "assets/images/product-wallart.jpg",
      "assets/images/product-lantern.jpg"
    ],
    highlights_en: [
      "Magnificent 'Allah' Thuluth Arabic Calligraphy",
      "Brushed Antique Gold Wood Grain Frame",
      "Museum-Grade Matte UV-Resistant Canvas",
      "Ready to Hang with Pre-installed Hardware"
    ],
    highlights_bn: [
      "মনোমুগ্ধকর স্বর্ণালী থুলুথ আরবি ক্যালিগ্রাফি নকশা",
      "এন্টিক গোল্ড ফিনিশিংযুক্ত প্রিমিয়াম কাঠের ফ্রেম",
      "রং নষ্ট না হওয়ার আল্ট্রা এইচডি ক্যানভাস প্রিন্ট",
      "দেয়ালে সহজে ঝুলানোর উপযোগী মেটাল হ্যাঙ্গার সংযুক্ত"
    ],
    shortDesc_en: "Elegant golden Arabic calligraphy frame of 'Allah' on museum-grade textured matte canvas.",
    shortDesc_bn: "আধুনিক স্বর্ণালী থুলুথ ক্যালিগ্রাফিতে 'আল্লাহ' খচিত প্রিমিয়াম কাঠের ফ্রেমযুক্ত ক্যানভাস আর্ট।",
    desc_en: "Bring spiritual serenity and majestic Islamic aesthetic to your living space, prayer corner, or office with this timeless Allah calligraphy framed in brushed antique gold moulding.",
    desc_bn: "আপনার ড্রয়িংরুম, নামাজের কর্নার কিংবা অফিসের দেয়ালে এক টুকরো আধ্যাত্মিক আবহ ফুটিয়ে তুলুন এই প্রিমিয়াম ক্যালিগ্রাফি ফ্রেমের মাধ্যমে।",
    specs: {
      "Dimensions / সাইজ": "12 x 18 Inches",
      "Frame / ফ্রেম": "Brushed Antique Gold Finish Synthetic Wood",
      "Print / প্রিন্ট": "Fade-resistant Ultra HD Matte Canvas",
      "Mounting / ঝুলানোর ব্যবস্থা": "Pre-installed Metal Wall Hanger"
    }
  },
  {
    id: "p4",
    title_en: "Ramadan Lantern",
    title_bn: "রমাদান ঐতিহ্যের লণ্ঠন",
    slug: "ramadan-lantern",
    category: "home-decor",
    category_en: "Islamic Home Decor",
    category_bn: "ইসলামিক হোম ডেকর",
    price: 600,
    originalPrice: 750,
    isPopular: false,
    rating: 5.0,
    reviewsCount: 44,
    stockQuantity: 18,
    inStock: true,
    image: "assets/images/product-lantern.jpg",
    gallery: [
      "assets/images/product-lantern.jpg",
      "assets/images/Hero-Banner-Background-Image.webp"
    ],
    highlights_en: [
      "Traditional Moroccan Arabesque Geometric Filigree",
      "Warm Amber Lighting Casts Mesmerizing Patterns",
      "Real Antique Brass Metal Construction",
      "Compatible with Real Candles or Safe LED Lights"
    ],
    highlights_bn: [
      "ঐতিহ্যবাহী মরোক্কান জ্যামিতিক নকশার নিখুঁত কারুকাজ",
      "ঘরের দেয়ালে স্নিগ্ধ অ্যাম্বার আলোর মোহময় প্রতিচ্ছবি",
      "মজবুত ও খাঁটি অ্যান্টিক ব্রাস মেটাল দ্বারা তৈরি",
      "মোমবাতি অথবা নিরাপদ এলইডি লাইট দুটোই ব্যবহারযোগ্য"
    ],
    shortDesc_en: "Vintage Moroccan filigree brass lantern casting intricate warm arabesque light patterns.",
    shortDesc_bn: "মরোক্কান ট্র্যাডিশনাল এন্টিক ব্রাস ফানুস যা ঘরে ছড়ায় স্নিগ্ধ অ্যাম্বার আলোর মোহময় জ্যামিতিক নকশা।",
    desc_en: "Create a warm, blessed ambiance during Ramadan evenings, family gatherings, and everyday quiet reflection with this intricately patterned brass lantern with safe warm LED tea light support.",
    desc_bn: "রমাদানের স্নিগ্ধ সন্ধ্যা এবং প্রতিদিনের ইবাদতের শান্ত পরিবেশ সৃষ্টিতে এই অ্যান্টিক ব্রাস লণ্ঠনটি অতুলনীয়। মোমবাতি কিংবা এলইডি লাইট দুটোই ব্যবহারযোগ্য।",
    specs: {
      "Height / উচ্চতা": "10 Inches",
      "Material / উপাদান": "Antique Brass & Tinted Glass",
      "Light Source / আলো": "Candle / Warm LED Compatible",
      "Style / শৈলী": "Moroccan Geometric Arabesque"
    }
  },
  {
    id: "p5",
    title_en: "Smart Digital Tasbih Counter",
    title_bn: "স্মার্ট ডিজিটাল তসবিহ কাউন্টার",
    slug: "smart-digital-tasbih",
    category: "prayer-essentials",
    category_en: "Prayer Essentials",
    category_bn: "নামাজের অনুষঙ্গ",
    price: 350,
    originalPrice: 480,
    isPopular: true,
    rating: 4.9,
    reviewsCount: 65,
    stockQuantity: 75,
    inStock: true,
    image: "assets/images/product-digital-tasbih.jpg",
    gallery: [
      "assets/images/product-digital-tasbih.jpg",
      "assets/images/product-tasbih.jpg"
    ],
    highlights_en: [
      "Backlit LED Display for Easy Night Recitation",
      "Silent Click Mechanical Switch - Zero Noise",
      "Comfortable Adjustable Silicone Finger Band",
      "Long-lasting Battery with Auto Power-Save"
    ],
    highlights_bn: [
      "নাইট ভিশন এলইডি ডিসপ্লে—অন্ধকারেও স্পষ্ট পাঠযোগ্য",
      "সম্পূর্ণ নিঃশব্দ ক্লিক বাটন—অন্যদের মনোযোগ বিঘ্নিত হবে না",
      "আরামদায়ক অ্যাডজাস্টেবল সিলিকন ফিংগার ব্যান্ড",
      "অটো পাওয়ার-সেভ মোডসহ দীর্ঘস্থায়ী ব্যাটারি লাইফ"
    ],
    shortDesc_en: "Modern ergonomic digital finger counter with LED backlight, silent click, and auto-sleep.",
    shortDesc_bn: "নাইট ভিশন এলইডি ব্যাকলাইট, সাইলেন্ট ক্লিক এবং অটো-স্লিপ সুবিধা সম্পন্ন প্রিমিয়াম ডিজিটাল তসবিহ।",
    desc_en: "An indispensable companion for daily Istighfar and Salawat. Features a soft silicone adjustable finger strap, bright LED screen for night use, and durable battery life.",
    desc_bn: "দৈনন্দিন ইস্তিগফার ও দুরুদ শরীফ পাঠের আধুনিক সঙ্গী। আরামদায়ক সিলিকন স্ট্র্যাপ এবং অন্ধকারেও পাঠের জন্য স্পষ্ট ডিসপ্লে।",
    specs: {
      "Count Range / রেঞ্জ": "0 to 99999",
      "Display / ডিসপ্লে": "OLED Backlit Screen",
      "Feature / সুবিধা": "Reset button, Memory save, Silent click",
      "Strap / স্ট্র্যাপ": "Food-grade Adjustable Silicone"
    }
  },
  {
    id: "p6",
    title_en: "Turkish Velvet Janamaz (Prayer Mat)",
    title_bn: "তুর্কি প্রিমিয়াম ভেলভেট জায়নামাজ",
    slug: "turkish-velvet-janamaz",
    category: "prayer-essentials",
    category_en: "Prayer Essentials",
    category_bn: "নামাজের অনুষঙ্গ",
    price: 1250,
    originalPrice: 1550,
    isPopular: true,
    rating: 5.0,
    reviewsCount: 78,
    stockQuantity: 25,
    inStock: true,
    image: "assets/images/product-janamaz.jpg",
    gallery: [
      "assets/images/product-janamaz.jpg",
      "assets/images/product-tasbih.jpg"
    ],
    highlights_en: [
      "12mm Orthopedic Memory Foam Cushioning",
      "Deep Emerald Green Turkish Velvet & Gold Fringe",
      "Anti-Slip Gripped Underside Prevents Shifting",
      "Relieves Knee & Joint Pressure During Long Sujood"
    ],
    highlights_bn: [
      "১২ মিমি পুরু অর্থোপেডিক মেমোরি ফোম কুশনিং",
      "ইস্তাম্বুলের নিখুঁত কারুকাজ ও মোলায়েম ভেলভেট ফিনিশ",
      "নিচে উন্নতমানের অ্যান্টি-স্লিপ গ্রিপ—মেঝেতে পিছলে যাবে না",
      "দীর্ঘক্ষণ নামাজ ও সেজদায় হাঁটু ও জয়েন্টের ব্যথা রোধ করে"
    ],
    shortDesc_en: "Extra-soft, thick memory foam padded Turkish velvet prayer mat with traditional mihrab motif.",
    shortDesc_bn: "পুরু ফোম কুশনিং ও মোলায়েম ভেলভেটে তৈরি তুর্কি জায়নামাজ, যা রুকু ও সিজদায় দেয় আরামদায়ক অনুভূতি।",
    desc_en: "Designed for comfortable Sujood, especially relieving knee and joint strain during long Taraweeh and Tahajjud prayers. Finished with anti-slip backing and elegant golden fringes.",
    desc_bn: "দীর্ঘক্ষণ সালাত ও তাহাজ্জুদে সিজদার সময় হাঁটু ও জয়েন্টের সুরক্ষায় বিশেষ ফোম প্যাডিংযুক্ত। নিচে রয়েছে অ্যান্টি-স্লিপ গ্রিপ।",
    specs: {
      "Dimensions / মাপ": "70 x 120 cm",
      "Thickness / পুরুত্ব": "12 mm Soft Orthopedic Foam",
      "Origin / উৎপত্তি": "Made in Turkey (ইস্তাম্বুল, তুরস্ক)",
      "Backing / নিচের অংশ": "Anti-slip Non-woven Grip"
    }
  },
  {
    id: "p7",
    title_en: "Musafir Special Islamic Gift Box",
    title_bn: "মুসাফির স্পেশাল ইসলামিক গিফট বক্স",
    slug: "musafir-islamic-gift-box",
    category: "gifts-hampers",
    category_en: "Gifts & Hampers",
    category_bn: "গিফট ও হ্যাম্পার",
    price: 1850,
    originalPrice: 2300,
    isPopular: false,
    rating: 5.0,
    reviewsCount: 42,
    stockQuantity: 15,
    inStock: true,
    image: "assets/images/product-giftbox.jpg",
    gallery: [
      "assets/images/product-giftbox.jpg",
      "assets/images/product-quran.jpg",
      "assets/images/product-attar.jpg"
    ],
    highlights_en: [
      "Includes Quran, Onyx Tasbih, Royal Attar & Prayer Mat",
      "Luxury Rigid Gift Box with Gold Foil Musafir Emblem",
      "Includes Handwritten Calligraphy Dua Greeting Card",
      "The Most Thoughtful Gift for Weddings, Eid & Hajj"
    ],
    highlights_bn: [
      "একই বক্সে কুরআন মাজীদ, অনিক্স তসবিহ, রয়্যাল আতর ও জায়নামাজ",
      "স্বর্ণালী ফয়েল লোগোযুক্ত আভিজাত্যময় রিজিড ম্যাগনেটিক বক্স",
      "সুন্দর ক্যালিগ্রাফি করা বিশেষ দোয়া কার্ড অন্তর্ভুক্ত",
      "বিয়ে, ঈদ, হজ-উমরাহ বা প্রিয়জনকে দেওয়ার সেরা মননশীল উপহার"
    ],
    shortDesc_en: "Exquisite curated gift set: Holy Quran, Onyx Tasbih, Royal Attar & Turkish Janamaz in gold box.",
    shortDesc_bn: "আভিজাত্যময় গোল্ডেন গিফট বক্সে বাঁধাই করা কুরআন মাজীদ, অনিক্স তসবিহ, সুগন্ধি আতর ও প্রিমিয়াম জায়নামাজ।",
    desc_en: "The ultimate spiritual gift for weddings, Eid celebrations, Hajj returns, or Ramadan. Packaged in an artisanal rigid box with gold-foil Musafir emblem and satin ribbon.",
    desc_bn: "বিয়ে, ঈদ, প্রিয়জনকে উপহার কিংবা হজ-উমরাহ উপলক্ষ্যে দেওয়ার মতো সবচেয়ে মননশীল ও অর্থপূর্ণ ইসলামিক গিফট বক্স।",
    specs: {
      "Included Items / উপাদান": "Quran + Onyx Tasbih + 6ml Attar + Janamaz",
      "Packaging / বক্স": "Rigid Magnetic Box with Gold Foil Logo",
      "Greeting Card / কার্ড": "Custom Calligraphy Dua Card Included",
      "Weight / ওজন": "Approx. 1.8 KG"
    }
  },
  {
    id: "p8",
    title_en: "Mukhallat Royal Organic Attar (12ml)",
    title_bn: "খাঁটি মুখাল্লাত রয়্যাল আতর (১২ মি.লি.)",
    slug: "mukhallat-royal-attar",
    category: "accessories",
    category_en: "Accessories",
    category_bn: "এক্সেসরিজ ও সুগন্ধি",
    price: 550,
    originalPrice: 700,
    isPopular: false,
    rating: 4.8,
    reviewsCount: 31,
    stockQuantity: 30,
    inStock: true,
    image: "assets/images/product-attar.jpg",
    gallery: [
      "assets/images/product-attar.jpg"
    ],
    highlights_en: [
      "100% Pure Alcohol-Free Halal Certified Attar",
      "Rare Cambodian Agarwood, Amber & Taif Rose Notes",
      "Long-lasting 8 to 12 Hours Fragrance Projection",
      "Hand-Cut Faceted Crystal Bottle with Golden Glass Wand"
    ],
    highlights_bn: [
      "১০০% অ্যালকোহলমুক্ত হালাল সার্টিফায়েড খাঁটি আতর",
      "কম্বোডিয়ান আগরউড, হোয়াইট অ্যাম্বার ও তায়েফি গোলাপের সুবাস",
      "৮ থেকে ১২ ঘণ্টা পর্যন্ত কাপড়ে স্থায়ী মোহময় সুগন্ধ বজায় থাকে",
      "দৃষ্টিনন্দন ক্রিস্টাল গ্লাস বোতল ও গোল্ডেন ডিপার কাঠি"
    ],
    shortDesc_en: "Alcohol-free concentrated perfume oil with rich notes of pure Cambodian agarwood, amber, and Taif rose.",
    shortDesc_bn: "১০০% অ্যালকোহলমুক্ত খাঁটি উড, অ্যাম্বার ও তায়েফি গোলাপের সংমিশ্রণে তৈরি দীর্ঘস্থায়ী রাজকীয় আতর।",
    desc_en: "Pure concentrated oriental fragrance oil formulated for enduring projection and spiritual tranquility during Friday prayers and sacred occasions.",
    desc_bn: "জুমআ ও বিশেষ মাহফিলের জন্য এক অপূর্ব শান্তিময় সুবাস। কাপড়ে দাগ পড়ে না এবং ৮-১২ ঘণ্টা পর্যন্ত সুবাস বজায় থাকে।",
    specs: {
      "Volume / পরিমাণ": "12 ml Concentrated Perfume Oil",
      "Alcohol / অ্যালকোহল": "100% Alcohol-Free (হালাল সার্টিফায়েড)",
      "Notes / সুবাস": "Cambodian Oudh, White Amber, Damask Rose",
      "Bottle / বোতল": "Hand-cut Crystal Glass with Golden Wand"
    }
  }
];
