import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import recentlyViewedAPI from "../../../api/recentlyViewed.api";
import { useSelector } from "react-redux";
import MiniProductCard from "./MiniProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RecentlyViewedSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.userAuth);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const res = await recentlyViewedAPI.getAll({ limit: 12 });
        const data = res.data?.data?.data || res.data?.data || [];

        const formattedProducts = data.map((item) => {
          const p = item.product || item;
          if (!p || !p.id) return null;
          
          return {
            ...p,
            images: p.images || []
          };
        }).filter(p => p !== null);

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm đã xem gần đây:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, [isAuthenticated]);

  if (loading || products.length === 0) return null;

  return (
    <div className="w-full py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-tight text-gray-800">Sản phẩm bạn đã xem</h2>
        <div className="flex gap-2">
          <button
            ref={prevRef}
            className="p-2 rounded-full border border-gray-200 hover:bg-black hover:text-white transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            ref={nextRef}
            className="p-2 rounded-full border border-gray-200 hover:bg-black hover:text-white transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="relative group">
        <Swiper
          modules={[Navigation, Pagination]}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 1.5, spaceBetween: 15 },
            640: { slidesPerView: 2.2, spaceBetween: 20 },
            1024: { slidesPerView: 3.5, spaceBetween: 20 },
            1280: { slidesPerView: 4, spaceBetween: 20 },
            1536: { slidesPerView: 5, spaceBetween: 20 },
          }}
          className="!pb-12"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="h-full py-2">
                <MiniProductCard product={product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RecentlyViewedSlider;
