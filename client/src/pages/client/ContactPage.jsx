import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { contactAPI } from "../../api/contact.api";
import { toast } from "react-toastify";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await contactAPI.create(formData);
      toast.success("Cảm ơn bạn đã gửi tin nhắn! Chúng tôi sẽ liên hệ lại sớm.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      console.error("Lỗi gửi liên hệ:", err);
      toast.error(err.response?.data?.message || "Gửi liên hệ thất bại. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto animate-fade-in">
            <h1 className="mb-8 text-4xl font-bold text-center text-gray-900">
              Liên hệ với chúng tôi
            </h1>
            
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-1">
                <div className="p-6 bg-white rounded-2xl shadow-sm">
                  <h2 className="mb-6 text-xl font-semibold text-gray-800">
                    Thông tin liên hệ
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-[#FF7E5F] mt-1" />
                      <div>
                        <div className="font-medium text-gray-800">Hotline</div>
                        <div className="text-gray-600">0968 456 761</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-[#FF7E5F] mt-1" />
                      <div>
                        <div className="font-medium text-gray-800">Email</div>
                        <div className="text-gray-600">info@sneakerstore.vn</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#FF7E5F] mt-1" />
                      <div>
                        <div className="font-medium text-gray-800">Địa chỉ</div>
                        <div className="text-gray-600">
                          123 Nguyễn Văn A, Quận 1, TP. Hồ Chí Minh
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-[#FF7E5F] mt-1" />
                      <div>
                        <div className="font-medium text-gray-800">Giờ làm việc</div>
                        <div className="text-gray-600">
                          Thứ 2 - Thứ 7: 8:00 - 21:00
                        </div>
                        <div className="text-gray-600">
                          Chủ nhật: 9:00 - 20:00
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-2xl shadow-sm">
                  <h2 className="mb-4 text-xl font-semibold text-gray-800">
                    Theo dõi chúng tôi
                  </h2>
                  <div className="flex gap-3">
                    <a href="#" className="flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors">
                      f
                    </a>
                    <a href="#" className="flex items-center justify-center w-10 h-10 text-white bg-pink-500 rounded-full hover:bg-pink-600 transition-colors">
                      IG
                    </a>
                    <a href="#" className="flex items-center justify-center w-10 h-10 text-white bg-blue-400 rounded-full hover:bg-blue-500 transition-colors">
                      Tw
                    </a>
                    <a href="#" className="flex items-center justify-center w-10 h-10 text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors">
                      YT
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="p-8 bg-white rounded-2xl shadow-sm">
                  <h2 className="mb-6 text-xl font-semibold text-gray-800">
                    Gửi tin nhắn cho chúng tôi
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Họ và tên *"
                        required
                        className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#FF7E5F] focus:outline-none"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email *"
                        required
                        className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#FF7E5F] focus:outline-none"
                      />
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Số điện thoại"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#FF7E5F] focus:outline-none"
                      />
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Tiêu đề *"
                        required
                        className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#FF7E5F] focus:outline-none"
                      />
                    </div>
                    
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Nội dung tin nhắn *"
                      required
                      rows={5}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:border-[#FF7E5F] focus:outline-none resize-none"
                    />
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className={`flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 text-white rounded-lg transition-colors ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF7E5F] hover:bg-[#FF6B4A]"
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      {loading ? "Đang gửi..." : "Gửi tin nhắn"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactPage;
