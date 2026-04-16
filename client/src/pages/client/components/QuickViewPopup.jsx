import React, { useState } from "react";
import { useCart } from "../../../context/CartProvider";
import imageDefault from "../../../assets/default.jpg";
import WarningModalSize from "./WarningModalSize";
import { useEffect } from "react";
import recentlyViewedAPI from "../../../api/recentlyViewed.api";

const sizes = [
  36.5, 37, 37.5, 38, 38.5, 39, 40, 40.5, 41, 41.5, 42, 42.5, 43, 43.5, 44,
  44.5, 45, 45.5, 46, 46.5,
];

const QuickViewPopup = ({ product, onClose, onSuccess }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showWarning, setShowWarning] = useState(false);
  const selectedProductSize = product.sizes?.find(
    (s) => Number(s.size) === Number(selectedSize)
  );

  useEffect(() => {
    if (product?.id) {
      const addToHistory = async () => {
        try {
          await recentlyViewedAPI.add(product.id);
        } catch (error) {
          console.error("Lỗi khi thêm vào SP đã xem (QuickView):", error);
        }
      };
      addToHistory();
    }
  }, [product?.id]);

  if (!product) return null;
  
  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative flex flex-col w-full max-w-4xl max-h-[90vh] overflow-y-auto gap-4 sm:gap-6 p-4 sm:p-6 bg-white shadow-xl rounded-xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {" "}
        <button onClick={onClose} className="absolute text-2xl top-4 right-4">
          ×{" "}
        </button>
        {/* Ảnh sản phẩm */}
        <div className="flex items-center justify-center w-full md:w-1/2">
          <img
            src={product.images?.[0]?.url || imageDefault}
            alt={product.name}
            className="object-contain w-full rounded-md max-h-48 sm:max-h-64 md:max-h-96"
          />
        </div>
        {/* Thông tin sản phẩm */}
        <div className="flex flex-col justify-between w-full md:w-1/2">
          <div>
            <h3 className="mb-2 text-lg sm:text-xl md:text-2xl font-bold transition-colors duration-200 cursor-pointer hover:text-blue-600 line-clamp-2">
              {product.name}
            </h3>

            <div className="flex flex-wrap items-center gap-4 mb-2 text-sm text-gray-600">
              {product.brand && (
                <span className="font-semibold">
                  Thương hiệu:{" "}
                  <span className="font-normal text-red-600 ">
                    {product.brand.name}
                  </span>
                </span>
              )}
            <span className="font-semibold">
              Tình trạng:{" "}
              <span
                className={`font-normal ${
                  product.sizes?.some((s) => s.stock > 0) ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.sizes?.some((s) => s.stock > 0) ? "Còn hàng" : "Hết hàng"}
              </span>
            </span> 

            </div>

            {/* Mô tả */}
            {product.description && (
              <div
                className="mb-4 text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: product.description.replace(/<\/?p>/g, ""),
                }}
              />
            )}

            {/* Giá */}
            <div className="mb-4">
              <span className="text-xl font-bold text-red-600">
                {product.discountPrice.toLocaleString()}₫
              </span>
              {product.discount > 0 && (
                <span className="ml-2 text-gray-400 line-through">
                  {product.price.toLocaleString()}₫
                </span>
              )}
            </div>

            {/* Chọn size */}

            <p className="mb-2 font-semibold text-sm sm:text-base">Size:</p>

            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6 gap-1.5 sm:gap-2 mb-4">
              {sizes.map((size) => {
                const sizeObj = product.sizes?.find((s) => s.size == size);
                const exists = !!sizeObj;
                const stock = sizeObj?.stock || 0;
                const disabled = !exists || stock === 0;

                return (
                  <div
                    key={size}
                    onClick={() => !disabled && setSelectedSize(size)}
                    className={`
            relative cursor-pointer border rounded text-center py-1.5 sm:py-2 text-xs sm:text-sm select-none transition
            ${
              selectedSize === size && !disabled
                ? "bg-red-500 text-white font-semibold"
                : "hover:border-red-500"
            }
            ${disabled ? "text-gray-400 bg-gray-100 cursor-not-allowed" : ""}
          `}
                  >
                    {size}
                    {!exists && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="absolute w-full h-[2px] bg-blue-200 rotate-45"></span>
                        <span className="absolute w-full h-[2px] bg-blue-200 -rotate-45"></span>
                      </div>
                    )}

                    {exists && stock === 0 && (
                      <p className="text-[10px] text-red-500 mt-1">Hết</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Chọn số lượng */}
            <div className="flex items-center gap-2 mb-4">
                <button
                onClick={() =>
                  setQuantity((q) =>
                    selectedProductSize
                      ? Math.min(q - 1, selectedProductSize.stock)
                      : q - 1
                  )
                }
                className="w-7 h-7 sm:w-8 sm:h-8 border rounded hover:bg-gray-100 text-sm sm:text-base"
              >
                -
              </button>
              <input
                type="number"
                className="w-10 sm:w-12 text-center border-t border-b text-sm sm:text-base"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
              />
              <button
                onClick={() =>
                  setQuantity((q) =>
                    selectedProductSize
                      ? Math.min(q + 1, selectedProductSize.stock)
                      : q + 1
                  )
                }
                className="w-7 h-7 sm:w-8 sm:h-8 border rounded hover:bg-gray-100 text-sm sm:text-base"
              >
                +
              </button>

            </div>
          </div>

          {/* Nút thêm vào giỏ */}
          <div className="flex justify-end">
            <button
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-white bg-black rounded-md hover:bg-gray-800"
           onClick={() => {
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

          onSuccess && onSuccess(product);
          onClose();
        }}

            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
      <WarningModalSize open={showWarning} onClose={() => setShowWarning(false)} />
    </div>
  );
};

export default QuickViewPopup;
