import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHeart, FaFilter, FaSortAmountDown } from "react-icons/fa";
import { Grid, List, X, SlidersHorizontal, Tag, Filter, SortDesc, ChevronDown, Check } from "lucide-react";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SortModal from "./components/SortModal";
import FilterSidebar from "./components/FilterSidebar";
import { SkeletonCard } from "@/components/Loading";
import Pagination from "@/components/Pagination";

import productAPI from "@/api/product.api";
import categoryAPI from "@/api/category.api";
import brandAPI from "@/api/brand.api";
import favoriteAPI from "@/api/favorite.api";
import { getImageUrl, getSrcSet } from "@/helpers/imageSrcSet";
import defaultImage from "@/assets/default.jpg";
import Breadcrumb from "@/components/Breadcrumb";
import recentlyViewedAPI from "@/api/recentlyViewed.api";

const AllProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useSelector((state) => state.userAuth);

  const [headerHeight, setHeaderHeight] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);

  // Products state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Filter Data
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // UI State
  const [viewMode, setViewMode] = useState("grid");
  const [showSortModal, setShowSortModal] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'category', 'brand', 'price'

  // Ref for click outside
  const dropdownRef = useRef(null);

  // Favorites
  const [favorites, setFavorites] = useState(new Set());

  // URL Params
  const page = parseInt(searchParams.get("page")) || 1;
  const sort = searchParams.get("sort") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const categoryIdParam = searchParams.get("categoryIds") || "";
  const brandIdParam = searchParams.get("brandIds") || "";
  const limit = 20;

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set overflow hidden on body when mobile filter is open
  useEffect(() => {
    if (showMobileFilter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showMobileFilter]);

  // Load filter data (one-time)
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [catsRes, brandsRes] = await Promise.all([
          categoryAPI.getAll(),
          brandAPI.getAll(),
        ]);
        setCategories(catsRes.data?.data || []);
        setBrands(brandsRes.data?.data || []);
      } catch (error) {
        console.error("Error loading filters:", error);
      }
    };
    loadFilters();
  }, []);

  // Sync state and fetch products
  useEffect(() => {
    fetchProducts();
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [searchParams, isAuthenticated]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Build params object from URL searchParams
      const params = {
        page: parseInt(searchParams.get("page")) || 1,
        limit: 20,
      };

      const sortVal = searchParams.get("sort");
      if (sortVal) params.sort = sortVal;

      const minPrice = searchParams.get("minPrice");
      if (minPrice) params.minPrice = minPrice;

      const maxPrice = searchParams.get("maxPrice");
      if (maxPrice) params.maxPrice = maxPrice;

      const categoryIds = searchParams.get("categoryIds");
      if (categoryIds) params.categoryId = categoryIds;

      const brandIds = searchParams.get("brandIds");
      if (brandIds) params.brandId = brandIds;

      const res = await productAPI.getAll(params);

      // Structure: res.data = { status: "success", data: { data: [...], pagination: {...} } }
      const resData = res.data?.data || res.data || {};
      
      let productList = [];
      if (Array.isArray(resData.data)) {
        productList = resData.data;
      } else if (Array.isArray(resData.items)) {
        productList = resData.items;
      } else if (Array.isArray(resData.rows)) {
        productList = resData.rows;
      } else if (Array.isArray(resData)) {
        productList = resData;
      }
      
      const productsWithDiscount = productList.map((p) => {
        const price = Number(p.price) || 0;
        const discountPrice = Number(p.discountPrice) || price;
        const discount =
          price > 0 && discountPrice < price ? Math.round(((price - discountPrice) / price) * 100) : 0;
        return { ...p, price, discountPrice, discount };
      });

      setProducts(productsWithDiscount);
      setTotal(resData.pagination?.total ?? productsWithDiscount.length);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await favoriteAPI.getAll();
      let favs = res.data?.data || res.data || [];
      if (Array.isArray(favs)) {
        setFavorites(new Set(favs.map((f) => f.product_id || f.productId || f.id)));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const handleFavorite = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await favoriteAPI.toggle(productId);
      setFavorites((prev) => {
        const newFavs = new Set(prev);
        if (newFavs.has(productId)) newFavs.delete(productId);
        else newFavs.add(productId);
        return newFavs;
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const updateParam = (key, value) => {
    setSearchParams((prev) => {
       const next = new URLSearchParams(prev);
       if (value) next.set(key, value);
       else next.delete(key);
       next.set("page", "1");
       return next;
    });
    setActiveDropdown(null);
  };

  const toggleMultiParam = (key, value) => {
    setSearchParams((prev) => {
       const next = new URLSearchParams(prev);
       const currentValues = next.get(key) ? next.get(key).split(",") : [];
       const val = String(value);
       
       let newValues;
       if (currentValues.includes(val)) {
         newValues = currentValues.filter((v) => v !== val);
       } else {
         newValues = [...currentValues, val];
       }

       if (newValues.length > 0) next.set(key, newValues.join(","));
       else next.delete(key);
       
       next.set("page", "1");
       return next;
    });
  };

  const clearFilters = () => {
    setSearchParams({ page: "1" });
    setActiveDropdown(null);
    setShowMobileFilter(false);
  };

  const sortOptions = [
    { value: "", label: "Hàng mới về" },
    { value: "price_asc", label: "Giá thấp → cao" },
    { value: "price_desc", label: "Giá cao → thấp" },
    { value: "popular", label: "Bán chạy nhất" },
    { value: "discount", label: "Giảm giá nhiều nhất" },
  ];

  const pricePresets = [
    { label: "Dưới 1 triệu", min: "0", max: "1000000" },
    { label: "1 - 2 triệu", min: "1000000", max: "2000000" },
    { label: "2 - 5 triệu", min: "2000000", max: "5000000" },
    { label: "Trên 5 triệu", min: "5000000", max: "" },
  ];

  const currentSortObj = sortOptions.find((o) => o.value === sort) || sortOptions[0];

  const activeFiltersCount = 
    (categoryIdParam ? categoryIdParam.split(",").length : 0) + 
    (brandIdParam ? brandIdParam.split(",").length : 0) + 
    (minPrice || maxPrice ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onHeightChange={setHeaderHeight} />
      <Navbar onHeightChange={setNavbarHeight} />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tất cả sản phẩm" }]} />

        <div className="mt-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Tất cả sản phẩm</h1>
              <p className="text-gray-500 mt-2 flex items-center gap-2 text-lg">
                Tìm thấy <span className="text-orange-600 font-bold">{total}</span> sản phẩm 
              </p>
            </div>
          </div>

          {/* HORIZONTAL FILTER BAR */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-2 md:p-3 mb-8 sticky top-24 z-40 backdrop-blur-md bg-white/90">
             <div className="flex flex-wrap items-center gap-2" ref={dropdownRef}>
                
                {/* Mobile Filter Trigger Button */}
                <button 
                  onClick={() => setShowMobileFilter(true)}
                  className="flex lg:hidden flex-1 items-center justify-center gap-2 px-4 py-3 bg-gray-50 rounded-2xl text-sm font-bold text-gray-700"
                >
                  <Filter size={18} className="text-orange-500" />
                  Bộ lọc
                </button>

                {/* Desktop Dropdowns */}
                <div className="hidden lg:flex items-center gap-2">
                  <div className="text-sm font-bold text-gray-400 px-3 border-r mr-2">Lọc theo:</div>
                  
                  {/* Category Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === "category" ? null : "category")}
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${categoryIdParam ? "bg-orange-500 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
                    >
                      <Tag size={16} />
                      Danh mục
                      <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === "category" ? "rotate-180" : ""}`} />
                    </button>
                    {activeDropdown === "category" && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 z-50 animate-fadeIn slideInTop">
                         <div className="grid grid-cols-1 gap-1 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                           {categories.map(cat => {
                             const isSelected = categoryIdParam ? categoryIdParam.split(",").includes(String(cat.id)) : false;
                             return (
                               <button 
                                 key={cat.id} 
                                 onClick={() => toggleMultiParam("categoryIds", cat.id)}
                                 className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${isSelected ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                               >
                                 {cat.name}
                                 {isSelected && <Check size={16} />}
                               </button>
                             );
                           })}
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Brand Dropdown */}
                  <div className="relative">
                    <button 
                       onClick={() => setActiveDropdown(activeDropdown === "brand" ? null : "brand")}
                       className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${brandIdParam ? "bg-orange-500 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
                    >
                      <SlidersHorizontal size={16} />
                      Thương hiệu
                      <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === "brand" ? "rotate-180" : ""}`} />
                    </button>
                    {activeDropdown === "brand" && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 z-50 animate-fadeIn slideInTop">
                         <div className="grid grid-cols-1 gap-1 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                           {brands.map(brand => {
                             const isSelected = brandIdParam ? brandIdParam.split(",").includes(String(brand.id)) : false;
                             return (
                               <button 
                                 key={brand.id} 
                                 onClick={() => toggleMultiParam("brandIds", brand.id)}
                                 className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all ${isSelected ? "bg-orange-50 text-orange-600 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                               >
                                 {brand.name}
                                 {isSelected && <Check size={16} />}
                               </button>
                             );
                           })}
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Price Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === "price" ? null : "price")}
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${(minPrice || maxPrice) ? "bg-orange-500 text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
                    >
                      <span className="text-lg">₫</span>
                      Khoảng giá
                      <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === "price" ? "rotate-180" : ""}`} />
                    </button>
                    {activeDropdown === "price" && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 z-50 animate-fadeIn slideInTop">
                         <div className="space-y-4">
                           <div className="grid grid-cols-1 gap-2">
                              {pricePresets.map(preset => (
                                <button 
                                  key={preset.label}
                                  onClick={() => {
                                    const p = new URLSearchParams(searchParams);
                                    if(preset.min) p.set("minPrice", preset.min); else p.delete("minPrice");
                                    if(preset.max) p.set("maxPrice", preset.max); else p.delete("maxPrice");
                                    p.set("page", "1");
                                    setSearchParams(p);
                                    setActiveDropdown(null);
                                  }}
                                  className="px-4 py-2.5 rounded-xl text-sm bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600 font-medium text-left transition-all"
                                >
                                  {preset.label}
                                </button>
                              ))}
                           </div>
                           <div className="pt-4 border-t border-gray-100">
                             <div className="flex gap-2 mb-4">
                               <input 
                                 type="number" placeholder="Từ" 
                                 className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                 onBlur={(e) => {
                                    const p = new URLSearchParams(searchParams);
                                    if(e.target.value) p.set("minPrice", e.target.value); else p.delete("minPrice");
                                    setSearchParams(p);
                                 }}
                                 defaultValue={minPrice}
                               />
                               <input 
                                 type="number" placeholder="Đến" 
                                 className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                                 onBlur={(e) => {
                                    const p = new URLSearchParams(searchParams);
                                    if(e.target.value) p.set("maxPrice", e.target.value); else p.delete("maxPrice");
                                    setSearchParams(p);
                                 }}
                                 defaultValue={maxPrice}
                               />
                             </div>
                             <button 
                                onClick={() => setActiveDropdown(null)}
                                className="w-full py-3 bg-orange-600 text-white rounded-xl text-sm font-bold hover:bg-orange-700"
                             >
                               Áp dụng
                             </button>
                           </div>
                         </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Spacer */}
                <div className="hidden lg:block flex-1" />

                {/* Sort & View Mode */}
                <div className="flex items-center gap-2 ml-auto">
                   <div className="hidden lg:block relative group">
                      <button className="flex items-center gap-3 px-5 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all">
                        <SortDesc size={18} className="text-orange-500" />
                        {currentSortObj.label}
                        <ChevronDown size={14} />
                      </button>
                      <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 p-2">
                        {sortOptions.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => updateParam("sort", opt.value)}
                            className={`w-full text-left px-5 py-3.5 rounded-xl text-sm transition-all ${sort === opt.value ? "bg-orange-600 text-white font-bold" : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                   </div>

                   {/* Mobile Sort Button */}
                   <button 
                      onClick={() => setShowSortModal(true)}
                      className="lg:hidden flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 rounded-2xl text-sm font-bold text-gray-700"
                    >
                      <SortDesc size={18} className="text-orange-500" />
                      Sắp xếp
                    </button>

                   <div className="flex border-2 border-gray-100 rounded-2xl bg-white overflow-hidden p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-xl transition-all ${viewMode === "grid" ? "bg-orange-600 text-white shadow-lg" : "text-gray-300 hover:text-gray-500"}`}
                      >
                        <Grid size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-xl transition-all ${viewMode === "list" ? "bg-orange-600 text-white shadow-lg" : "text-gray-300 hover:text-gray-500"}`}
                      >
                        <List size={20} />
                      </button>
                    </div>
                </div>
             </div>
          </div>

          {/* ACTIVE FILTER TAGS */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 animate-fadeIn">
              <span className="text-sm font-bold text-gray-400 self-center mr-2">Đang áp dụng:</span>
              {categoryIdParam && categoryIdParam.split(",").map(id => {
                const cat = categories.find(c => String(c.id) === id);
                return cat && (
                  <span key={id} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-full text-xs font-bold shadow-md shadow-orange-200">
                    {cat.name}
                    <button onClick={() => toggleMultiParam("categoryIds", id)} className="hover:scale-125 transition-transform">
                      <X size={14}/>
                    </button>
                  </span>
                );
              })}
              {brandIdParam && brandIdParam.split(",").map(id => {
                const brand = brands.find(b => String(b.id) === id);
                return brand && (
                  <span key={id} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-bold shadow-md shadow-gray-200">
                    {brand.name}
                    <button onClick={() => toggleMultiParam("brandIds", id)} className="hover:scale-125 transition-transform">
                      <X size={14}/>
                    </button>
                  </span>
                );
              })}
              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full text-xs font-bold shadow-md shadow-green-200">
                  {Number(minPrice || 0).toLocaleString()}₫ - {maxPrice ? `${Number(maxPrice).toLocaleString()}₫` : "∞"}
                  <button onClick={() => {
                    const p = new URLSearchParams(searchParams);
                    p.delete("minPrice"); p.delete("maxPrice");
                    setSearchParams(p);
                  }} className="hover:scale-125 transition-transform"><X size={14}/></button>
                </span>
              )}
              <button 
                 onClick={clearFilters}
                 className="px-4 py-2 text-xs font-black text-red-500 hover:bg-red-50 rounded-full transition-colors uppercase tracking-widest"
              >
                Xóa tất cả
              </button>
            </div>
          )}

          {/* PRODUCTS RENDER */}
          <div className="relative min-h-[600px]">
            {loading ? (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"}`}>
                <SkeletonCard count={10} />
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] shadow-2xl border border-gray-100">
                <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                  <Filter size={60} className="text-orange-500" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Chưa có sản phẩm nào!</h3>
                <p className="text-gray-500 text-center max-w-md mx-auto px-6">
                  Rất tiếc, chúng tôi không tìm thấy sản phẩm nào khớp với bộ lọc hiện tại của bạn. Thử thay đổi các tiêu chí lọc nhé.
                </p>
                <div className="flex gap-4 mt-10">
                  <button
                    onClick={clearFilters}
                    className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 hover:scale-105 transition-all shadow-xl shadow-orange-200"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-800 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                  >
                    Về trang chủ
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"}`}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      isFavorite={favorites.has(product.id)}
                      onFavoriteToggle={(e) => handleFavorite(e, product.id)}
                    />
                  ))}
                </div>

                {total > limit && (
                  <div className="mt-16 flex justify-center pb-20">
                    <Pagination
                      currentPage={page}
                      totalPages={Math.ceil(total / limit)}
                      onPageChange={(newPage) => {
                         const p = new URLSearchParams(searchParams);
                         p.set("page", newPage.toString());
                         setSearchParams(p);
                         window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* MOBILE FILTER DRAWER (Left side) */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" 
            onClick={() => setShowMobileFilter(false)} 
          />
          
          {/* Drawer Content */}
          <div className="relative bg-white w-[85%] max-w-[320px] h-full shadow-2xl animate-slideInLeft overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
               <FilterSidebar 
                 categories={categories} 
                 brands={brands} 
                 onClose={() => setShowMobileFilter(false)} 
               />
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
               <button 
                 onClick={clearFilters}
                 className="flex-1 py-4 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold text-gray-700"
               >
                 Xóa lọc
               </button>
               <button 
                 onClick={() => setShowMobileFilter(false)}
                 className="flex-1 py-4 bg-orange-600 rounded-2xl text-sm font-bold text-white shadow-lg shadow-orange-200"
               >
                 Xác nhận
               </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE SORT MODAL */}
      <SortModal
        isOpen={showSortModal}
        onClose={() => setShowSortModal(false)}
        currentSort={sort}
        options={sortOptions}
        onSortChange={(val) => updateParam("sort", val)}
      />

      <Footer />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FF7E5F; border-radius: 10px; }
        
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .animate-slideInLeft { animation: slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }

        .slideInTop { animation: slideInTop 0.3s ease-out forwards; }
        @keyframes slideInTop { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, viewMode, isFavorite, onFavoriteToggle }) => {
  const imgSrc =
    product.images?.length > 0
      ? product.images.find((img) => img.isDefault)?.url || product.images[0]?.url
      : defaultImage;

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex gap-8 hover:shadow-2xl hover:border-orange-100 transition-all group relative">
        <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50">
          <Link to={`/san-pham/${product.slug}`} onClick={() => recentlyViewedAPI.add(product.id)}>
            <img
              src={getImageUrl(imgSrc)}
              srcSet={getSrcSet(imgSrc)}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
            />
          </Link>
          {product.discount > 0 && (
            <span className="absolute left-3 top-3 px-3 py-1.5 text-xs text-white bg-red-500 rounded-xl font-black shadow-lg">
              -{product.discount}%
            </span>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-2 uppercase text-xs font-black text-orange-600 tracking-widest">{product.brand?.name}</div>
          <Link
            to={`/san-pham/${product.slug}`}
            onClick={() => recentlyViewedAPI.add(product.id)}
            className="font-black text-xl text-gray-900 hover:text-orange-500 transition-colors line-clamp-2 mb-4"
          >
            {product.name}
          </Link>
          <div className="flex items-baseline gap-4">
            <span className="text-2xl font-black text-orange-600">
                {product.discountPrice.toLocaleString()}₫
            </span>
            {product.price > product.discountPrice && (
              <span className="text-lg text-gray-400 line-through font-bold">
                {product.price.toLocaleString()}₫
              </span>
            )}
          </div>
          <button
            onClick={onFavoriteToggle}
            className={`absolute right-6 top-6 p-3 rounded-2xl shadow-lg transition-all duration-300 border-2 ${
              isFavorite 
                ? "bg-red-500 text-white border-red-500 scale-110 shadow-red-200" 
                : "bg-white text-gray-400 border-gray-200 hover:text-red-500 hover:border-red-300 hover:scale-110 hover:shadow-xl"
            }`}
            title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          >
            <FaHeart size={20} fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isFavorite ? 0 : 40} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl hover:border-orange-100 hover:-translate-y-2 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-gray-50 p-2">
        <Link to={`/san-pham/${product.slug}`} onClick={() => recentlyViewedAPI.add(product.id)}>
          <img
            src={getImageUrl(imgSrc)}
            srcSet={getSrcSet(imgSrc)}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        {product.discount > 0 && (
          <span className="absolute left-4 top-4 px-3 py-1.5 text-xs text-white bg-red-500 rounded-xl font-black shadow-lg z-10">
            -{product.discount}%
          </span>
        )}
        <button
          onClick={onFavoriteToggle}
          className={`absolute right-4 top-4 p-3 rounded-2xl shadow-lg transition-all duration-300 z-10 border-2 ${
            isFavorite 
              ? "bg-red-500 text-white border-red-500 scale-110 shadow-red-200" 
              : "bg-white text-gray-400 border-gray-200 hover:text-red-500 hover:border-red-300 hover:scale-110 hover:shadow-xl"
          }`}
          title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        >
          <FaHeart size={18} fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isFavorite ? 0 : 40} />
        </button>
      </div>
      <div className="p-6">
        <div className="mb-1 uppercase text-[10px] font-black text-orange-600 tracking-[0.2em]">{product.brand?.name || "Sneaker"}</div>
        <Link
          to={`/san-pham/${product.slug}`}
          onClick={() => recentlyViewedAPI.add(product.id)}
          className="font-bold text-base text-gray-900 hover:text-orange-500 transition-colors line-clamp-2 leading-tight mb-4 h-12"
        >
          {product.name}
        </Link>
        <div className="flex flex-col">
          <span className="font-black text-xl text-gray-900">
             {product.discountPrice.toLocaleString()}₫
          </span>
          {product.price > product.discountPrice && (
            <span className="text-xs text-gray-400 line-through font-bold mt-1">
              {product.price.toLocaleString()}₫
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;



