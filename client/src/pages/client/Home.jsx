import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Slide from "./components/Slide";
import Footer from "./components/Footer";
import ProductSlider from "./components/ProductSlider";
import BrandSection from "./components/BrandSection"; 
import productAPI from "@/api/product.api";

export default function Home() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [brandProducts, setBrandProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productAPI.getAll();

        const productsWithDiscount = res.data.data.data.map((p) => {
          const price = p.price || 0;
          const discountPrice = p.discountPrice || p.price || 0;

          const discount =
            discountPrice < price
              ? Math.round(((price - discountPrice) / price) * 100)
              : 0;

          return {
            ...p,
            price,
            discountPrice,
            discount
          };
        });

        setBrandProducts(productsWithDiscount);

      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen text-gray-800 bg-gray-100">
      <Header onHeightChange={setHeaderHeight} />
      <Navbar onHeightChange={setNavbarHeight} />

      <ProductSlider />
      <Slide />
      
      <BrandSection
        title="ONITSUKA TIGER"
        banner="https://upcontent.vn/wp-content/uploads/2024/07/banner-giay.jpg"
        products={brandProducts}
      />

      <BrandSection
        title="BIG SALE"
        banner="https://intphcm.com/data/upload/poster-giay-dep-mat.jpg"
        products={brandProducts}
      />

      <Footer />
    </div>
  );
}
  