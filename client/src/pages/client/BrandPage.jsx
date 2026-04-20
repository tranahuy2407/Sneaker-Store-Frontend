import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import brandAPI from "@/api/brand.api";
import favoriteAPI from "@/api/favorite.api";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import QuickViewPopup from "./components/QuickViewPopup";

import defaultImage from "@/assets/default.jpg";
import { getImageUrl, getSrcSet } from "@/helpers/imageSrcSet";
import { Home, Award } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import recentlyViewedAPI from "@/api/recentlyViewed.api";

const BrandPage = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useSelector((state) => state.userAuth);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  const [brandName, setBrandName] = useState("");

  const [sort, setSort] = useState("");

  useEffect(() => {
    fetchProducts();
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [slug, page, sort, isAuthenticated]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const query = { page, limit, sort };
      const res = await brandAPI.getBrandProducts(slug, query);

      const result = res.data?.data;
      const items = result?.data || [];

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

      setProducts(mapped);
      setTotal(result?.pagination?.total || items.length);

      // Fetch brand name if not already identified
      try {
        const brandRes = await brandAPI.getBySlug(slug);
        const name = brandRes.data?.data?.name;
        if (name) setBrandName(name);
      } catch (e) {
        console.error("Brand name fetch error:", e);
      }
    } catch (error) {
      console.error("Brand error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await favoriteAPI.getMyFavorites();
      const favs = res.data?.data || [];
      setFavorites(new Set(favs.map(f => f.product_id || f.productId)));
    } catch (err) {
      console.error("Lỗi tải yêu thích:", err);
    }
  };

  const handleFavorite = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích!");
      return;
    }
    try {
      await favoriteAPI.toggle(productId);
      setFavorites(prev => {
        const newFavs = new Set(prev);
        if (newFavs.has(productId)) {
          newFavs.delete(productId);
        } else {
          newFavs.add(productId);
        }
        return newFavs;
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật yêu thích:", error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Header onHeightChange={setHeaderHeight} />
      <Navbar onHeightChange={setNavbarHeight} />
      <div className="container px-5 mx-auto mt-4 mb-4">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/", icon: <Home className="w-4 h-4" /> },
            { label: "Thương hiệu", icon: <Award className="w-4 h-4" /> },
            { label: brandName },
          ]}
        />
      </div>
      <div className="container flex items-center justify-between px-5 mx-auto mt-2 mb-6">
        <h1 className="text-2xl font-bold text-blue-600 uppercase">
          {brandName}
        </h1>

        <div className="flex items-center gap-2">
          <span className="text-gray-700">Sắp xếp:</span>

          <select
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Mặc định</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="name_asc">Tên A → Z</option>
            <option value="name_desc">Tên Z → A</option>
          </select>
        </div>
      </div>
      <div className="container px-5 py-6 mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-500">Chưa có sản phẩm nào cho thương hiệu này.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((p) => (
              <div
                key={p.id}
                className="relative p-3 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-xl hover:-translate-y-1 group"
              >
                {p.discount > 0 && (
                  <div className="absolute z-20 px-2 py-1 text-sm font-bold text-white bg-red-600 rounded-md shadow top-3 right-3">
                    -{p.discount}%
                  </div>
                )}

                {/* Nút yêu thích - luôn hiển thị trên mobile, hover trên desktop */}
                <button
                  onClick={(e) => handleFavorite(e, p.id)}
                  className={`absolute left-2 top-2 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 lg:opacity-0 lg:group-hover:opacity-100 ${favorites.has(p.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  title="Thêm vào yêu thích"
                >
                  <FaHeart size={16} fill={favorites.has(p.id) ? "currentColor" : "none"} />
                </button>

                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={getImageUrl(p.img)}
                    srcSet={getSrcSet(p.img)}
                    alt={p.name}
                    className="object-cover w-full transition-all rounded-lg aspect-square group-hover:scale-105 group-hover:brightness-90"
                  />

                  {/* Hover buttons - responsive */}
                  <div className="absolute inset-0 z-30 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 transition-all translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 p-2">
                    <Link
                      to={`/san-pham/${p.slug}`}
                      onClick={() => recentlyViewedAPI.add(p.id)}
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-gray-800 bg-white rounded-lg shadow hover:bg-gray-100 text-center whitespace-nowrap"
                    >
                      Tùy chọn
                    </Link>
                    <button
                      onClick={() => setQuickViewProduct(p)}
                      className="w-full sm:w-auto px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 whitespace-nowrap"
                    >
                      Xem nhanh
                    </button>
                  </div>
                </div>

                <h2 className="mt-3 text-sm font-semibold sm:text-base line-clamp-2 min-h-[40px]">
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
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  page === i + 1
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {quickViewProduct && (
        <QuickViewPopup
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
};

export default BrandPage;
