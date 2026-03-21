import React, { useState, useEffect } from "react";
import { ShoppingCart, ChevronUp, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import storeInfoAPI from "../../../api/storeInfo.api";
import zaloImg from '../../../assets/zalo.jpg'
export default function FloatingActions() {
  const navigate = useNavigate();
  const [showScroll, setShowScroll] = useState(false);
  const [storeInfo, setStoreInfo] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);

    const fetchStoreInfo = async () => {
      try {
        const res = await storeInfoAPI.get();
        if (res.data.data) {
          console.log("FAB Store Info:", res.data.data);
          setStoreInfo(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin cửa hàng cho FAB:", err);
      }
    };
    fetchStoreInfo();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const zaloPhone = storeInfo?.phone?.replace(/\s+/g, "") || "";
  const zaloLink = zaloPhone ? `https://zalo.me/${zaloPhone}` : "#";

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3 group">
      {/* Zalo Button */}
      <div className="relative group/zalo">
          {/* Pulsing ring */}
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-25 group-hover/zalo:hidden"></div>
          
          <a
            href={zaloLink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            title="Chat qua Zalo"
          >
            <img 
              src={zaloImg}
              alt="Zalo" 
              className="w-10 h-10 object-contain hover:scale-110 transition-transform"
            />
          </a>
        </div>

      {/* Support / Assistant Button */}
      <button
        onClick={() => navigate("/lien-he")}
        className="flex items-center justify-center w-14 h-14 bg-[#FF7E5F] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        title="Tư vấn khách hàng"
      >
        <img 
            src="https://res.cloudinary.com/dye69vmsy/image/upload/v1711010000/support-agent-icon.png" 
            alt="Support" 
            className="w-10 h-10 object-contain rounded-full border-2 border-white/50"
            onError={(e) => {
                e.target.src = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";
            }}
        />
      </button>

      {/* Cart Button */}
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center justify-center w-14 h-14 bg-blue-100 text-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        title="Giỏ hàng"
      >
        <ShoppingCart size={24} />
      </button>

      {/* Scroll Top Button */}
      <button
        onClick={scrollToTop}
        className={`flex items-center justify-center w-14 h-14 bg-[#FF7E5F]/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
          showScroll ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        title="Lên đầu trang"
      >
        <ChevronUp size={28} />
      </button>

      <style>
        {`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 3s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
}
