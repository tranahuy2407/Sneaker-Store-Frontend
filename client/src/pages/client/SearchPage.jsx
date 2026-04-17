import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import productAPI from "@/api/product.api";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Home, Search, SlidersHorizontal, X } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import QuickViewPopup from "./components/QuickViewPopup";
import defaultImage from "@/assets/default.jpg";
import { getImageUrl, getSrcSet } from "@/helpers/imageSrcSet";
import FilterSidebar from "./components/FilterSidebar";
import CustomTooltip from "@/components/CustomTooltip";
import recentlyViewedAPI from "@/api/recentlyViewed.api";

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const [products, setProducts] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [brandList, setBrands] = useState([]);
  const [categoryList, setCategories] = useState([]);
  const [openFilter, setOpenFilter] = useState(false); 
  const [openDesktopFilter, setOpenDesktopFilter] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  useEffect(() => {
    if (query.trim()) fetchData();
  }, [query, params]);

  async function fetchData() {
    try {
      const minPriceParam = params.get("minPrice");
      const maxPriceParam = params.get("maxPrice");

      const res = await productAPI.getAll({
        page: Number(params.get("page")) || 1,
        limit: Number(params.get("limit")) || 20,
        search: query,
        minPrice: minPriceParam ? Number(minPriceParam) : null,
        maxPrice: maxPriceParam ? Number(maxPriceParam) : null,
        brandId: params.get("brandId") || "",
        categoryId: params.get("categoryId") || "",
        status: "Active",
        sort: params.get("sort") || "",
      });

      const items = res.data?.data?.items || [];

      const mapped = items
        .filter((p) => p.status === "Active")
        .map((p) => {
          const price = Number(p.price) || 0;
          const discountPrice = Number(p.discountPrice) || price;
          const discount =
            price > 0 && discountPrice < price
              ? Math.round(((price - discountPrice) / price) * 100)
              : 0;

          return {
            ...p,
            img:
              p.images?.find((i) => i.isDefault)?.url ||
              p.images?.[0]?.url ||
              defaultImage,
            price,
            discountPrice,
            discount,
          };
        });

      // Brands
      const brandList = Array.from(
        new Map(
          items.filter((p) => p.brand).map((p) => [p.brand.id, p.brand])
        ).values()
      );

      // Categories
      const categoryList = Array.from(
        new Map(
          items
            .flatMap((p) => p.categories || [])
            .map((c) => [c.id, c])
        ).values()
      );

      setProducts(mapped);
      setBrands(brandList);
      setCategories(categoryList);
    } catch (error) {
      console.error("Search error:", error);
    }
  }

  return (
    <>
      <Header onHeightChange={setHeaderHeight} />
      <Navbar onHeightChange={setNavbarHeight} />

      {/* DESKTOP FILTER BUTTON */}
      <CustomTooltip
        text="Mở bộ lọc"
        className="fixed z-40 left-4 top-[40%] hidden lg:block"
      >
        <button
          onClick={() => setOpenDesktopFilter(true)}
          className="fixed z-40 hidden px-4 py-3 text-white transition bg-blue-600 shadow-lg lg:flex top-[40%] right-4 rounded-xl hover:bg-blue-700"
        >
          <SlidersHorizontal size={22} />
        </button>
      </CustomTooltip>

      {/* DESKTOP SIDEBAR */}
      <div
        className={`
          hidden lg:block fixed top-0 right-0 h-full 
          w-[560px]                  
          bg-white shadow-2xl 
          transition-transform duration-300 z-50
          ${openDesktopFilter ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold">Bộ lọc sản phẩm</h3>
          <button onClick={() => setOpenDesktopFilter(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
          <FilterSidebar
            brands={brandList}
            categories={categoryList}
            onClose={() => setOpenDesktopFilter(false)}
          />
        </div>
      </div>


      {/* PAGE CONTENT */}
      <div className="container px-5 py-6 mx-auto sm:px-6 lg:px-8">
        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpenFilter(true)}
          className="flex items-center gap-2 px-4 py-2 mb-4 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow lg:hidden hover:bg-blue-700"
        >
          <SlidersHorizontal size={18} /> Bộ lọc
        </button>

        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/", icon: <Home size={14} /> },
            { label: "Tìm kiếm", icon: <Search size={14} /> },
          ]}
          className="mb-4"
        />

        <h1 className="mb-4 text-2xl font-bold">
          Kết quả tìm kiếm cho:{" "}
          <span className="text-blue-600">{query}</span>
        </h1>

        {/* PRODUCT LIST */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="relative p-3 transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-xl hover:-translate-y-1 group"
            >
              {p.discount > 0 && (
                <div className="absolute px-2 py-1 text-sm font-bold text-white bg-red-600 rounded-md shadow top-3 right-3">
                  -{p.discount}%
                </div>
              )}

              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={getImageUrl(p.img)}
                  srcSet={getSrcSet(p.img)}
                  alt={p.name}
                  className="object-cover w-full transition-all rounded-lg aspect-square group-hover:scale-105 group-hover:brightness-90"
                />

                <div className="absolute inset-0 flex items-center justify-center gap-3 transition opacity-0 group-hover:opacity-100">
                  <Link
                    to={`/san-pham/${p.slug}`}
                    onClick={() => recentlyViewedAPI.add(p.id)}
                    className="px-4 py-2 text-sm font-semibold text-gray-800 bg-white rounded-lg shadow text-center"
                  >
                    Tùy chọn
                  </Link>

                  <button
                    onClick={() => setQuickViewProduct(p)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow"
                  >
                    Xem nhanh
                  </button>
                </div>
              </div>

              <h2 className="mt-3 text-sm font-semibold line-clamp-2">
                {p.name}
              </h2>

              <div className="mt-1">
                <span className="text-base font-bold text-red-600">
                  {p.discountPrice.toLocaleString()}₫
                </span>
                {p.discount > 0 && (
                  <span className="ml-2 text-sm text-gray-400 line-through">
                    {p.price.toLocaleString()}₫
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
      {openFilter && (
      <div className="fixed inset-0 z-50 flex">
        <div
          className="
            bg-white shadow-2xl
            w-[100vw] max-w-[1200px]  
            h-screen
            flex flex-col
            overflow-x-hidden         
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between p-6 border-b shrink-0">
            <h3 className="text-xl font-semibold tracking-wide">
              Bộ lọc sản phẩm
            </h3>
            <button
              className="p-2 transition rounded-full hover:bg-gray-100"
              onClick={() => setOpenFilter(false)}
            >
              <X size={22} />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
            <FilterSidebar
              brands={brandList}
              categories={categoryList}
              onClose={() => setOpenFilter(false)}
            />
          </div>
        </div>
        <div
          className="flex-1 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpenFilter(false)}
        ></div>

      </div>
    )}
    </>
  );
}
