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
    <div key={item.id ?? index} className="flex items-center gap-3 sm:gap-4 py-3 border-b">
      <img src={img} alt={name} className="object-cover w-16 h-16 sm:w-20 sm:h-20 border rounded-md flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-1">{name}</p>
        <p className="text-xs sm:text-sm text-gray-600">Size: {item.size}</p>

            <div className="flex items-center mt-1 sm:mt-2">
        <button
          className="border w-6 h-6 sm:w-7 sm:h-7 rounded-l-md text-sm"
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
          className="w-8 sm:w-10 text-center border-t border-b text-sm"
        />

        <button
          className="border w-6 h-6 sm:w-7 sm:h-7 rounded-r-md text-sm"
          onClick={() =>
            updateQuantity(item.key, item.quantity + 1)
          }
        >
          +
        </button>
      </div>


        <button
          onClick={() => removeFromCart(item.productSizeId)}
          className="mt-1 text-xs text-red-500 hover:underline"
        >
          × Xóa
        </button>
      </div>

      <p className="font-bold text-red-500 text-sm sm:text-base flex-shrink-0">{formatCurrency(price * item.quantity)}</p>
    </div>
  );
})}

        </div>

        {/* Footer */}
        <div className="pt-4 mt-5 border-t">
          <div className="flex justify-between mb-4">
            <span className="text-lg font-bold">Tổng tiền:</span>
            <span className="text-xl font-bold text-red-600">{formatCurrency(totalAmount)}</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <Link
              to="/cart"
              onClick={() => setShowCartPopup(false)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-white bg-black rounded-md hover:bg-gray-800 text-center text-sm sm:text-base"
            >
              Xem giỏ hàng
            </Link>

            <button
              onClick={() => setShowCartPopup(false)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 font-semibold bg-white border rounded-md hover:bg-gray-100 text-sm sm:text-base"
            >
              Tiếp tục mua hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;
