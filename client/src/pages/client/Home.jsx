import React, { useEffect, useState } from "react";
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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionsRes = await homeSectionAPI.getActive();
        setHomeSections(sectionsRes.data.data || []);
        const productRes = await productAPI.getAll();
        const productsWithDiscount = productRes.data.data.data.map((p) => {
          const price = p.price || 0;
          const discountPrice = p.discountPrice || p.price || 0;
          const discount = discountPrice < price ? Math.round(((price - discountPrice) / price) * 100) : 0;

          return { ...p, price, discountPrice, discount };
        });

        setAllProducts(productsWithDiscount);

      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", err);
      }
    };

    fetchData();
  }, []);

  /**
   * Lấy sản phẩm cho từng section: Ưu tiên sản phẩm được chọn thủ công (nếu có),
   * nếu không có thì lọc tự động theo loại section.
   */
  const getSectionProducts = (section) => {
    // Nếu section đã có danh sách sản phẩm được gán trực tiếp (từ Admin)
    if (section.products && section.products.length > 0) {
      // Lấy sản phẩm đầy đủ từ allProducts để có sizes và các thông tin khác
      return section.products.map(p => {
        const fullProduct = allProducts.find(ap => ap.id === p.id) || p;
        const price = fullProduct.price || 0;
        const discountPrice = fullProduct.discountPrice || fullProduct.price || 0;
        const discount = discountPrice < price ? Math.round(((price - discountPrice) / price) * 100) : 0;
        return { ...fullProduct, price, discountPrice, discount };
      });
    }

    // Nếu không có sản phẩm gán thủ công, lọc tự động theo type
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

  return (
    <div className="min-h-screen text-gray-800 bg-gray-100">
      <Header onHeightChange={setHeaderHeight} />
      <Navbar onHeightChange={setNavbarHeight} />

      <ProductSlider />
      <Slide />
      
      {homeSections.map((section) => (
        <BrandSection
          key={section.id}
          title={section.title}
          slug={section.slug}
          banner={section.banner_url}
          products={getSectionProducts(section)}
        />
      ))}

      <Footer />
    </div>
  );
}
  