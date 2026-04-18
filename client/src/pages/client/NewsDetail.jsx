import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, User, ArrowLeft, Clock, Eye } from "lucide-react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { newsAPI } from "../../api/news.api";
import defaultImage from "../../assets/default.jpg";

const NewsDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDetail();
  }, [slug]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await newsAPI.getBySlug(slug);
      setData(res.data.data || res.data);
    } catch (err) {
      console.error("Lỗi tải chi tiết tin tức:", err);
      // toast.error("Không tìm thấy tin tức");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center pt-40 pb-20">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#FF7E5F] rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-40 pb-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy tin tức</h2>
          <button 
            onClick={() => navigate("/news")}
            className="mt-4 text-[#FF7E5F] hover:underline flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb / Back button */}
            <button 
              onClick={() => navigate("/news")}
              className="flex items-center gap-2 mb-6 text-gray-600 hover:text-[#FF7E5F] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Quay lại tin tức</span>
            </button>

            <article className="animate-fade-in">
              <header className="mb-8">
                <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
                  {data.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(data.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{data.author || "Ban biên tập"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{data.views || 0} lượt xem</span>
                  </div>
                </div>
              </header>

              {data.image_url && (
                <div className="mb-10 overflow-hidden rounded-2xl shadow-sm">
                  <img
                    src={data.image_url || defaultImage}
                    alt={data.title}
                    className="w-full h-auto max-h-[500px] object-cover"
                  />
                </div>
              )}

              {/* Summary box */}
              {data.summary && (
                <div className="p-6 mb-8 italic text-lg leading-relaxed text-gray-700 bg-gray-100 rounded-xl border-l-4 border-[#FF7E5F]">
                  {data.summary}
                </div>
              )}

              {/* Main content */}
              <div 
                className="prose prose-lg max-w-none text-gray-800 leading-relaxed news-content"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />

              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-gray-500 text-sm">
                    © 2025 Sneaker Store. All rights reserved.
                  </div>
                  {/* Social share icons could go here */}
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
      
      <Footer />

      <style jsx>{`
        .news-content p {
          margin-bottom: 1.5rem;
        }
        .news-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
        }
        .news-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1f2937;
        }
        .news-content ul, .news-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .news-content li {
          margin-bottom: 0.5rem;
        }
        .news-content strong {
          color: #111827;
        }
        .news-content img {
          border-radius: 1rem;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
};

export default NewsDetail;
