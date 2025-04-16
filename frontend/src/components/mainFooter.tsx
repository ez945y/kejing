import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

const MainFooter = () => {
  return (
    <footer className="bg-white">
      {/* Gradient divider */}
      <div className="h-0.5 w-full bg-gradient-to-r from-rose-400 via-rose-600 to-amber-500"></div>
      
      {/* Main content area */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Social links */}
          <div className="flex space-x-3">
            <a 
              href="https://www.facebook.com/profile.php?id=100000361185563" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-50 hover:bg-rose-50 p-2 rounded-lg transition-all duration-300"
            >
              <Facebook size={18} className="text-gray-600 hover:text-rose-600" />
            </a>
            <a 
              href="https://www.instagram.com/corking_space/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-50 hover:bg-rose-50 p-2 rounded-lg transition-all duration-300"
            >
              <Instagram size={18} className="text-gray-600 hover:text-rose-600" />
            </a>
          </div>

          {/* Company info */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">可京設計</h3>
            <p className="text-gray-600 text-sm">
              將功能性與美學完美結合，打造符合您需求的理想空間。
            </p>
          </div>

          {/* Contact info */}
          <div className="space-y-2">
            <div className="flex items-center">
              <MapPin size={16} className="text-rose-600 mr-2 flex-shrink-0" />
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
      
      {/* Copyright bar */}
      <div className="py-3 border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <span className="text-gray-400 text-xs">
            © {new Date().getFullYear()} 可京設計. 版權所有
          </span>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;