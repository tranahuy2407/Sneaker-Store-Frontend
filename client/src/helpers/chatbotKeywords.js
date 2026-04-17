// Chatbot Keywords Configuration
// Tách riêng để dễ quản lý và mở rộng

// Thương hiệu giày - key: các tên gọi, value: slug
export const BRAND_KEYWORDS = {
  nike: ["nike", "ni-ke", "nỉ ke"],
  adidas: ["adidas", "a-di-das", "adi das"],
  puma: ["puma", "pu-ma"],
  vans: ["vans", "van", "văng", "giày vans"],
  converse: ["converse", "con vơ", "con-verse"],
  "new-balance": ["new balance", "new-balance", "newbalance", "nb"],
  reebok: ["reebok", "ri-bok"],
  asics: ["asics", "a-six"],
  fila: ["fila", "phi-la"],
  "on-running": ["on running", "on-running", "on"],
  hoka: ["hoka", "ho-ka"],
  saucony: ["saucony", "sau-co-ni"],
  mizuno: ["mizuno", "mi-zu-no"],
  "under-armour": ["under armour", "under-armour", "ua"],
  brooks: ["brooks", "brúc"],
  timberland: ["timberland", "tim-ber-land"],
  drmartens: ["dr martens", "dr-martens", "doc martens"],
  "the-north-face": ["the north face", "north face", "tnf"],
  "columbia": ["columbia", "co-lum-bia"],
};

// Danh mục sản phẩm - key: slug, value: các tên gọi
export const CATEGORY_KEYWORDS = {
  "giay-chay-bo": ["giày chạy bộ", "giày chạy", "running", "chạy bộ", "chạy"],
  "giay-the-thao": ["giày thể thao", "thể thao", "sneaker", "giày sneaker"],
  "giay-bong-ro": ["giày bóng rổ", "bóng rổ", "basketball", "giày bóng"],
  "giay-da-bong": ["giày đá bóng", "đá bóng", "football", "soccer", "giày bóng đá"],
  "giay-tay": ["giày tây", "giày công sở", "giày lười", "giày formal", "giày dress"],
  "giay-di-bo": ["giày đi bộ", "đi bộ", "walking", "walk"],
  "giay-tre-em": ["giày trẻ em", "trẻ em", "kids", "children", "giày bé", "giày em bé"],
  "giay-nam": ["giày nam", "nam", "men", "giày đàn ông", "giày boy"],
  "giay-nu": ["giày nữ", "nữ", "women", "giày con gái", "giày girl"],
  "giay-cao-got": ["giày cao gót", "cao gót", "high heels", "heels", "giày gót cao"],
  "giay-bup-be": ["giày búp bê", "búp bê", "flats", "ballet"],
  "dep-sandal": ["dép", "sandal", "dép sandal", "flip flop", "slides"],
  "giay-boot": ["boot", "giày boot", "giày cổ cao", "ankle boot", "chelsea boot"],
  "phu-kien": ["phụ kiện", "tất", "vớ", "dây giày", "lót giày", "insole"],
};

// Từ khóa cần loại bỏ khi tìm kiếm
export const STOP_WORDS = [
  "tìm", "giày", "cho", "tôi", "muốn", "cần", "mua", "có", "không",
  "giúp", "với", "nhé", "ạ", "xin", "hỏi", "về", "của", "là", "cái",
  "này", "kia", "đó", "đây", "bạn", "shop", "cửa hàng", "store",
  "ưu đãi", "khuyến mãi", "giảm giá", "sale", "sản phẩm", "hàng"
];

// Từ đồng nghĩa chung
export const SYNONYMS = {
  "giày": ["giày", "dép", "sandal", "boot"],
  "rẻ": ["rẻ", "giá tốt", "ưu đãi", "khuyến mãi", "giảm giá", "sale"],
  "mới": ["mới", "new", "hàng mới", "sản phẩm mới"],
  "hot": ["hot", "bán chạy", "best seller", "trending", "phổ biến"],
};

// Helper functions
export const findBrandSlug = (message) => {
  const lowerMsg = message.toLowerCase();
  for (const [slug, keywords] of Object.entries(BRAND_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMsg.includes(keyword.toLowerCase())) {
        return { slug, keyword: keywords[0] };
      }
    }
  }
  return null;
};

export const findCategorySlug = (message) => {
  const lowerMsg = message.toLowerCase();
  for (const [slug, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMsg.includes(keyword.toLowerCase())) {
        return { slug, keyword: keywords[0] };
      }
    }
  }
  return null;
};

export const cleanSearchTerms = (message) => {
  let cleaned = message.toLowerCase();
  // Remove stop words
  STOP_WORDS.forEach(word => {
    cleaned = cleaned.replace(new RegExp(word, 'g'), '');
  });
  return cleaned.trim().replace(/\s+/g, ' ');
};

// Kiểm tra tin nhắn có phải tìm giảm giá không
export const isDiscountQuery = (message) => {
  const lowerMsg = message.toLowerCase();
  const discountKeywords = [
    "giảm giá", "sale", "khuyến mãi", "ưu đãi", "giá tốt", 
    "discount", "promotion", "deal", "giá rẻ", "hạ giá"
  ];
  return discountKeywords.some(keyword => lowerMsg.includes(keyword));
};

// Tìm size trong tin nhắn (vd: "giày size 42", "size 40", "42")
export const findSize = (message) => {
  const lowerMsg = message.toLowerCase();
  // Patterns: "size 42", "sz 42", "cỡ 42", "số 42"
  const sizePatterns = [
    /(?:size|sz|cỡ|số)\s*(\d+(?:\.\d+)?)/i,
    /(\d+(?:\.\d+)?)\s*(?:size|sz|cỡ)/i,
  ];
  
  for (const pattern of sizePatterns) {
    const match = lowerMsg.match(pattern);
    if (match) {
      return match[1]; // Trả về số size
    }
  }
  return null;
};

export default {
  BRAND_KEYWORDS,
  CATEGORY_KEYWORDS,
  STOP_WORDS,
  SYNONYMS,
  findBrandSlug,
  findCategorySlug,
  cleanSearchTerms,
  isDiscountQuery,
  findSize
};
