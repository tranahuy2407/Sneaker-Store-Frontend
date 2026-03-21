import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartProvider";
import productAPI from "@/api/product.api";
import defaultImage from "../../../assets/default.jpg";
import CartPopup from "./CartPopup";
import QuickViewPopup from "./QuickViewPopup";
import recentlyViewedAPI from "../../../api/recentlyViewed.api";
import { getImageUrl, getSrcSet } from "../../../helpers/imageSrcSet";

const ProductSlider = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const {lastAdded, showCartPopup, setShowCartPopup } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [apiProducts, setApiProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productAPI.getAll();
        const data = res.data.data.data;

        const productsWithDiscount = data.map((p) => {
          const price = p.price || 0;
          const discountPrice = p.discountPrice || p.price || 0;
          const discount =
            p.discountPrice && p.discountPrice < p.price
              ? Math.round(((p.price - p.discountPrice) / p.price) * 100)
              : 0;

          return {
            ...p,
            price,
            discountPrice,
            discount,
            img:
              p.images?.length > 0
                ? p.images.find((i) => i.isDefault)?.url || p.images[0].url
                : defaultImage,
          };
        });

        setApiProducts(productsWithDiscount);
      } catch (error) {
        console.error("Load sản phẩm lỗi:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container relative py-10 mx-auto">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        pagination={{ clickable: true }}
        spaceBetween={20}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {apiProducts.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative overflow-hidden bg-white rounded-md shadow-md group">
              {item.discount > 0 && (
                <div className="absolute z-20 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full top-2 right-2">
                  -{item.discount}%
                </div>
              )}

              <img
                src={getImageUrl(item.img)}
                srcSet={getSrcSet(item.img)}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                alt={item.name}
                className="object-cover w-full h-64 transition duration-300 group-hover:brightness-75"
              />

              {/* Hover Buttons */}
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 transition-all duration-300 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
                <Link
                  to={`/san-pham/${item.slug}`}
                  onClick={() => recentlyViewedAPI.add(item.id)}
                  className="w-32 py-2 font-semibold text-center text-gray-800 bg-white border rounded-md shadow hover:bg-gray-100"
                >
                  Tùy chọn
                </Link>

                 <button
                    onClick={() => setQuickViewProduct(item)}
                    className="w-32 py-2 font-semibold text-white bg-blue-500 rounded-md shadow hover:bg-blue-600"
                  >
                    Xem nhanh
                  </button>
                </div>

              <div className="p-4 text-center">
                <h3 className="text-sm font-semibold md:text-base">{item.name}</h3>
                <div className="mt-2">
                  <span className="font-bold text-red-500">
                    {item.discountPrice.toLocaleString()}₫
                  </span>
                  {item.discount > 0 && (
                    <span className="ml-2 text-gray-400 line-through">
                      {item.price.toLocaleString()}₫
                    </span>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div ref={prevRef} className="absolute top-1/2 left-2 z-10 ...">&#10094;</div>
      <div ref={nextRef} className="absolute top-1/2 right-2 z-10 ...">&#10095;</div>

    {quickViewProduct && (
      <QuickViewPopup
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    )}

    {showCartPopup && lastAdded && <CartPopup />}
    </div>
  );
};

export default ProductSlider;
