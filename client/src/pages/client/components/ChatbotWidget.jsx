import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { X, Send, Bot, ShoppingBag, Search, ExternalLink } from "lucide-react";
import { productAPI } from "../../../api/product.api";
import { categoryAPI } from "../../../api/category.api";
import { brandAPI } from "../../../api/brand.api";
import { useNavigate } from "react-router-dom";

const ChatbotWidget = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Xin chào! Tôi là trợ lý ảo của SneakerStore. Tôi có thể giúp bạn tìm sản phẩm, danh mục hoặc thương hiệu. Hãy thử nhập 'giày Nike', 'giày size 42' hoặc 'giày giảm giá'!",
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Chỉ load categories và brands khi chatbot mở lần đầu
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    if (isOpen && !dataLoaded) {
      const loadData = async () => {
        try {
          const [catRes, brandRes] = await Promise.all([
            categoryAPI.getAll({ limit: 100 }),
            brandAPI.getAll({ limit: 100 })
          ]);
          setCategories(catRes.data.data?.data || catRes.data.data || []);
          setBrands(brandRes.data.data?.data || brandRes.data.data || []);
          setDataLoaded(true);
        } catch (err) {
          // Silent fail - không cần load cũng vẫn dùng được
        }
      };
      loadData();
    }
  }, [isOpen, dataLoaded]);

  // Auto scroll to bottom - dùng useCallback
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when open - clear timeout on unmount
  useEffect(() => {
    let timeoutId;
    if (isOpen) {
      timeoutId = setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  // Quick reply suggestions - useMemo để không tạo lại mỗi render
  const quickReplies = useMemo(() => [
    "Giày Nike",
    "Giày Adidas",
    "Giày size 42",
    "Giày đang giảm giá",
    "Giày chạy bộ",
    "Giày thể thao nam",
  ], []);

  // Search products from database - dùng useCallback để cache function
  const searchProducts = useCallback(async (query) => {
    try {
      const params = { 
        keyword: query,
        limit: 6,
        page: 1
      };
      const res = await productAPI.getAll(params);
      const responseData = res.data.data || res.data;
      let products = responseData?.data || responseData?.products || responseData || [];
      if (!Array.isArray(products)) {
        products = [];
      }
      return products;
    } catch (err) {
      return [];
    }
  }, []);

  // Get products by category
  const getProductsByCategory = useCallback(async (slug) => {
    try {
      const res = await categoryAPI.getCategoryProducts(slug, { limit: 6 });
      const responseData = res.data.data || res.data;
      let products = responseData?.data || responseData?.products || responseData || [];
      if (!Array.isArray(products)) {
        products = [];
      }
      return products;
    } catch (err) {
      return [];
    }
  }, []);

  // Get products by brand
  const getProductsByBrand = useCallback(async (slug) => {
    try {
      const res = await brandAPI.getBrandProducts(slug, { limit: 6 });
      const responseData = res.data.data || res.data;
      let products = responseData?.data || responseData?.products || responseData || [];
      if (!Array.isArray(products)) {
        products = [];
      }
      return products;
    } catch (err) {
      return [];
    }
  }, []);

  // Parse user intent and find matching products
  const parseAndSearch = useCallback(async (msg) => {
    const lowerMsg = msg.toLowerCase();
    let foundProducts = [];
    let searchType = "";
    let matchedKeyword = "";

    // Check for brand mentions
    const brandKeywords = {
      "nike": "nike",
      "adidas": "adidas",
      "puma": "puma",
      "vans": "vans",
      "converse": "converse",
      "new balance": "new-balance",
      "reebok": "reebok",
      "asics": "asics",
    };

    for (const [keyword, slug] of Object.entries(brandKeywords)) {
      if (lowerMsg.includes(keyword)) {
        foundProducts = await getProductsByBrand(slug);
        
        // Nếu brand API trả về rỗng, thử fallback sang search tổng quát
        if (foundProducts.length === 0) {
          foundProducts = await searchProducts(keyword);
        }
        
        if (foundProducts.length > 0) {
          searchType = "brand";
          matchedKeyword = keyword.toUpperCase();
          break;
        }
      }
    }

    // Check for category mentions if no brand found
    if (foundProducts.length === 0) {
      const categoryKeywords = {
        "giày chạy bộ": "giay-chay-bo",
        "giày thể thao": "giay-the-thao",
        "giày bóng rổ": "giay-bong-ro",
        "giày đá bóng": "giay-da-bong",
        "giày tây": "giay-tay",
        "sneaker": "sneaker",
        "giày nam": "giay-nam",
        "giày nữ": "giay-nu",
        "giày trẻ em": "giay-tre-em",
      };

      for (const [keyword, slug] of Object.entries(categoryKeywords)) {
        if (lowerMsg.includes(keyword)) {
          foundProducts = await getProductsByCategory(slug);
          
          // Nếu category API trả về rỗng, thử fallback sang search tổng quát
          if (foundProducts.length === 0) {
            foundProducts = await searchProducts(keyword);
          }
          
          if (foundProducts.length > 0) {
            searchType = "category";
            matchedKeyword = keyword;
            break;
          }
        }
      }
    }

    // If no specific brand/category, do general search
    if (foundProducts.length === 0) {
      // Remove common words and search
      const searchTerms = lowerMsg
        .replace(/(tìm|giày|cho|tôi|muốn|cần|mua|có|không|giúp|với|nhé|ạ)/g, "")
        .trim();
      if (searchTerms) {
        foundProducts = await searchProducts(searchTerms || msg);
        searchType = "search";
        matchedKeyword = msg;
      }
    }

    return { products: foundProducts, type: searchType, keyword: matchedKeyword };
  }, [getProductsByBrand, getProductsByCategory, searchProducts]);

  // Handle send message
  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: Date.now(),
      type: "user",
      text: inputMessage,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Search for products based on user message
    const { products: foundProducts, type, keyword } = await parseAndSearch(inputMessage);

    setTimeout(() => {
      if (foundProducts.length > 0) {
        // Add bot message with products
        const botMsg = {
          id: Date.now() + 1,
          type: "bot",
          text: type === "brand" 
            ? `Tôi tìm thấy ${foundProducts.length} sản phẩm thương hiệu ${keyword}:`
            : type === "category"
            ? `Tôi tìm thấy ${foundProducts.length} sản phẩm trong danh mục "${keyword}":`
            : `Tôi tìm thấy ${foundProducts.length} sản phẩm phù hợp với "${keyword}":`,
          products: foundProducts,
          searchType: type,        // 'brand', 'category', or 'search'
          searchKeyword: keyword,   // Nike, giày chạy bộ, etc.
          time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        // No products found - use default response
        const botResponse = generateBotResponse(inputMessage);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "bot",
            text: botResponse,
            time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
      setIsTyping(false);
    }, 800);
  };

  // Simple response generator for non-product queries
  const generateBotResponse = (msg) => {
    const lowerMsg = msg.toLowerCase();
    
    if (lowerMsg.includes("size") || lowerMsg.includes("cỡ")) {
      return "Bạn muốn tìm giày size bao nhiêu? Hãy thử nhập 'giày Nike size 42' hoặc tên sản phẩm cụ thể nhé!";
    }
    if (lowerMsg.includes("giảm giá") || lowerMsg.includes("sale") || lowerMsg.includes("khuyến mãi")) {
      return "Hiện tại chúng tôi có nhiều sản phẩm đang giảm giá đến 50%. Bạn có thể xem tại mục 'Khuyến mãi' hoặc thử tìm 'giày giảm giá' nhé!";
    }
    if (lowerMsg.includes("đổi trả") || lowerMsg.includes("hoàn tiền")) {
      return "Chính sách đổi trả của chúng tôi: Đổi size trong 7 ngày, đổi sản phẩm lỗi trong 30 ngày. Sản phẩm phải còn nguyên tem và hộp.";
    }
    if (lowerMsg.includes("đơn hàng") || lowerMsg.includes("tracking") || lowerMsg.includes("theo dõi")) {
      return "Bạn có thể theo dõi đơn hàng bằng cách vào mục 'Theo dõi đơn hàng' hoặc đăng nhập vào tài khoản để xem lịch sử đơn hàng.";
    } 
    if (lowerMsg.includes("ship") || lowerMsg.includes("vận chuyển") || lowerMsg.includes("giao hàng")) {
      return "Thời gian giao hàng: 2-3 ngày đối với nội thành HCM/HN, 3-5 ngày đối với tỉnh thành khác. Free ship cho đơn từ 500k.";
    }
    if (lowerMsg.includes("thanh toán") || lowerMsg.includes("payment")) {
      return "Chúng tôi hỗ trợ thanh toán: COD (thanh toán khi nhận hàng), Chuyển khoản ngân hàng, Ví điện tử Momo, ZaloPay.";
    }
    if (lowerMsg.includes("chào") || lowerMsg.includes("hello")) {
      return "Chào bạn! Tôi có thể giúp bạn tìm sản phẩm theo thương hiệu (Nike, Adidas...), danh mục (giày chạy bộ, thể thao...) hoặc từ khóa. Hãy thử nhé!";
    }
    if (lowerMsg.includes("cảm ơn") || lowerMsg.includes("thank")) {
      return "Không có gì! Rất vui được giúp đỡ. Nếu cần tìm thêm sản phẩm, cứ hỏi tôi nhé!";
    }
    
    return `Tôi chưa tìm thấy sản phẩm phù hợp với "${msg}". Bạn thử tìm theo thương hiệu (Nike, Adidas, Puma...) hoặc danh mục (giày chạy bộ, thể thao...) nhé! Hoặc gọi hotline 0968456761 để được tư vấn.`;
  };

  // Navigate to product detail
  const handleProductClick = (slug) => {
    navigate(`/san-pham/${slug}`);
    onClose();
  };

  // Handle quick reply click
  const handleQuickReply = (text) => {
    setInputMessage(text);
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[1000] w-[90vw] sm:w-[380px] h-[500px] sm:h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.3s_ease]">
          {/* Header - Coral Theme */}
          <div className="bg-gradient-to-r from-[#FF7E5F] to-[#FF6B4A] text-white p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Tư vấn viên ảo</h3>
                <p className="text-xs text-white/90 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Đang trực tuyến
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90"
              aria-label="Đóng chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-orange-50/50 to-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {/* Text Message */}
                <div
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                      msg.type === "user"
                        ? "bg-gradient-to-br from-[#FF7E5F] to-[#FF6B4A] text-white rounded-br-none shadow-md"
                        : "bg-white text-gray-800 shadow-sm rounded-bl-none border border-orange-100/50"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-xs mt-1.5 block ${
                        msg.type === "user" ? "text-white/80" : "text-gray-400"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>

                {/* Product Cards */}
                {msg.products && msg.products.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 ml-0 mr-8">
                    {msg.products.slice(0, 4).map((product) => (
                      <div
                        key={product.id || product._id}
                        onClick={() => handleProductClick(product.slug)}
                        className="bg-white rounded-xl border border-orange-100 overflow-hidden cursor-pointer hover:shadow-lg hover:border-[#FF7E5F]/30 transition-all duration-300 group"
                      >
                        {/* Product Image */}
                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                          <img
                            src={product.thumbnail || product.images?.[0] || "https://via.placeholder.com/150?text=No+Image"}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {product.discountPercent > 0 && (
                            <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              -{product.discountPercent}%
                            </span>
                          )}
                        </div>
                        {/* Product Info */}
                        <div className="p-2">
                          <h4 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight min-h-[2rem]">
                            {product.name}
                          </h4>
                          <div className="flex items-center gap-1 mt-1">
                            {product.discountPrice ? (
                              <>
                                <span className="text-xs font-bold text-[#FF7E5F]">
                                  {formatPrice(product.discountPrice)}
                                </span>
                                <span className="text-[10px] text-gray-400 line-through">
                                  {formatPrice(product.price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs font-bold text-[#FF7E5F]">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* View All Button if more than 4 products */}
                {msg.products && msg.products.length > 4 && (
                  <div className="flex justify-start">
                    <button
                      onClick={() => {
                        // Navigate based on search type
                        if (msg.searchType === "brand") {
                          // Convert keyword to slug (NIKE -> nike)
                          const brandSlug = msg.searchKeyword.toLowerCase().replace(/\s+/g, "-");
                          navigate(`/thuong-hieu/${brandSlug}`);
                        } else if (msg.searchType === "category") {
                          // Convert keyword to slug (giày chạy bộ -> giay-chay-bo)
                          const categorySlug = msg.searchKeyword
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/\s+/g, "-");
                          navigate(`/danh-muc/${categorySlug}`);
                        } else {
                          // General search
                          navigate(`/search?q=${encodeURIComponent(msg.searchKeyword)}`);
                        }
                        onClose();
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#FF7E5F] text-[#FF7E5F] rounded-full text-xs font-medium hover:bg-[#FF7E5F] hover:text-white transition-all duration-200 shadow-sm"
                    >
                      <Search className="w-3.5 h-3.5" />
                      Xem tất cả {msg.products.length} sản phẩm
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3.5 rounded-2xl rounded-bl-none shadow-sm border border-orange-100/50">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-[#FF7E5F] rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-[#FF7E5F] rounded-full animate-bounce [animation-delay:0.15s]"></span>
                    <span className="w-2 h-2 bg-[#FF7E5F] rounded-full animate-bounce [animation-delay:0.3s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2.5 bg-white border-t border-orange-100/30">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="whitespace-nowrap px-3.5 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-xs text-[#FF6B4A] hover:bg-[#FF7E5F] hover:border-[#FF7E5F] hover:text-white transition-all duration-200 font-medium shadow-sm"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-orange-100/50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tìm sản phẩm, thương hiệu, danh mục..."
                className="flex-1 px-4 py-3 bg-orange-50/50 border border-orange-200 rounded-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7E5F]/50 focus:border-[#FF7E5F] focus:bg-white transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim() || isTyping}
                className="w-11 h-11 bg-gradient-to-br from-[#FF7E5F] to-[#FF6B4A] hover:from-[#FF6B4A] hover:to-[#FF5733] disabled:bg-gray-300 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                aria-label="Gửi"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2 flex items-center justify-center gap-1">
              <ShoppingBag className="w-3 h-3" />
              Tìm kiếm thông minh từ kho sản phẩm
            </p>
          </div>
        </div>
      )}

      {/* Slide up animation */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default ChatbotWidget;
