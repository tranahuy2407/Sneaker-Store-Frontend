import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHeart, FaFilter, FaTimes, FaSearch } from "react-icons/fa";
import { ChevronDown, Grid, List } from "lucide-react";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FilterModal from "./components/FilterModal";
import SkeletonCard from "@/components/SkeletonCard";
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
  
  // Filters state
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sort, setSort] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Favorites
  const [favorites, setFavorites] = useState(new Set());

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 20;

  // Load filters data
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [catsRes, brandsRes] = await Promise.all([
          categoryAPI.getAll(),
          brandAPI.getAll()
        ]);
        setCategories(catsRes.data?.data || []);
        setBrands(brandsRes.data?.data || []);
      } catch (error) {
        console.error("Error loading filters:", error);
      }
    };
    loadFilters();
  }, []);

  // Load products with filters
  useEffect(() => {
    fetchProducts();
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [page, sort, selectedCategories, selectedBrands, priceRange, isAuthenticated]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params = {
        page,
        limit,
        sort,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        categories: selectedCategories.join(","),
        brands: selectedBrands.join(",")
      };
      
      const res = await productAPI.getAll(params);
      const data = res.data?.data || {};
      
      // Calculate discount for each product
      const productsWithDiscount = (data.data || []).map((p) => {
        const price = p.price || 0;
        const discountPrice = p.discountPrice || p.price || 0;
        const discount = discountPrice < price ? Math.round(((price - discountPrice) / price) * 100) : 0;
        return { ...p, price, discountPrice, discount };
      });
      
      setProducts(productsWithDiscount);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await favoriteAPI.getAll();
      let favs = res.data?.data || res.data || [];
      if (Array.isArray(favs)) {
        setFavorites(new Set(favs.map(f => f.product_id || f.productId || f.id)));
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
      console.error("Error toggling favorite:", error);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
    setSearchParams({ page: "1" });
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrands(prev => 
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
    setSearchParams({ page: "1" });
  };

  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({ ...prev, [type]: value }));
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: "", max: "" });
    setSearchQuery("");
    setSort("");
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
    selectedBrands.length > 0 || 
    priceRange.min || 
    priceRange.max;

  const activeFiltersCount = selectedCategories.length + 
    selectedBrands.length + 
    (priceRange.min ? 1 : 0) + 
    (priceRange.max ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onHeightChange={setHeaderHeight} />
      <Navbar onHeightChange={setNavbarHeight} />
      
      <main 
        className="container mx-auto px-4 py-6"
        style={{ 
          marginTop: 0 
        }}
      >
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tất cả sản phẩm" }]} />
        
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Tất cả sản phẩm</h1>
          <p className="text-gray-600 mt-1">{total} sản phẩm có sẵn</p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-end">
            {/* All Controls - RIGHT */}
            <div className="flex items-center gap-3 flex-wrap justify-end">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters ? 'bg-blue-50 border-blue-300 text-blue-600' : 'bg-white border-gray-300'
                }`}
              >
                <FaFilter />
                <span>Bộ lọc</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sắp xếp mặc định</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
                <option value="newest">Mới nhất</option>
                <option value="popular">Bán chạy</option>
              </select>

              {/* View Mode */}
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>

              {priceRange.min && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  Giá từ: {parseInt(priceRange.min).toLocaleString()}₫
                  <button onClick={() => handlePriceChange("min", "")} className="hover:text-blue-900">
                    <FaTimes size={12} />
                  </button>
                </span>
              )}

              {priceRange.max && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  Giá đến: {parseInt(priceRange.max).toLocaleString()}₫
                  <button onClick={() => handlePriceChange("max", "")} className="hover:text-blue-900">
                    <FaTimes size={12} />
                  </button>
                </span>
              )}

              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 underline"
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="flex-1">
            {loading ? (
              <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
                <SkeletonCard count={8} />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
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

                {/* Pagination */}
                {total > limit && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      currentPage={page}
                      totalPages={Math.ceil(total / limit)}
                      onPageChange={(newPage) => setSearchParams({ page: newPage.toString() })}
                    />
                  </div>
                )}
              </>
            )}
          </div>

        {/* Filter Modal Component */}
        <FilterModal
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          categories={categories}
          brands={brands}
          selectedCategories={selectedCategories}
          selectedBrands={selectedBrands}
          priceRange={priceRange}
          activeFiltersCount={activeFiltersCount}
          onCategoryChange={handleCategoryChange}
          onBrandChange={handleBrandChange}
          onPriceChange={handlePriceChange}
          onClearFilters={clearFilters}
        />

        {/* CSS Animation */}
        <style>{`
          @keyframes slide-left {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(0);
            }
          }
          .animate-slide-left {
            animation: slide-left 0.3s ease-out;
          }
        `}</style>
      </main>
      
      <Footer />
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, viewMode, isFavorite, onFavoriteToggle }) => {
  const imgSrc = product.images?.length > 0 
    ? product.images.find(img => img.isDefault)?.url || product.images[0]?.url 
    : defaultImage;

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 flex gap-4 group hover:shadow-md transition-shadow">
        <div className="relative w-48 h-48 flex-shrink-0">
          <Link to={`/san-pham/${product.slug}`} onClick={() => recentlyViewedAPI.add(product.id)}>
            <img
              src={getImageUrl(imgSrc)}
              srcSet={getSrcSet(imgSrc)}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </Link>
          {product.discount > 0 && (
            <span className="absolute left-2 top-2 px-2 py-1 text-xs text-white bg-red-600 rounded-full">
              -{product.discount}%
            </span>
          )}
          <button
            onClick={onFavoriteToggle}
            className={`absolute right-2 top-2 p-2 bg-white rounded-full shadow-md transition-colors ${
              isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <FaHeart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="flex-1 py-2">
          <Link 
            to={`/san-pham/${product.slug}`}
            onClick={() => recentlyViewedAPI.add(product.id)}
            className="font-semibold text-lg text-gray-800 hover:text-blue-600 transition-colors line-clamp-2"
          >
            {product.name}
          </Link>
          <p className="text-sm text-gray-500 mt-1">{product.category?.name}</p>
          <p className="text-sm text-gray-500">{product.brand?.name}</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xl font-bold text-red-600">
              {product.discountPrice.toLocaleString()}₫
            </span>
            {product.price > product.discountPrice && (
              <span className="text-gray-400 line-through">
                {product.price.toLocaleString()}₫
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative aspect-square">
        <Link to={`/san-pham/${product.slug}`} onClick={() => recentlyViewedAPI.add(product.id)}>
          <img
            src={getImageUrl(imgSrc)}
            srcSet={getSrcSet(imgSrc)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </Link>
        {product.discount > 0 && (
          <span className="absolute left-2 top-2 px-2 py-1 text-xs text-white bg-red-600 rounded-full">
            -{product.discount}%
          </span>
        )}
        <button
          onClick={onFavoriteToggle}
          className={`absolute right-2 top-2 p-2 bg-white rounded-full shadow-md transition-colors ${
            isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <FaHeart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-3">
        <Link 
          to={`/san-pham/${product.slug}`}
          onClick={() => recentlyViewedAPI.add(product.id)}
          className="font-medium text-sm text-gray-800 hover:text-blue-600 transition-colors line-clamp-2"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-red-600">
            {product.discountPrice.toLocaleString()}₫
          </span>
          {product.price > product.discountPrice && (
            <span className="text-xs text-gray-400 line-through">
              {product.price.toLocaleString()}₫
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
