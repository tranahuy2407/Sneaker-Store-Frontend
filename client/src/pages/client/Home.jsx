import React, { useEffect, useState, useMemo } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Slide from "./components/Slide";
import Footer from "./components/Footer";
import ProductSlider from "./components/ProductSlider";
import BrandSection from "./components/BrandSection";
import productAPI from "@/api/product.api";
import homeSectionAPI from "@/api/homeSection.api";

export default function Home() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const [homeSections, setHomeSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [sectionsRes, productRes] = await Promise.all([
          homeSectionAPI.getActive(),
          productAPI.getAll()
        ]);

        setHomeSections(sectionsRes.data.data || []);

        const productsWithDiscount = productRes.data.data.data.map((p) => {
          const price = p.price || 0;
          const discountPrice = p.discountPrice || p.price || 0;
          const discount = discountPrice < price ? Math.round(((price - discountPrice) / price) * 100) : 0;
          return { ...p, price, discountPrice, discount };
        });

        setAllProducts(productsWithDiscount);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSectionProducts = useMemo(() => {
    return (section) => {
      if (!allProducts.length) return []; // Chờ allProducts load xong

      if (section.products && section.products.length > 0) {
        return section.products.map(p => {
          const productId = p.product_id || p.id;
          // Tìm product đầy đủ từ allProducts
          const fullProduct = allProducts.find(ap => ap.id === productId);
          
          if (!fullProduct) {
            console.warn(`Product ${productId} not found in allProducts`);
            return p;
          }
          
          const price = fullProduct.price || p.price || 0;
          const discountPrice = fullProduct.discountPrice || p.discountPrice || fullProduct.price || p.price || 0;
          const discount = discountPrice < price ? Math.round(((price - discountPrice) / price) * 100) : 0;

          return { 
            ...fullProduct, 
            price, 
            discountPrice, 
            discount,
            sizes: fullProduct.sizes || []
          };
        }).filter(Boolean); // Loại bỏ undefined
      }

      if (section.section_type === "brand") {
        return allProducts.filter((p) => p.brand?.slug === section.slug);
      }

      if (section.section_type === "sale") {
        return allProducts.filter((p) => p.discount > 0);
      }

      if (section.section_type === "new_arrival") {
        return allProducts.slice(0, 10);
      }

      return [];
    };
  }, [allProducts]);

  return (
    <div className="min-h-screen text-gray-800 bg-gray-100">
      <Header onHeightChange={setHeaderHeight} />
      <Navbar onHeightChange={setNavbarHeight} />
      <ProductSlider />
      <Slide />
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        homeSections.map((section) => (
          <BrandSection
            key={section.id}
            title={section.title}
            slug={section.slug}
            banner={section.banner_url}
            products={getSectionProducts(section)}
          />
        ))
      )}
      <Footer />
    </div>
  );
}