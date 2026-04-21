import React, { useEffect, useState, useMemo } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Slide from "./components/Slide";
import Footer from "./components/Footer";
import ProductSlider from "./components/ProductSlider";
import BrandSection from "./components/BrandSection";
import Loading, { SkeletonBanner, SkeletonCard } from "@/components/Loading";
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
          
          // Tính discount cho cả trường hợp có hoặc không tìm thấy fullProduct
          const productData = fullProduct || p;
          const price = Number(productData.price) || 0;
          const discountPrice = Number(productData.discountPrice) || price;
          const discount = price > 0 && discountPrice < price ? Math.round(((price - discountPrice) / price) * 100) : 0;

          return { 
            ...productData, 
            price, 
            discountPrice, 
            discount,
            sizes: productData.sizes || []
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
        <div className="space-y-10 px-4 py-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="max-w-7xl mx-auto">
              <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-6 animate-pulse"></div>
              <SkeletonBanner className="mb-8" />
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                <SkeletonCard count={5} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        homeSections.map((section, index) => (
          <BrandSection
            key={section.id}
            title={section.title}
            slug={section.slug}
            banner={section.banner_url}
            products={getSectionProducts(section)}
            isLoading={false}
          />
        ))
      )}
      <Footer />
    </div>
  );
}