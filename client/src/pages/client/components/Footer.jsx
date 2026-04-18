import { FaFacebookF, FaInstagram, FaBehance, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import brandAPI from "../../../api/brand.api"; 
import defaultImage from "../../../assets/default.jpg"
import { useEffect, useState } from "react";
const Footer = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandAPI.getAll({ limit: 6 });
        const data = res.data.data || [];
        setBrands(data.slice(0, 6));
      } catch (err) {
        console.error("Lỗi tải thương hiệu:", err);
      }
    };

    fetchBrands();
  }, []);

  return (
    <footer className="pt-10 mt-20">
      <div className="flex flex-wrap justify-center w-full gap-16 pb-10">
        {brands.map((brand) => (
          <Link key={brand.id} to={`/thuong-hieu/${brand.slug}`}>
            <img
              src={brand.image?.trim() ? brand.image : defaultImage}
              alt={brand.name}
              className="object-contain h-12 transition-transform hover:scale-110"
            />
          </Link>
        ))}
      </div>

      <div className="container grid grid-cols-1 gap-10 px-6 py-10 mx-auto text-white bg-black sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <h3 className="mb-4 font-semibold">VỀ SNEAKER STORE</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-white transition-colors">Trang chủ</Link></li>
            <li><Link to="/gioi-thieu" className="hover:text-white transition-colors">Giới thiệu</Link></li>
            <li><Link to="/san-pham" className="hover:text-white transition-colors">Sản phẩm</Link></li>
            <li><Link to="/tin-tuc" className="hover:text-white transition-colors">Tin tức</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Chính sách</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/chinh-sach/bao-mat" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
            <li><Link to="/chinh-sach/van-chuyen" className="hover:text-white transition-colors">Chính sách vận chuyển</Link></li>
            <li><Link to="/chinh-sach/doi-tra" className="hover:text-white transition-colors">Chính sách đổi trả</Link></li>
            <li><Link to="/chinh-sach/quy-dinh" className="hover:text-white transition-colors">Quy định sử dụng</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Hỗ trợ khách hàng</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/tim-kiem" className="hover:text-white transition-colors">Tìm kiếm</Link></li>
            <li><Link to="/dang-nhap" className="hover:text-white transition-colors">Đăng nhập</Link></li>
            <li><Link to="/dang-ky" className="hover:text-white transition-colors">Đăng ký</Link></li>
            <li><Link to="/gio-hang" className="hover:text-white transition-colors">Giỏ hàng</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Liên hệ</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/lien-he" className="hover:text-white transition-colors">Thông tin liên hệ</Link></li>
            <li className="flex items-center gap-2"><span className="text-sm">Hotline: 0968 456 761</span></li>
            <li className="flex items-center gap-2"><span className="text-sm">Email: info@sneakerstore.vn</span></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Đăng ký nhận khuyến mãi</h3>

          <div className="flex w-full">
            <input
              type="email"
              className="w-full p-3 text-black bg-white rounded-l outline-none"
              placeholder="Nhập email của bạn..."
            />
            <button className="px-5 text-white bg-gray-800 rounded-r hover:bg-gray-700">
              Đăng ký
            </button>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 font-semibold">Theo dõi chúng tôi</h3>
            <div className="flex gap-4 text-xl">
              <FaFacebookF className="cursor-pointer hover:text-blue-500" />
              <FaTwitter className="cursor-pointer hover:text-blue-300" />
              <FaBehance className="cursor-pointer hover:text-blue-400" />
              <FaInstagram className="cursor-pointer hover:text-pink-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="py-4 text-center text-gray-500 border-t border-gray-800">
        © 2025 SneakerStore – All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
