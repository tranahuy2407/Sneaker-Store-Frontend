import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import promotionAPI from "../../../api/promotion.api";
import { getImageUrl, getSrcSet } from "../../../helpers/imageSrcSet";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Slide = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await promotionAPI.getActive();
        if (res.data.status === "success") {
          setPromotions(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải khuyến mãi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-10 h-[500px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (promotions.length === 0) return null;

  return (
    <div className="container mx-auto py-10 relative">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold inline-block pb-4 relative">
          Các chương trình khuyến mãi
          <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-16 h-1 bg-blue-400 rounded"></span>
        </h2>
      </div>

      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={promotions.length > 1}
        className="w-full h-[500px] relative rounded-2xl overflow-hidden shadow-xl"
      >
        {promotions.map((item) => (
          <SwiperSlide key={item.id}>
            <div 
              className="relative w-full h-[500px] cursor-pointer group"
              onClick={() => navigate(`/khuyen-mai/${item.id}`)}
            >
              <img
                src={getImageUrl(item.image)}
                srcSet={getSrcSet(item.image)}
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt={item.name}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                <div className="ml-4 md:ml-16 text-white max-w-lg">
                  <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg leading-tight">
                    {item.name}
                  </h2>
                  <p className="mt-4 text-base md:text-xl drop-shadow-md line-clamp-3 opacity-90">
                    {item.description || "Khám phá ngay những ưu đãi hấp dẫn dành riêng cho bạn!"}
                  </p>
                  <button className="mt-8 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg uppercase tracking-wider">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div
          ref={prevRef}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg z-10 hover:bg-white/40 transition-all"
        >
          &#10094;
        </div>
        <div
          ref={nextRef}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg z-10 hover:bg-white/40 transition-all"
        >
          &#10095;
        </div>
      </Swiper>
    </div>
  );
};

export default Slide;
