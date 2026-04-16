import React, { useState, useRef, useEffect } from "react";
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

  // Load categories and brands on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoryAPI.getAll(),
          brandAPI.getAll()
        ]);
        setCategories(catRes.data.data || []);
        setBrands(brandRes.data.data || []);
      } catch (err) {
        console.error("Lỗi load data:", err);
      }
    };
    loadData();
  }, []);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Quick reply suggestions
  const quickReplies = [
    "Giày Nike",
    "Giày Adidas",
    "Giày size 42",
    "Giày đang giảm giá",
    "Giày chạy bộ",
    "Giày thể thao nam",
  ];

  // Search products from database
  const searchProducts = async (query) => {
    try {
      const params = { 
        search: query,
        limit: 6,
        page: 1
      };
      const res = await productAPI.getAll(params);
      return res.data.data?.products || [];
    } catch (err) {
      console.error("Lỗi tìm sản phẩm:", err);
      return [];
    }
  };

  // Get products by category
  const getProductsByCategory = async (slug) => {
    try {
      const res = await categoryAPI.getCategoryProducts(slug, { limit: 6 });
      return res.data.data?.products || [];
    } catch (err) {
      return [];
    }
  };

  // Get products by brand
  const getProductsByBrand = async (slug) => {
    try {
      const res = await brandAPI.getBrandProducts(slug, { limit: 6 });
      return res.data.data?.products || [];
    } catch (err) {
      return [];
    }
  };

  // Parse user intent and find matching products
  const parseAndSearch = async (msg) => {
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
  };

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
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-100"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      msg.type === "user" ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="whitespace-nowrap px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2.5 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim() || isTyping}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Gửi"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
              Powered by SneakerStore AI
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
