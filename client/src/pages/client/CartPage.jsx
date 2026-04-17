import React, { useState } from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import { FaTrashAlt } from "react-icons/fa";
import { useCart } from "@/context/CartProvider";
import defaultImage from "../../assets/default.jpg";
import { Home, ShoppingCart, Ticket, Trophy, ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import emptyImage from "@/assets/empty.png";
import CouponModal from "./components/CouponModal";
import { useSelector, useDispatch } from "react-redux";
import orderAPI from "@/api/order.api";
import { useEffect } from "react";

const MILESTONES = [
  { threshold: 500000, reward: "Mã giảm giá 5%" },
  { threshold: 1500000, reward: "Mã giảm giá 10%" },
  { threshold: 2000000, reward: "Mã giảm giá 15%" },
  { threshold: 5000000, reward: "Mã giảm giá 20%" },
  { threshold: 10000000, reward: "Tặng 1 đôi giày miễn phí" },
];

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, coupon, setCoupon, clearCoupon } = useCart();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userAuth);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    if (user?.id) {
      orderAPI.getMyOrders().then((res) => {
        const spent = (res.data.data || [])
          .filter(o => o.status === "Completed")
          .reduce((sum, o) => sum + (o.total_amount || 0), 0);
        setTotalSpent(spent);
      });
    }
  }, [user]);

  const [openCoupon, setOpenCoupon] = useState(false);
  const productIds = cart.map(i => i.product?.id || i.id);
  
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/", icon: <Home size={14} /> },
    { label: "Giỏ hàng", icon: <ShoppingCart size={14} /> },
  ];

  const subtotal = cart.reduce((sum, item) => {
    const p = item.product ?? item;
    const quantity = item.quantity ?? 1;
    const price = p.discountPrice ?? p.price ?? 0;
    return sum + price * quantity;
  }, 0);

  const totalSavings = cart.reduce((sum, item) => {
    const p = item.product ?? item;
    const quantity = item.quantity ?? 1;
    const discount = (p.price ?? 0) - (p.discountPrice ?? p.price ?? 0);
    return sum + discount * quantity;
  }, 0);
  const discountAmount = coupon?.data?.discountAmount || 0;
  const finalTotal = Math.max(subtotal - discountAmount, 0);
  
  return (
    <>
      <Header onHeightChange={() => {}} />
      <Navbar onHeightChange={() => {}} />

      <div className="container px-4 py-10 mx-auto md:px-16">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        <h2 className="mb-6 text-3xl font-bold">Giỏ hàng của bạn</h2>
        {cart.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
            <div className="flex-1 w-full">
              {user && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg text-white">
                      <Trophy size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">CHƯƠNG TRÌNH KHÁCH HÀNG VIP</p>
                      {totalSpent + subtotal >= (MILESTONES.find(m => m.threshold > totalSpent)?.threshold || 0) ? (
                        <p className="text-sm font-semibold text-gray-800">
                          🎉 Tuyệt vời! Bạn sẽ đạt mốc: <span className="text-blue-700 font-bold text-base">{(MILESTONES.find(m => m.threshold > totalSpent)?.reward)}</span> sau đơn hàng này!
                        </p>
                      ) : (
                        <p className="text-sm font-semibold text-gray-800">
                          Bạn chỉ cách mốc nhận thưởng tiếp theo <span className="text-red-600 font-bold text-base">{((MILESTONES.find(m => m.threshold > totalSpent)?.threshold || 0) - (totalSpent + subtotal)).toLocaleString()}đ</span> nữa!
                        </p>
                      )}
                    </div>
                  </div>
                  <Link to="/profile" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
                    XEM QUÀ <ArrowRight size={14} />
                  </Link>
                </div>
              )}
            </div>
            <button
              className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 w-full md:w-auto"
              onClick={() => navigate("/")}
            >
              TIẾP TỤC MUA HÀNG
            </button>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <img
              src={emptyImage}
              alt="Giỏ hàng trống"
              className="w-48 h-48 mb-4"
            />

            <p className="mb-6 text-lg font-semibold text-gray-500">
              Giỏ hàng của bạn đang trống
            </p>

            <button
              className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={() => navigate("/")}
            >
              TIẾP TỤC MUA HÀNG
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto border rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="w-40 p-4 text-center">Ảnh sản phẩm</th>
                    <th className="p-4">Tên sản phẩm</th>
                    <th className="w-32 p-4 text-center">Size</th>
                    <th className="w-40 p-4 text-center">Giá gốc</th>
                    <th className="w-40 p-4 text-center">Giá giảm</th>
                    <th className="w-32 p-4 text-center">Số lượng</th>
                    <th className="w-40 p-4 text-center">Thành tiền</th>
                    <th className="w-16 p-4 text-center">Xoá</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => {
                    const product = item.product || item;
                    const originalPrice = product.price ?? 0;
                    const discountPrice =
                      product.discountPrice ?? originalPrice;

                    return (
                      <tr key={item.key} className="border-b">
                        <td className="p-4 text-center">
                          <img
                            src={
                              product.images?.find((i) => i.isDefault)?.url ||
                              product.images?.[0]?.url ||
                              defaultImage
                            }
                            alt={product.name}
                            className="object-cover w-20 h-20 border rounded-md"
                          />
                        </td>
                        <td className="p-4 font-semibold text-gray-700">
                          {product.name}
                        </td>
                        <td className="p-4 font-semibold text-center text-gray-700">
                          {item.size || "-"}
                        </td>
                        <td className="p-4 font-semibold text-center text-gray-400 line-through">
                          {originalPrice.toLocaleString()}đ
                        </td>
                        <td className="p-4 font-semibold text-center text-red-500">
                          {discountPrice.toLocaleString()}đ
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="px-2 py-1 border"
                              onClick={() =>
                                updateQuantity(item.key, item.quantity - 1)
                              }
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              className="px-2 py-1 border"
                              onClick={() =>
                                updateQuantity(item.key, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-center text-red-500">
                          {(discountPrice * item.quantity).toLocaleString()}đ
                        </td>
                        <td className="p-4 text-center">
                          <button
                            className="text-gray-500 hover:text-red-500"
                            onClick={() => removeFromCart(item.productSizeId)}
                          >
                            <FaTrashAlt />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {cart.map((item) => {
                const product = item.product || item;
                const originalPrice = product.price ?? 0;
                const discountPrice = product.discountPrice ?? originalPrice;

                return (
                  <div key={item.key} className="flex gap-3 p-3 bg-white border rounded-lg">
                    <img
                      src={product.images?.find((i) => i.isDefault)?.url || product.images?.[0]?.url || defaultImage}
                      alt={product.name}
                      className="object-cover w-24 h-24 border rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-700 text-sm line-clamp-2 mb-1">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-1">Size: {item.size || "-"}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-red-500 text-sm">{discountPrice.toLocaleString()}đ</span>
                        {originalPrice > discountPrice && (
                          <span className="text-xs text-gray-400 line-through">{originalPrice.toLocaleString()}đ</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            className="w-7 h-7 border rounded text-sm"
                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            className="w-7 h-7 border rounded text-sm"
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="text-gray-400 hover:text-red-500 p-1"
                          onClick={() => removeFromCart(item.productSizeId)}
                        >
                          <FaTrashAlt size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          <div className="flex flex-col gap-6 mt-8 md:flex-row">
            {/* LEFT — VOUCHER */}
            <div className="w-full md:w-2/3">
              <div className="p-5 transition bg-white border border-dashed shadow-sm rounded-xl hover:shadow-md">
                <div className="flex items-center gap-6">
                  
                  <div className="flex items-center justify-center text-white bg-blue-600 rounded-full w-14 h-14">
                    <Ticket className="w-7 h-7" />
                  </div>

                  <div className="flex-1">
                    <p className="text-xl font-semibold text-gray-800">
                      Mã giảm giá
                    </p>

                    <p className="text-sm text-gray-500">
                      Chọn hoặc nhập mã để được ưu đãi tốt nhất
                    </p>

                    {coupon && (
                      <p className="mt-1 font-semibold text-green-600">
                        Đã giảm: -{coupon.data?.discountAmount?.toLocaleString()}đ
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setOpenCoupon(true)}
                    className="px-6 py-3 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 hover:scale-[1.03]"
                  >
                    Chọn mã
                  </button>
                  {coupon && (
                    <div className="p-3 text-right">
                      <button
                        onClick={clearCoupon}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Huỷ mã giảm giá
                      </button>
                    </div>
                  )}
               </div>
              </div>
            </div>
          {/* RIGHT — TOTAL */}
          <div className="w-full md:w-1/3">
            <div className="border rounded-lg">

              {/* SUBTOTAL */}
              <div className="flex justify-between p-4 border-b">
                <span>Tạm tính</span>
                <span className="font-semibold text-gray-800">
                  {subtotal.toLocaleString()}đ
                </span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between p-4 border-b">
                  <span>Giảm giá sản phẩm</span>
                  <span className="font-semibold text-green-600">
                    -{totalSavings.toLocaleString()}đ
                  </span>
                </div>
              )}

              {coupon && (
                <div className="flex justify-between p-4 border-b bg-green-50">
                  <span className="font-medium">
                    Mã giảm giá ({coupon.data?.coupon?.code})
                  </span>
                  <span className="font-semibold text-green-600">
                    -{coupon.data?.discountAmount?.toLocaleString()}đ
                  </span>
                </div>
              )}

              {/* FINAL */}
              <div className="flex justify-between p-4 border-b">
                <span className="text-lg font-semibold">
                  Tổng thanh toán
                </span>
                <span className="text-2xl font-bold text-red-600">
                  {finalTotal.toLocaleString()}đ
                </span>
              </div>

              <Link
                to="/checkout"
                className="inline-block w-full py-4 font-semibold text-center text-white bg-black rounded-md hover:bg-gray-800"
              >
                TIẾN HÀNH THANH TOÁN
              </Link>

            </div>
          </div>
          </div>
          </>
        )}
      </div>
      <CouponModal
        open={openCoupon}
        onClose={() => setOpenCoupon(false)}
        orderTotal={subtotal}
        productIds={productIds}
        selectedCode={coupon?.data?.coupon?.code}
        onApply={(data) => {
          setCoupon(data);
        }}
      />
    </>
  );
};

export default CartPage;
