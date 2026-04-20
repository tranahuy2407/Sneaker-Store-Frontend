import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartProvider";
import defaultImage from "@/assets/default.jpg";
const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);

const CartPopup = () => {
  const { cart, showCartPopup, setShowCartPopup, updateQuantity, removeFromCart } = useCart();

  if (!showCartPopup || !cart || cart.length === 0) return null;

const totalAmount = cart.reduce((sum, item) => {
  const price = item.product?.discountPrice ?? item.product?.price ?? item.price ?? 0;
  return sum + price * item.quantity;
}, 0);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && setShowCartPopup(false)}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-2xl p-4 sm:p-6 animate-[fadeIn_0.25s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-base sm:text-lg font-semibold text-gray-800">Giỏ hàng của bạn</p>
          <button
            onClick={() => setShowCartPopup(false)}
            className="text-xl sm:text-2xl text-gray-600 hover:text-black"
          >
            ×
          </button>
        </div>

        {/* Product list */}
        <div className="pr-2 overflow-y-auto max-h-64 sm:max-h-80">
      {cart.map((item, index) => {
      const product = item.product ?? item;

      const name = product?.name ?? "Sản phẩm không xác định";
      const img = product?.images?.[0]?.url ?? defaultImage;
      const price =
        product?.discountPrice ??
        product?.price ??
        0;

  return (
    <div key={item.id ?? index} className="flex flex-wrap sm:flex-nowrap items-start sm:items-center gap-2 sm:gap-4 py-3 border-b">
      <img src={img} alt={name} className="object-cover w-14 h-14 sm:w-20 sm:h-20 border rounded-md flex-shrink-0" />

      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-xs sm:text-base line-clamp-1">{name}</p>
          <p className="text-[10px] sm:text-sm text-gray-600">Size: {item.size}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center">
            <button
              className="border w-6 h-6 sm:w-7 sm:h-7 rounded-l-md text-xs sm:text-sm flex items-center justify-center active:bg-gray-100"
              onClick={() =>
                updateQuantity(item.key, Math.max(1, item.quantity - 1))
              }
            >
              -
            </button>

            <input
              type="number"
              value={item.quantity}
              min="1"
              onChange={(e) =>
                updateQuantity(
                  item.key,
                  Math.max(1, parseInt(e.target.value) || 1)
                )
              }
              className="w-7 sm:w-10 h-6 sm:h-7 text-center border-t border-b text-xs sm:text-sm focus:outline-none"
            />

            <button
              className="border w-6 h-6 sm:w-7 sm:h-7 rounded-r-md text-xs sm:text-sm flex items-center justify-center active:bg-gray-100"
              onClick={() =>
                updateQuantity(item.key, item.quantity + 1)
              }
            >
              +
            </button>
          </div>

          <p className="font-bold text-red-500 text-xs sm:text-base flex-shrink-0 min-w-[70px] text-right">{formatCurrency(price * item.quantity)}</p>
        </div>
      </div>

      <button
        onClick={() => removeFromCart(item.productSizeId)}
        className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
        title="Xóa sản phẩm"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
})}

        </div>

        {/* Footer */}
        <div className="pt-3 sm:pt-4 mt-4 sm:mt-5 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2">
            <span className="text-base sm:text-lg font-bold">Tổng tiền:</span>
            <span className="text-lg sm:text-xl font-bold text-red-600">{formatCurrency(totalAmount)}</span>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={() => setShowCartPopup(false)}
              className="px-3 sm:px-6 py-2 sm:py-3 font-semibold bg-white border rounded-md hover:bg-gray-100 text-xs sm:text-base active:bg-gray-200 transition-colors"
            >
              Tiếp tục mua hàng
            </button>
            <Link
              to="/cart"
              onClick={() => setShowCartPopup(false)}
              className="px-3 sm:px-6 py-2 sm:py-3 font-semibold text-white bg-black rounded-md hover:bg-gray-800 text-center text-xs sm:text-base active:bg-gray-900 transition-colors"
            >
              Xem giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;
