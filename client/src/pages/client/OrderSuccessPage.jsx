import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((s) => s.userAuth);

  const state = location.state;

  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  if (!state) return null;

  const handleTrack = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      navigate("/track-order", {
        state: {
          email: state.email,
        },
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-20 text-center">
      <h1 className="text-2xl font-bold text-green-600">
        🎉 Đặt hàng thành công
      </h1>

      <p className="mt-4">
        Email nhận đơn: <b>{state.email}</b>
      </p>

      <p className="mt-2 font-semibold">
        Tổng tiền: {state.total.toLocaleString()}đ
      </p>

      <button
        onClick={handleTrack}
        className="px-6 py-3 mt-6 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Tra cứu đơn hàng
      </button>
    </div>
  );
}
