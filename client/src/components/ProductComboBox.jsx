import React, { useEffect, useState } from "react";
import productAPI from "../api/product.api";
import defaultImage from "@/assets/default.jpg";

const ProductComboBox = ({ selectedProducts, setSelectedProducts }) => {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productAPI.getAll({ page: 1, limit: 999 });
      const list = res.data?.data?.data || res.data?.data || [];
      setProducts(list);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
    }
  };

  const toggleProduct = (product) => {
    const exists = selectedProducts.find((p) => p.id === product.id);

    if (exists) {
      setSelectedProducts(
        selectedProducts.filter((p) => p.id !== product.id)
      );
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="p-6 space-y-3 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
        Sản phẩm áp dụng
      </h2>

      {/* input select */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full p-3 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-blue-200 transition-colors bg-gray-50 flex items-center justify-between"
      >
        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto w-full">
            {selectedProducts.length > 0 ? (
                selectedProducts.map(p => (
                    <span key={p.id} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm font-medium">
                        {p.name}
                    </span>
                ))
            ) : (
                <span className="text-gray-400">Chọn sản phẩm...</span>
            )}
        </div>
        <div className="text-gray-400">
            {open ? "▲" : "▼"}
        </div>
      </div>

      {/* dropdown */}
      {open && (
        <div className="border border-gray-100 rounded-xl shadow-xl max-h-80 overflow-y-auto mt-2 bg-white z-10 transition-all">
          <div className="sticky top-0 bg-white p-2 border-b border-gray-50">
            <input
                className="w-full p-2 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-100 transition-all border border-gray-100"
                placeholder="Tìm kiếm sản phẩm theo tên..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                autoFocus
            />
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.map((p) => {
                const active = selectedProducts.find(
                (x) => x.id === p.id
                );

                return (
                <div
                    key={p.id}
                    onClick={() => toggleProduct(p)}
                    className={`p-3 flex items-center gap-4 cursor-pointer hover:bg-blue-50 transition-colors ${
                    active ? "bg-blue-50/50" : ""
                    }`}
                >
                    <div className="relative">
                        <img 
                            src={p.images?.[0]?.url || defaultImage} 
                            alt={p.name} 
                            className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                        />
                        {active && (
                            <div className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                                ✓
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-gray-800 text-sm">{p.name}</div>
                        <div className="text-xs text-gray-500 font-medium">
                            {Number(p.price).toLocaleString()}₫
                        </div>
                    </div>
                    {active && (
                        <div className="text-blue-600 font-bold text-xs uppercase tracking-wider">
                            Đã chọn
                        </div>
                    )}
                </div>
                );
            })}

            {!filtered.length && (
                <div className="p-8 text-center text-gray-400 italic">
                Không tìm thấy sản phẩm nào
                </div>
            )}
          </div>
        </div>
      )}

      {/* badge summary */}
      <div className="pt-2 flex flex-wrap gap-2">
        {selectedProducts.map((p) => (
          <span
            key={p.id}
            onClick={() => toggleProduct(p)}
            className="group flex items-center gap-2 px-3 py-1.5 text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-full cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-100 transition-all animate-in fade-in zoom-in duration-200"
          >
            {p.name}
            <span className="text-blue-300 group-hover:text-red-300 transition-colors">✕</span>
          </span>
        ))}
      </div>
      
      {selectedProducts.length > 0 && (
          <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSelectedProducts([])}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium flex items-center gap-1"
              >
                  Gỡ bỏ tất cả ({selectedProducts.length})
              </button>
          </div>
      )}
    </div>
  );
};

export default ProductComboBox;
