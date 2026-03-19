import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productAPI from "../../api/product.api";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "./components/Footer";
import { useCart } from "../../context/CartProvider";
import WarningModalSize from "./components/WarningModalSize";
import {
  Heart,
  Star,
  ChevronRight,
  Home,
  Package,
  Folder,
  ShoppingCart,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import ReviewModal from "./components/ReviewModal";
import { useSelector } from "react-redux";
import WarningModal from "@/components/WarningModal";
import { useLocation } from "react-router-dom";
import reviewAPI from "../../api/review.api";
import favoriteAPI from "@/api/favorite.api";
import SuccessNotification from "@/components/SuccessNotification";
import WarningNotification from "@/components/WarningNotification";
import SimilarProduct from "./components/SimilarProduct";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [showWarning, setShowWarning] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); 
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.userAuth);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    total: 0,
    average: 0,
    counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [notif, setNotif] = useState({ show: false, type: "", message: "" });

  // Danh sách size chuẩn
  const sizes = [
    36.5, 37, 37.5, 38, 38.5, 39, 40, 40.5, 41, 41.5, 42, 42.5, 43, 43.5, 44,
    44.5, 45, 45.5, 46, 46.5,
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await productAPI.getBySlug(slug);
        setProduct(res.data.data);
      } catch (err) {
        console.error("Lỗi load sản phẩm", err);
      }
    };
    fetchData();
  }, [slug]);

  const fetchReviews = async (productId) => {
    try {
      const res = await reviewAPI.getReviewsByProduct(productId, { limit: 100 });
      const revs = res.data.data?.data || [];
      const total = res.data.data?.totalReviews || 0;
      const average = res.data.data?.averageRating || 0;
      setReviews(revs);

      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      revs.forEach(r => {
        counts[r.rating] = (counts[r.rating] || 0) + 1;
      });
      
      setReviewStats({
        total: total,
        average: Number(average).toFixed(1),
        counts
      });
    } catch (err) {
      console.error("Lỗi lấy danh sách đánh giá", err);
    }
  };

  useEffect(() => {
    if (product?.id) {
      fetchReviews(product.id);
      checkFavoriteStatus(product.id);
    }
  }, [product?.id]);

  const checkFavoriteStatus = async (productId) => {
    if (!isAuthenticated) return;
    try {
      const res = await favoriteAPI.check(productId);
      setIsFavorited(res.data?.isFavorited || false);
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái yêu thích:", error);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      setShowAuthWarning(true);
      return;
    }
    try {
      await favoriteAPI.toggle(product.id);
      setIsFavorited(!isFavorited);
      setNotif({ 
        show: true, 
        type: "success", 
        message: isFavorited ? "Đã xóa khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích" 
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật yêu thích:", error);
    }
  };

  if (!product)
    return <p className="py-10 text-center text-gray-500">Đang tải...</p>;

  const sizeMap = {};
  product.sizes?.forEach((s) => {
    sizeMap[String(s.size)] = s.stock;
  });

  const selectedStock =
    selectedSize !== null ? sizeMap[String(selectedSize)] : null;
  const isOutOfStock = selectedStock === 0;
  
  const selectedProductSize = product.sizes?.find(
    (s) => Number(s.size) === Number(selectedSize)
  );

  return (
    <>
      <Header onHeightChange={() => {}} />
      <Navbar onHeightChange={() => {}} />

      <Breadcrumb
        className="mx-6 my-4"
        items={[
          { label: "Trang chủ", href: "/", icon: <Home size={14} /> },
          {
            label: product.categories[0]?.name || "Danh mục",
            href: `/danh-muc/${product.categories[0]?.slug}`,
            icon: <Folder className="w-4 h-4" />,
          },
          { label: product.name, icon: <Package className="w-4 h-4" /> },
        ]}
      />

      <div className="w-full max-w-[1400px] mx-auto p-4 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* MAIN CONTENT (Images + Info + Tabs) - 9 Columns */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-8">
              {/* LEFT: IMAGES */}
              <div className="flex flex-col items-start lg:col-span-5">
                {/* Ảnh chính */}
                <div
                  className="relative overflow-hidden rounded-lg shadow-lg w-[400px] h-[400px]"
                  onMouseMove={(e) => {
                    const zoomImg = document.getElementById("zoom-image");
                    const rect = e.currentTarget.getBoundingClientRect();
                    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
                    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
                    zoomImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
                  }}
                  onMouseEnter={() => {
                    const zoomDiv = document.getElementById("zoom-div");
                    if (zoomDiv) zoomDiv.style.opacity = "1";
                    document.getElementById("zoom-image").style.transform =
                      "scale(2)";
                  }}
                  onMouseLeave={() => {
                    const zoomDiv = document.getElementById("zoom-div");
                    if (zoomDiv) zoomDiv.style.opacity = "0";
                    document.getElementById("zoom-image").style.transform =
                      "scale(1)";
                  }}
                >
                  <img
                    src={product.images?.[activeImage]?.url}
                    alt={product.name}
                    className="object-contain w-full h-full"
                  />
                  {/* ZOOM DIV - INSIDE FOR BETTER RESPONSIVENESS */}
                  <div
                    id="zoom-div"
                    className="absolute inset-0 z-50 pointer-events-none opacity-0 transition-opacity duration-300 hidden lg:block overflow-hidden bg-white"
                  >
                    <img
                      id="zoom-image"
                      src={product.images?.[activeImage]?.url}
                      alt={product.name}
                      className="absolute object-contain w-full h-full transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex flex-wrap justify-start w-full gap-3 mt-4">
                  {product.images?.map((img, index) => (
                    <img
                      key={img.id}
                      src={img.url}
                      alt={product.name}
                      className={`w-20 h-20 object-cover rounded-lg border cursor-pointer flex-shrink-0 transition-transform duration-200 ${
                        activeImage === index
                          ? "border-red-500 scale-105"
                          : "border-gray-300 hover:scale-105"
                      }`}
                      onClick={() => setActiveImage(index)}
                    />
                  ))}
                </div>
              </div>

              {/* MIDDLE: INFO */}
              <div className="flex flex-col lg:col-span-4 gap-6">
                <div>
                  <h1 className="mb-3 text-3xl font-bold">{product.name}</h1>
                  <p className="mb-2 text-gray-600">
                    Thương hiệu:{" "}
                    <span className="font-semibold">{product.brand?.name}</span>
                  </p>

                  {/* Giá */}
                  <div className="flex items-center gap-4 mb-4">
                    {product.discountPrice ? (
                      <>
                        <span className="text-3xl font-bold text-red-600">
                          {Number(product.discountPrice).toLocaleString()}₫
                        </span>
                        <span className="text-gray-400 line-through">
                          {Number(product.price).toLocaleString()}₫
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-black">
                        {Number(product.price).toLocaleString()}₫
                      </span>
                    )}
                  </div>

                  {/* SIZES */}
                  <div className="mb-6">
                    <label className="block mb-2 font-semibold">Chọn size:</label>
                    <div className="grid grid-cols-6 gap-2">
                      {sizes.map((size) => {
                        const exists = sizeMap[String(size)] !== undefined;
                        const stock = sizeMap[String(size)] || 0;
                        const disabled = !exists || stock === 0;

                        return (
                          <div
                            key={size}
                            onClick={() => !disabled && setSelectedSize(String(size))}
                            className={`
                          relative cursor-pointer border rounded text-center py-2 select-none transition
                          ${
                            selectedSize === String(size) && !disabled
                              ? "bg-red-500 text-white font-semibold"
                              : "hover:border-red-500"
                          }
                          ${
                            disabled
                              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                              : ""
                          }
                        `}
                          >
                            {size}

                            {!exists && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="relative flex items-center justify-center w-full h-full">
                                  <div className="absolute w-[70%] h-[2px] bg-blue-200 rotate-45 rounded-full"></div>
                                  <div className="absolute w-[70%] h-[2px] bg-blue-200 -rotate-45 rounded-full"></div>
                                </div>
                              </div>
                            )}
                            {exists && stock === 0 && (
                              <p className="text-[10px] text-red-500 mt-1">
                                Hết hàng
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="mb-6">
                    <label className="block mb-2 font-semibold">Số lượng:</label>
                    <input
                      type="number"
                      min={1}
                      max={selectedStock ?? 1}
                      disabled={!selectedSize}
                      value={quantity}
                      onChange={(e) => {
                        let val = parseInt(e.target.value) || 1;

                        if (selectedStock && val > selectedStock) {
                          val = selectedStock;
                        }

                        setQuantity(val);
                      }}
                      className="w-24 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {isOutOfStock ? (
                    <>
                      <button
                        className="flex-1 px-6 py-3 font-semibold text-white uppercase bg-gray-400 rounded-lg cursor-not-allowed"
                        disabled
                      >
                        Hết hàng
                      </button>
                      <button
                        className="flex-1 px-6 py-3 font-semibold text-white uppercase bg-gray-400 rounded-lg cursor-not-allowed"
                        disabled
                      >
                        Hết hàng
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="flex-1 px-6 py-3 font-semibold text-white uppercase transition bg-black rounded-lg hover:bg-gray-800"
                        onClick={() => {
                          if (!selectedSize) {
                            setShowWarning(true);
                            return;
                          }

                          if (selectedStock !== null && quantity > selectedStock) {
                            alert("Số lượng vượt tồn kho");
                            return;
                          }

                          if (!selectedProductSize) {
                            setShowWarning(true);
                            return;
                          }

                          addToCart(
                            {
                              id: selectedProductSize.id,
                              size: selectedProductSize.size,
                              product: {
                                id: product.id,
                                name: product.name,
                                price: product.discountPrice || product.price,
                                images: product.images,
                              },
                            },
                            quantity
                          );
                        }}
                      >
                        Thêm vào giỏ hàng
                      </button>

                      <button
                        className="flex-1 px-6 py-3 font-semibold text-white uppercase transition bg-red-600 rounded-lg hover:bg-red-700"
                        onClick={() => {
                          if (!selectedSize) {
                            setShowWarning(true);
                            return;
                          }

                          const checkoutItem = {
                            product: {
                              id: product.id,
                              name: product.name,
                              price: product.discountPrice || product.price,
                              images: product.images,
                            },
                            quantity,
                            size: selectedSize,
                          };

                          navigate("/checkout", {
                            state: {
                              buyNow: true,
                              items: [checkoutItem],
                            },
                          });
                        }}
                      >
                        Mua ngay
                      </button>

                      <button
                        onClick={handleFavorite}
                        className={`p-3 rounded-lg border transition-all duration-300 ${
                          isFavorited 
                            ? "bg-red-50 border-red-200 text-red-500 shadow-sm" 
                            : "bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
                        }`}
                        title={isFavorited ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                      >
                        <Heart size={24} className={isFavorited ? "fill-current" : ""} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* TABS SECTION - Expansion to full 9 columns */}
            <div className="w-full mt-10 pt-6 border-t">
              <div className="flex border-b overflow-x-auto hide-scrollbar whitespace-nowrap">
                <button
                  className={`py-3 px-6 font-semibold text-lg transition-colors border-b-2 ${
                    activeTab === "description"
                      ? "border-black text-black"
                      : "border-transparent text-gray-400 hover:text-black"
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  Thông tin & Mô tả sản phẩm
                </button>
                <button
                  className={`py-3 px-6 font-semibold text-lg transition-colors border-b-2 ${
                    activeTab === "guide"
                      ? "border-black text-black"
                      : "border-transparent text-gray-400 hover:text-black"
                  }`}
                  onClick={() => setActiveTab("guide")}
                >
                  Hướng dẫn mua hàng và thanh toán
                </button>
                <button
                  className={`py-3 px-6 font-semibold text-lg transition-colors border-b-2 ${
                    activeTab === "policy"
                      ? "border-black text-black"
                      : "border-transparent text-gray-400 hover:text-black"
                  }`}
                  onClick={() => setActiveTab("policy")}
                >
                  Chính sách đổi trả
                </button>
              </div>

              <div className="py-8">
                {activeTab === "description" && (
                  <div className="relative">
                    <div
                      className={`text-gray-700 leading-relaxed overflow-hidden transition-all duration-300 ${
                        showFullDesc ? "" : "max-h-[300px]"
                      }`}
                    >
                      {/* Render HTML description if it exists, else fallback */}
                      {product.description ? (
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                      ) : (
                        <p>Hiện chưa có mô tả cho sản phẩm này.</p>
                      )}
                    </div>
                    
                    {/* Fade out effect when collapsed */}
                    {!showFullDesc && product.description && product.description.length > 500 && (
                      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
                    )}

                    {product.description && product.description.length > 500 && (
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={() => setShowFullDesc(!showFullDesc)}
                          className="px-6 py-2.5 text-sm font-semibold border border-black rounded hover:bg-black hover:text-white transition-colors"
                        >
                          {showFullDesc ? "Thu gọn" : "Xem thêm"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "guide" && (
                  <div className="text-gray-700 leading-relaxed">
                    <p className="mb-2 font-semibold">1. Hướng dẫn mua hàng:</p>
                    <ul className="pl-5 mb-4 list-disc space-y-1">
                      <li>Tìm kiếm sản phẩm yêu thích và thêm vào giỏ hàng.</li>
                      <li>Điều chỉnh số lượng, màu sắc, size trước khi thanh toán.</li>
                      <li>Điền đầy đủ thông tin giao hàng tại trang Thanh toán.</li>
                    </ul>
                    <p className="mb-2 font-semibold">2. Hình thức thanh toán:</p>
                    <ul className="pl-5 list-disc space-y-1">
                      <li>Thanh toán khi nhận hàng (COD).</li>
                      <li>Chuyển khoản ngân hàng.</li>
                      <li>Thanh toán trực tuyến an toàn qua Ví điện tử (VNPay/Momo).</li>
                    </ul>
                  </div>
                )}

                {activeTab === "policy" && (
                  <div className="text-gray-700 leading-relaxed">
                    <p className="mb-2 font-semibold">Chính sách đổi trả trong vòng 7 ngày:</p>
                    <ul className="pl-5 mb-4 list-disc space-y-1">
                      <li>Sản phẩm chưa qua sử dụng, còn nguyên tem mác, mặt đế, hộp đựng.</li>
                      <li>Áp dụng đổi với các sản phẩm bị lỗi do nhà sản xuất hoặc nhầm kích cỡ (size).</li>
                      <li>Khách hàng chịu chi phí vận chuyển trong trường hợp đổi trả không phát sinh từ lỗi của Shop.</li>
                    </ul>
                    <p className="p-3 bg-gray-50 border-l-4 border-gray-800 text-gray-600 italic">
                      Lưu ý: Không hỗ trợ trả hàng hoàn tiền, chỉ hỗ trợ đổi sang sản phẩm cùng giá trị hoặc bù tiền để lấy SP cao hơn.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="pt-10 pb-16 mt-6 border-t">
                <h2 className="mb-6 text-2xl font-bold uppercase">Đánh giá và nhận xét</h2>
                <div className="flex flex-col items-center justify-between p-4 bg-white border border-gray-200 rounded-xl lg:flex-row gap-6 shadow-sm">
                  <div className="flex flex-col items-center flex-1 w-full p-2 text-center border-b lg:border-b-0 lg:border-r border-gray-200">
                    <h3 className="text-4xl font-extrabold text-gray-800">{reviewStats.average}</h3>
                    <div className="flex items-center gap-1 mt-2 mb-1 text-gray-200">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={20} 
                          className={star <= Math.round(reviewStats.average) ? "fill-current text-yellow-400" : "fill-current text-gray-200"} 
                        />
                      ))}
                    </div>
                    <p className="text-xs font-medium text-gray-500">{reviewStats.total} đánh giá</p>
                  </div>

                  <div className="flex-1 w-full space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviewStats.counts[star] || 0;
                      const percent = reviewStats.total > 0 ? ((count / reviewStats.total) * 100).toFixed(1) : 0;
                      return (
                        <div key={star} className="flex items-center text-[10px] font-medium text-gray-600">
                          <span className="w-3">{star}</span>
                          <Star size={10} className="text-yellow-400 fill-yellow-400 mx-1" />
                          <div className="flex-1 h-1.5 mx-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percent}%` }}></div>
                          </div>
                          <span className="w-20 text-right text-gray-400">{percent}% | {count}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col items-center justify-center flex-1 w-full p-2 border-t lg:border-t-0 lg:border-l border-gray-200">
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          setShowAuthWarning(true);
                        } else {
                          setOpenReview(true);
                        }
                      }}
                      className="w-full py-2.5 text-xs font-bold tracking-wide text-white uppercase transition-transform bg-blue-600 rounded-lg shadow-sm hover:scale-105 hover:bg-blue-700"
                    >
                      Đánh giá ngay
                    </button>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      <p className="italic text-sm">Chưa có đánh giá nào cho sản phẩm.</p>
                    </div>
                  ) : (
                    reviews.map((rv) => (
                      <div key={rv.id} className="p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 uppercase">
                            {rv.user?.username ? rv.user.username.charAt(0) : "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{rv.user?.username || "Khách hàng"}</p>
                            <div className="flex items-center gap-1 text-yellow-400">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} size={12} className={star <= rv.rating ? "fill-current" : "text-gray-300 fill-current"} />
                              ))}
                            </div>
                          </div>
                          <span className="ml-auto text-xs text-gray-400">
                            {new Date(rv.created_at).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{rv.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: SIMILAR PRODUCTS */}
          <div className="flex flex-col md:col-span-2 lg:col-span-3">
            <SimilarProduct currentProduct={product} />
          </div>
        </div>
      </div>


      <WarningModalSize
        open={showWarning}
        onClose={() => setShowWarning(false)}
      />

      <WarningModal
        open={showAuthWarning}
        title="Yêu cầu đăng nhập"
        message="Vui lòng đăng nhập để có thể đánh giá và nhận xét sản phẩm này."
        confirmText="Đăng nhập"
        variant="primary"
        onCancel={() => setShowAuthWarning(false)}
        onConfirm={() => navigate("/login", { state: { from: location.pathname } })}
      />

      <ReviewModal 
        open={openReview}
        onClose={() => setOpenReview(false)}
        productName={product.name}
        onSubmit={async (data) => {
          try {
            await reviewAPI.createReview({
              productId: product.id,
              rating: data.rating,
              content: data.comment
            });
            setNotif({ show: true, type: "success", message: "Đánh giá của bạn đã được gửi thành công!" });
            fetchReviews(product.id);
          } catch (error) {
            console.error("Lỗi khi gửi đánh giá", error);
            setNotif({ show: true, type: "error", message: error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá." });
          }
        }}
      />

      {notif.show && notif.type === "success" && (
        <SuccessNotification
          message={notif.message}
          onClose={() => setNotif({ ...notif, show: false })}
        />
      )}
      {notif.show && notif.type === "error" && (
        <WarningNotification
          message={notif.message}
          onClose={() => setNotif({ ...notif, show: false })}
        />
      )}

      <Footer />
    </>
  );
}
