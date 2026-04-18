import { useEffect, useState } from "react";
import { Calendar, Eye } from "lucide-react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import { newsAPI } from "../../api/news.api";
import defaultImage from "../../assets/default.jpg";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await newsAPI.getActive({ limit: 20 });
      const data = res.data.data || res.data || [];
      setNews(data);
    } catch (err) {
      console.error("Lỗi tải tin tức:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="animate-fade-in">
            <h1 className="mb-8 text-4xl font-bold text-center text-gray-900">
              Tin tức & Blog
            </h1>
            
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#FF7E5F] rounded-full animate-spin"></div>
              </div>
            ) : news.length === 0 ? (
              <div className="py-20 text-center text-gray-500">
                <p>Chưa có tin tức nào</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {news.map((item, index) => (
                  <article
                    key={item.id || item._id}
                    onClick={() => navigate(`/tin-tuc/${item.slug}`)}
                    className="overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image || item.thumbnail || defaultImage}
                        alt={item.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(item.createdAt || item.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {item.views || 0} lượt xem
                        </span>
                      </div>
                      <h2 className="mb-3 text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-[#FF7E5F] transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {item.summary || item.description || "Không có mô tả"}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NewsPage;
