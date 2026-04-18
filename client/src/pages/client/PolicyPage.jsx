import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";

const policies = {
  "bao-mat": {
    title: "Chính sách bảo mật",
    content: [
      {
        heading: "1. Thu thập thông tin",
        text: "Chúng tôi thu thập thông tin cá nhân của bạn khi bạn đăng ký tài khoản, đặt hàng hoặc liên hệ với chúng tôi. Các thông tin này bao gồm: họ tên, email, số điện thoại, địa chỉ giao hàng.",
      },
      {
        heading: "2. Sử dụng thông tin",
        text: "Thông tin của bạn được sử dụng để: Xử lý đơn hàng, Giao hàng, Liên hệ khi cần thiết, Gửi thông tin khuyến mãi (nếu bạn đồng ý).",
      },
      {
        heading: "3. Bảo vệ thông tin",
        text: "Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp kỹ thuật và quản lý phù hợp. Thông tin của bạn được lưu trữ trên máy chủ an toàn và chỉ được truy cập bởi nhân viên được ủy quyền.",
      },
      {
        heading: "4. Chia sẻ thông tin",
        text: "Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba, ngoại trừ các đối tác vận chuyển cần thiết để giao hàng.",
      },
    ],
  },
  "van-chuyen": {
    title: "Chính sách vận chuyển",
    content: [
      {
        heading: "1. Phạm vi giao hàng",
        text: "Chúng tôi giao hàng toàn quốc tới tất cả các tỉnh thành tại Việt Nam.",
      },
      {
        heading: "2. Thời gian giao hàng",
        text: "Nội thành HCM/HN: 1-2 ngày làm việc. Các tỉnh thành khác: 2-5 ngày làm việc tùy khu vực.",
      },
      {
        heading: "3. Phí vận chuyển",
        text: "Đơn hàng từ 500.000đ: Miễn phí vận chuyển. Đơn hàng dưới 500.000đ: Phí vận chuyển 30.000đ.",
      },
      {
        heading: "4. Theo dõi đơn hàng",
        text: "Bạn có thể theo dõi trạng thái đơn hàng trong mục 'Theo dõi đơn hàng' hoặc qua email thông báo.",
      },
    ],
  },
  "doi-tra": {
    title: "Chính sách đổi trả",
    content: [
      {
        heading: "1. Điều kiện đổi trả",
        text: "Sản phẩm còn nguyên tem, hộp, chưa qua sử dụng. Thời hạn: 7 ngày kể từ ngày nhận hàng.",
      },
      {
        heading: "2. Trường hợp được đổi trả",
        text: "Sản phẩm lỗi do nhà sản xuất, Sai size, Sai màu, Sản phẩm không đúng mô tả.",
      },
      {
        heading: "3. Quy trình đổi trả",
        text: "Bước 1: Liên hệ hotline hoặc email trong vòng 7 ngày. Bước 2: Gửi sản phẩm về địa chỉ được cung cấp. Bước 3: Nhận sản phẩm mới hoặc hoàn tiền trong 3-5 ngày.",
      },
      {
        heading: "4. Hoàn tiền",
        text: "Hoàn tiền qua chuyển khoản trong 3-5 ngày làm việc sau khi nhận được sản phẩm trả lại.",
      },
    ],
  },
  "quy-dinh": {
    title: "Quy định sử dụng",
    content: [
      {
        heading: "1. Tài khoản người dùng",
        text: "Bạn cần cung cấp thông tin chính xác khi đăng ký. Bạn chịu trách nhiệm bảo mật mật khẩu tài khoản của mình.",
      },
      {
        heading: "2. Đặt hàng",
        text: "Đơn hàng chỉ được xác nhận sau khi hoàn tất thanh toán. Chúng tôi có quyền từ chối đơn hàng trong một số trường hợp.",
      },
      {
        heading: "3. Giá cả",
        text: "Giá sản phẩm có thể thay đổi mà không cần thông báo trước. Giá hiển thị tại thời điểm đặt hàng là giá cuối cùng.",
      },
      {
        heading: "4. Sở hữu trí tuệ",
        text: "Tất cả nội dung trên website thuộc quyền sở hữu của Sneaker Store. Nghiêm cấm sao chép khi chưa được phép.",
      },
      {
        heading: "5. Trách nhiệm",
        text: "Chúng tôi không chịu trách nhiệm cho các thiệt hại gián tiếp phát sinh từ việc sử dụng sản phẩm.",
      },
    ],
  },
};

const PolicyPage = () => {
  const { slug } = useParams();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const policy = policies[slug];

  if (!policy) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="mb-8 text-4xl font-bold text-center text-gray-900">
              {policy.title}
            </h1>
            
            <div className="p-8 bg-white rounded-2xl shadow-sm">
              <div className="space-y-6">
                {policy.content.map((section, index) => (
                  <div key={index}>
                    <h2 className="mb-3 text-xl font-semibold text-gray-800">
                      {section.heading}
                    </h2>
                    <p className="leading-relaxed text-gray-600">
                      {section.text}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 mt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Cập nhật lần cuối: 17/04/2025
                </p>
                <p className="text-sm text-gray-500">
                  Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ hotline: 0968 456 761
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PolicyPage;
