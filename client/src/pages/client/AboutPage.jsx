import { useEffect } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="mb-8 text-4xl font-bold text-center text-gray-900">
              Về Sneaker Store
            </h1>
            
            <div className="p-8 mb-8 bg-white rounded-2xl shadow-sm">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                Chúng tôi là ai?
              </h2>
              <p className="mb-4 leading-relaxed text-gray-600">
                Sneaker Store là địa chỉ tin cậy dành cho những người yêu thích giày sneaker tại Việt Nam. 
                Được thành lập từ năm 2020, chúng tôi tự hào mang đến những sản phẩm chính hãng từ các 
                thương hiệu nổi tiếng như Nike, Adidas, Puma, Vans, Converse và nhiều hãng khác.
              </p>
              <p className="leading-relaxed text-gray-600">
                Với phương châm "Chất lượng là uy tín", chúng tôi cam kết mang đến cho khách hàng 
                những đôi giày chính hãng 100%, với giá cả cạnh tranh và dịch vụ chăm sóc khách hàng tận tâm.
              </p>
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-3">
              <div className="p-6 text-center bg-white rounded-xl shadow-sm">
                <div className="mb-3 text-4xl font-bold text-[#FF7E5F]">50+</div>
                <div className="text-gray-600">Thương hiệu</div>
              </div>
              <div className="p-6 text-center bg-white rounded-xl shadow-sm">
                <div className="mb-3 text-4xl font-bold text-[#FF7E5F]">10000+</div>
                <div className="text-gray-600">Sản phẩm</div>
              </div>
              <div className="p-6 text-center bg-white rounded-xl shadow-sm">
                <div className="mb-3 text-4xl font-bold text-[#FF7E5F]">50000+</div>
                <div className="text-gray-600">Khách hàng</div>
              </div>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow-sm">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                Tại sao chọn chúng tôi?
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-[#FF7E5F] mt-1">✓</span>
                  <span>Sản phẩm chính hãng 100%, có tem và hộp đầy đủ</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FF7E5F] mt-1">✓</span>
                  <span>Giá cả cạnh tranh, nhiều chương trình khuyến mãi</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FF7E5F] mt-1">✓</span>
                  <span>Đổi trả dễ dàng trong vòng 7 ngày</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FF7E5F] mt-1">✓</span>
                  <span>Giao hàng nhanh chóng toàn quốc</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#FF7E5F] mt-1">✓</span>
                  <span>Đội ngũ tư vấn chuyên nghiệp, nhiệt tình</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
