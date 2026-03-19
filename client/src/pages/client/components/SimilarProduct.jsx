import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productAPI from '@/api/product.api';
import MiniProductCard from './MiniProductCard';
import { CloudCog } from 'lucide-react';

const SimilarProduct = ({ currentProduct }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      const brandId = currentProduct?.brand?.id || currentProduct?.brand_id;
      if (!brandId) return;
      
      try {
        setLoading(true);
        const res = await productAPI.getAll({ 
          brand_id: brandId, 
          limit: 6 
        });
        
        let products = res.data?.data?.data || res.data?.data || [];
      
        products = products.filter(p => {
          const pBrandId = p.brand?.id || p.brand_id;
          return String(pBrandId) === String(brandId) && p.id !== currentProduct.id;
        }).slice(0, 4);
        
        setSimilarProducts(products);
      } catch (error) {
        console.error("Lỗi tải sản phẩm tương tự:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [currentProduct]);

  if (!currentProduct) return null;
  if (loading) return <div className="py-4 text-sm text-center text-gray-500 animate-pulse">Đang tải sản phẩm cùng thương hiệu...</div>;
  if (!similarProducts.length) return null;

  return (
    <div className="p-5 border border-gray-200 shadow-sm rounded-xl bg-gray-50 mt-8 lg:mt-0">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h3 className="text-base font-bold text-gray-800 uppercase">
          Cùng thương hiệu <span className="text-blue-600">{currentProduct.brand?.name}</span>
        </h3>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {similarProducts.map(product => (
          <MiniProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProduct;