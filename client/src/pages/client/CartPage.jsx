import React from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import { FaTrashAlt } from "react-icons/fa";
import { useCart } from "@/context/CartProvider";
import defaultImage from "../../assets/default.jpg";
import { Home, ShoppingCart } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import emptyImage from "@/assets/empty.png";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();  
  const navigate = useNavigate();

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

  return (
    <>
      <Header onHeightChange={() => {}} />
      <Navbar onHeightChange={() => {}} />

      <div className="container px-4 py-10 mx-auto md:px-16">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />
        <h2 className="mb-6 text-3xl font-bold">Giỏ hàng của bạn</h2>
          {cart.length > 0 && (
            <div className="flex justify-end mb-6 -mt-20">
              <button
                className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={() => navigate("/")}
              >
                TIẾP TỤC MUA HÀNG
              </button>
            </div>
          )}

    {cart.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-0">
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
            <div className="overflow-x-auto border rounded-lg">
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
                    const discountPrice = product.discountPrice ?? originalPrice;

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
                        <td className="p-4 font-semibold text-gray-700">{product.name}</td>
                        <td className="p-4 font-semibold text-center text-gray-700">{item.size || "-"}</td>
                        <td className="p-4 font-semibold text-center text-gray-400 line-through">{originalPrice.toLocaleString()}đ</td>
                        <td className="p-4 font-semibold text-center text-red-500">{discountPrice.toLocaleString()}đ</td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="px-2 py-1 border"
                             onClick={() => updateQuantity(item.key, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              className="px-2 py-1 border"
                              onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-center text-red-500">{(discountPrice * item.quantity).toLocaleString()}đ</td>
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

            {/* TOTAL */}
            <div className="flex justify-end mt-10">
              <div className="w-full border rounded-lg md:w-1/3">
                <div className="flex justify-between p-4 border-b">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-gray-800">{subtotal.toLocaleString()}đ</span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between p-4 border-b">
                    <span>Bạn đã tiết kiệm</span>
                    <span className="font-semibold text-green-600">{totalSavings.toLocaleString()}đ</span>
                  </div>
                )}

                <div className="flex justify-between p-4 border-b">
                  <span>Tổng tiền thanh toán</span>
                  <span className="font-semibold text-red-600">{subtotal.toLocaleString()}đ</span>
                </div>

                <Link
                  to="/checkout"
                  className="inline-block w-full py-4 font-semibold text-center text-white bg-black rounded-md hover:bg-gray-800"
                >
                  TIẾN HÀNH THANH TOÁN
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;
