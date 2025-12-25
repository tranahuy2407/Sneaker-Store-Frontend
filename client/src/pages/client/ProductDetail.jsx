import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productAPI from "../../api/product.api";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "./components/Footer";
import { useCart } from "../../context/CartProvider";
import WarningModalSize from "./components/WarningModalSize";
import { Folder, Home, Package } from "lucide-react";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [showWarning, setShowWarning] = useState(false);

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

      <div className="grid max-w-6xl grid-cols-1 gap-8 p-4 mx-auto md:grid-cols-2">
        {/* LEFT: IMAGES */}
        <div className="flex flex-col items-start">
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
              zoomDiv.style.display = "block";
              document.getElementById("zoom-image").style.transform =
                "scale(2)";
            }}
            onMouseLeave={() => {
              const zoomDiv = document.getElementById("zoom-div");
              zoomDiv.style.display = "none";
              document.getElementById("zoom-image").style.transform =
                "scale(1)";
            }}
          >
            <img
              src={product.images?.[activeImage]?.url}
              alt={product.name}
              className="object-contain w-full h-full"
            />
          </div>

          <div
            id="zoom-div"
            className="absolute w-80 h-80 border rounded-lg overflow-hidden left-[450px] top-[250px] hidden z-50 pointer-events-none"
          >
            <img
              id="zoom-image"
              src={product.images?.[activeImage]?.url}
              alt={product.name}
              className="absolute object-contain w-full h-full transition-transform duration-300"
            />
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

        {/* RIGHT: INFO */}
        <div className="flex flex-col justify-between">
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
          <div className="flex flex-wrap gap-4 mt-4">
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
              </>
            )}
          </div>
        </div>
      </div>
      <WarningModalSize
        open={showWarning}
        onClose={() => setShowWarning(false)}
      />

      <Footer />
    </>
  );
}
