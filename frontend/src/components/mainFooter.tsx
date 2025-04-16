import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

const MainFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      {/* 主要内容区域 */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 公司信息 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">科頂設計</h3>
            <p className="text-gray-600 text-sm mb-4">
              將功能性與美學完美結合，打造符合您需求的理想空間。
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-rose-50 hover:bg-rose-100 p-2 rounded-full transition-colors"
              >
                <Facebook size={16} className="text-rose-600" />
              </a>
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-rose-50 hover:bg-rose-100 p-2 rounded-full transition-colors"
              >
                <Instagram size={16} className="text-rose-600" />
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">快速連結</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/" className="text-gray-600 hover:text-rose-600 transition-colors text-sm">
                首頁
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-rose-600 transition-colors text-sm">
                關於我們
              </Link>
              <Link href="/services" className="text-gray-600 hover:text-rose-600 transition-colors text-sm">
                服務項目
              </Link>
              <Link href="/gallery" className="text-gray-600 hover:text-rose-600 transition-colors text-sm">
                作品集
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-rose-600 transition-colors text-sm">
                聯絡我們
              </Link>
            </div>
          </div>

          {/* 联络信息 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">聯絡資訊</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin size={16} className="text-rose-600 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm">新北市新莊區頭興街1之22號4樓</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="text-rose-600 mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm">0928-220-153</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="text-rose-600 mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm">cdw1217com@yahoo.com.tw</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 版权声明 */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-6 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} 可京設計. 版權所有
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;