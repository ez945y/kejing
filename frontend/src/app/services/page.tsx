"use client";

import { useState, useEffect } from "react";
import { fetchAllServices } from "@/app/api/serviceApi";
import MainNav from "@/components/mainNav";
import MainFooter from "@/components/mainFooter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface Service {
  id: number;
  name: string;
  description: string;
  icon: string | null;
}

interface ProcessCardProps {
  number: string;
  title: string;
  description: string;
}

interface ServiceCardProps {
  service: Service;
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getServices = async () => {
      try {
        const data = await fetchAllServices();
        console.log("前台獲取的服務數據:", data);
        setServices(data);
      } catch (error) {
        console.error("获取服务失败:", error);
      } finally {
        setLoading(false);
      }
    };

    getServices();
  }, []);

  return (
    <>
      <MainNav />
      <main className="min-h-screen pt-20 pb-16">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-r from-rose-50 to-stone-50 dark:from-gray-900 dark:to-gray-800 py-20 md:py-28 overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <Image 
              src="/images/pattern.png" 
              alt="Background pattern"
              fill
              className="object-cover"
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-rose-900 dark:from-rose-400 dark:to-rose-600"
            >
              我們的服務項目
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              以人因設計為基礎，運用節能和智能觀念，配合健康和安全建材，
              致力創造美好、幸福、健康的居家環境。
            </motion.p>
          </div>
        </motion.section>

        {/* Services Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10"
              >
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-16 text-center relative"
            >
              <span className="relative inline-block">
                我們的工作流程
                <span className="absolute bottom-0 left-0 w-full h-1 bg-rose-500 rounded-full"></span>
              </span>
            </motion.h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <ProcessCard
                number="01"
                title="需求洽談"
                description="了解客戶需求，預算規劃，提供專業建議"
              />
              <ProcessCard
                number="02"
                title="設計規劃"
                description="提供平面設計，3D效果圖，材料選擇"
              />
              <ProcessCard
                number="03"
                title="施工管理"
                description="專業工班施工，嚴格品質管控，定期進度回報"
              />
              <ProcessCard
                number="04"
                title="完工驗收"
                description="細節檢查，問題修正，完整售後服務"
              />
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-16 bg-gradient-to-r from-rose-600 to-rose-700 text-white"
        >
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold">準備開始您的裝修計劃？</h2>
              <p className="text-rose-100">聯繫我們獲取免費諮詢和報價</p>
            </div>
            <div>
              <Link href="/contact">
                <Button className="bg-white text-rose-600 hover:bg-rose-50 px-8 py-6 rounded-lg text-lg font-medium transition-all shadow-md hover:shadow-lg hover:scale-105">
                  立即聯繫
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
      <MainFooter />
    </>
  );
};

const ServiceCard = ({ service }: ServiceCardProps) => {
  // 定義所有可用的圖標
  const renderIcon = (iconName: string | null) => {
    switch(iconName) {
      case 'lightbulb':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6M12 2v5M4.9 4.9l4.2 4.2M19.1 4.9l-4.2 4.2M2 12h5M17 12h5M4.9 19.1l4.2-4.2M19.1 19.1l-4.2-4.2M12 17v5"></path>
            <circle cx="12" cy="12" r="4"></circle>
          </svg>
        );
      case 'home':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        );
      case 'refresh-cw':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2v6h-6"></path>
            <path d="M3 12a9 9 0 0 1 15-6.7l3 2.7"></path>
            <path d="M3 22v-6h6"></path>
            <path d="M21 12a9 9 0 0 1-15 6.7l-3-2.7"></path>
          </svg>
        );
      case 'smartphone':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12" y2="18"></line>
          </svg>
        );
      case 'tool':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 6.5l4 4a4.5 4.5 0 01-6.36 6.36L5.5 10.23a4.5 4.5 0 016.36-6.36l2.64 2.63"></path>
            <line x1="3" y1="21" x2="21" y2="3"></line>
          </svg>
        );
      case 'settings':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        );
      case 'heart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        );
      case 'star':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        );
      default:
        // 默認圖標
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12" y2="16"></line>
          </svg>
        );
    }
  };

  return (
    <motion.div
      variants={fadeIn}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <div className="p-8">
        <div className="flex items-start space-x-5">
          <div className="relative w-20 h-20 bg-rose-100 dark:bg-rose-900 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-rose-200 dark:group-hover:bg-rose-800 transition-colors duration-300">
            <div className="w-10 h-10 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform duration-300">
              {renderIcon(service.icon)}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-3 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300">{service.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
              <Link href={`/services/${service.id}`}>
                <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center group-hover:translate-x-1 transition-transform duration-300">
                  了解更多
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProcessCard = ({ number, title, description }: ProcessCardProps) => {
  return (
    <motion.div
      variants={fadeIn}
      className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all relative overflow-hidden group"
    >
      <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-xl group-hover:bg-rose-500 transition-colors duration-300">
        {number}
      </div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-rose-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
      <h3 className="text-xl font-bold mb-3 mt-4 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-300">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
      <div className="absolute bottom-0 right-0 w-12 h-12 bg-rose-100 dark:bg-rose-900 rounded-tl-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
        </svg>
      </div>
    </motion.div>
  );
};

export default ServicesPage; 