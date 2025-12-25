import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    img: "https://i.imgur.com/6IUbKfK.jpeg",
    title: "Nike Air Jordan",
    desc: "Phong cách đỉnh cao, giá cực sốc!",
  },
  {
    id: 2,
    img: "https://i.imgur.com/fy5ZsCn.jpeg",
    title: "Adidas Yeezy",
    desc: "Sự thoải mái đến từ công nghệ mới.",
  },
  {
    id: 3,
    img: "https://i.imgur.com/OkpF0fC.jpeg",
    title: "Nike Air Force 1",
    desc: "Thiết kế đơn giản nhưng sang trọng.",
  },
];

const Slide = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="container mx-auto py-10 relative">
      {/* Tiêu đề slider */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold inline-block pb-4 relative">
          Các chương trình khuyến mãi
          <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-16 h-1 bg-blue-400 rounded"></span>
        </h2>
      </div>

      {/* Slider */}
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
        autoplay={{ delay: 3000 }}
        loop={true}
        className="w-full h-[500px] relative"
      >
        {slides.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative w-full h-[500px]">
              <img
                src={item.img}
                className="w-full h-full object-cover"
                alt={item.title}
              />

              <div className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white">
                <h2 className="text-2xl md:text-4xl font-bold drop-shadow">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm md:text-lg drop-shadow">{item.desc}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom navigation buttons */}
        <div
          ref={prevRef}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-blue-400 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg z-10 hover:bg-blue-500 transition"
        >
          &#10094;
        </div>
        <div
          ref={nextRef}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-blue-400 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg z-10 hover:bg-blue-500 transition"
        >
          &#10095;
        </div>
      </Swiper>
    </div>
  );
};

export default Slide;
