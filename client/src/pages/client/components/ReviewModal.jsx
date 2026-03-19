import React, { useState } from "react";
import { X, Star } from "lucide-react";

export default function ReviewModal({ open, onClose, onSubmit, productName }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ rating, comment });
    }
    setRating(5);
    setComment("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Đánh giá sản phẩm</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Product info (optional) */}
        {productName && (
          <p className="mb-6 text-sm text-gray-600">
            Bạn đang đánh giá: <span className="font-semibold">{productName}</span>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div className="flex flex-col items-center justify-center mb-6">
            <p className="mb-2 font-medium text-gray-700">Chất lượng sản phẩm</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={(hoverRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm font-semibold text-yellow-600">
              {rating === 1 && "Tệ"}
              {rating === 2 && "Không hài lòng"}
              {rating === 3 && "Bình thường"}
              {rating === 4 && "Hài lòng"}
              {rating === 5 && "Tuyệt vời"}
            </p>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Nhận xét của bạn
            </label>
            <textarea
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Chia sẻ cảm nhận của bạn về chất lượng sản phẩm..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Gửi đánh giá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
