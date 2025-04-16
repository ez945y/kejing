"use client";

import { useEffect, useState } from "react";
import { fetchAllServices, Service } from "@/app/api/serviceApi";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Home, RefreshCw, Smartphone, Check, ArrowRight } from "lucide-react";
import MainNav from "@/components/mainNav";
import MainFooter from "@/components/mainFooter";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const data = await fetchAllServices();
        setServices(data);
      } catch (error) {
        console.error("加载服务失败:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  // 根据服务名称返回对应的图标
  const getServiceIcon = (serviceName: string) => {
    switch (serviceName) {
      case "專業設計":
        return <Lightbulb className="h-10 w-10 text-white" />;
      case "精緻施工":
        return <Home className="h-10 w-10 text-white" />;
      case "全屋翻新":
        return <RefreshCw className="h-10 w-10 text-white" />;
      case "智能家居":
        return <Smartphone className="h-10 w-10 text-white" />;
      default:
        return <Lightbulb className="h-10 w-10 text-white" />;
    }
  };

  // 服务详细信息
  const serviceDetails = {
    "專業設計": {
      benefits: ["量身打造符合需求的空間規劃", "3D效果圖展示設計成果", "專業色彩與材質搭配建議", "功能與美學兼具的設計方案"],
      description: "我們的設計師團隊擁有豐富的室內設計經驗，能夠根據您的生活習慣、喜好和需求，量身打造適合您的空間。從初步概念到詳細設計，我們全程陪伴，確保每一個細節都符合您的期望。",
      bgColor: "from-rose-500 to-pink-600"
    },
    "精緻施工": {
      benefits: ["自有工班確保施工品質", "嚴選優質建材", "標準化施工流程", "施工進度透明管理"],
      description: "可京擁有專業的施工團隊，嚴格按照設計圖紙和施工標準執行每一個環節。我們注重細節處理，從水電管線到表面裝飾，都力求完美。選用優質建材，確保施工質量和使用壽命。",
      bgColor: "from-amber-500 to-orange-600"
    },
    "全屋翻新": {
      benefits: ["舊屋空間重新規劃", "結構問題專業評估與修復", "老房煥新整體解決方案", "兼顧實用性與美觀性"],
      description: "針對舊房改造，我們提供全方位的翻新服務。從空間重新規劃到老舊設施更換，結構性問題評估與修復，水電重新佈線等。讓老舊空間煥然一新，滿足現代生活需求。",
      bgColor: "from-emerald-500 to-teal-600"
    },
    "智能家居": {
      benefits: ["智能照明控制系統", "家庭安全監控設置", "智能溫控系統", "聲控設備整合"],
      description: "融合現代科技與居家生活，我們提供全面的智能家居解決方案。從基礎的智能照明、安防系統，到高級的自動化場景控制，語音控制系統，讓您的生活更加便利、舒適和安全。",
      bgColor: "from-blue-500 to-indigo-600"
    }
  };

  return (
    <>
      <MainNav />
      <div className="pt-16 bg-[#f8f9fa] min-h-screen">
        {/* 现代化头部区域 */}
        <div className="bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-100/30 to-transparent z-0"></div>
          <div className="absolute -right-20 top-20 w-80 h-80 bg-gradient-to-br from-rose-300/20 to-rose-500/30 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 bottom-10 w-60 h-60 bg-gradient-to-tr from-amber-300/20 to-amber-500/30 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 py-24 relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 text-transparent bg-clip-text">設計您的理想空間</h1>
              <p className="text-gray-700 text-xl md:text-2xl leading-relaxed">
                可京室內設計，集創意、功能與美學於一體，為您提供專業全方位的空間設計與裝修服務，打造符合您個性的完美家居體驗。
              </p>
            </div>
          </div>
          
          <div className="w-full h-24 bg-gradient-to-b from-transparent to-[#f8f9fa]"></div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="h-64 animate-pulse rounded-2xl overflow-hidden border-none shadow-xl">
                  <CardContent className="p-0">
                    <div className="h-full bg-gray-200"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-32">
              {services.map((service, index) => (
                <div key={service.id} className="relative">
                  {/* 背景装饰元素 */}
                  <div className={`absolute -z-10 w-full h-full max-w-5xl mx-auto inset-0 rounded-[3rem] bg-gradient-to-br ${serviceDetails[service.name as keyof typeof serviceDetails]?.bgColor || "from-rose-500 to-pink-600"} opacity-5 blur-3xl transform -rotate-3`}></div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
                    <div className={`${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                      <div className="bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.05)] relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${serviceDetails[service.name as keyof typeof serviceDetails]?.bgColor || "from-rose-500 to-pink-600"}`}></div>
                        
                        <div className={`inline-flex items-center justify-center p-3 rounded-xl mb-6 bg-gradient-to-r ${serviceDetails[service.name as keyof typeof serviceDetails]?.bgColor || "from-rose-500 to-pink-600"}`}>
                          {getServiceIcon(service.name)}
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">{service.name}</h2>
                        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                          {serviceDetails[service.name as keyof typeof serviceDetails]?.description || service.description}
                        </p>
                        
                        <div className="space-y-4">
                          {serviceDetails[service.name as keyof typeof serviceDetails]?.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start group transition-all duration-300 hover:translate-x-2">
                              <div className={`flex-shrink-0 p-1 rounded-full bg-gradient-to-r ${serviceDetails[service.name as keyof typeof serviceDetails]?.bgColor || "from-rose-500 to-pink-600"} mr-3 mt-1`}>
                                <Check className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-gray-700 font-medium">{benefit}</span>
                            </div>
                          ))}
                        </div>
                        
                        <a href="/contact" className="mt-10 inline-flex items-center text-sm font-semibold group">
                          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${serviceDetails[service.name as keyof typeof serviceDetails]?.bgColor || "from-rose-500 to-pink-600"} group-hover:underline`}>了解更多</span>
                          <ArrowRight className={`ml-2 h-4 w-4 text-transparent bg-clip-text bg-gradient-to-r ${serviceDetails[service.name as keyof typeof serviceDetails]?.bgColor || "from-rose-500 to-pink-600"} transition-transform group-hover:translate-x-1`} />
                        </a>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className={`absolute inset-x-8 top-8 bottom-0 rounded-3xl bg-gradient-to-br ${serviceDetails[service.name as keyof typeof serviceDetails]?.bgColor || "from-rose-500 to-pink-600"} opacity-10 transform rotate-3`}></div>
                      <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${serviceDetails[service.name as keyof typeof serviceDetails]?.bgColor || "from-rose-500 to-pink-600"} shadow-xl overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1`}>
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                        <div className="p-12 flex justify-center items-center">
                          <div className="h-52 w-52 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            {getServiceIcon(service.name)}
                          </div>
                        </div>
                        <div className="text-white text-center">
                          <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                          <p className="text-white/80">打造理想空間的第一選擇</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 现代化CTA区域 */}
        <div className="container mx-auto px-4 py-24 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-20 bottom-0 w-80 h-80 bg-gradient-to-br from-rose-500/20 to-pink-600/30 rounded-full blur-3xl"></div>
            <div className="absolute -left-20 top-20 w-60 h-60 bg-gradient-to-tr from-amber-500/20 to-amber-600/30 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 z-0"></div>
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-b from-rose-100/40 to-transparent z-0"></div>
            
            <div className="relative z-10 p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-pink-600 text-transparent bg-clip-text">讓我們開始打造您的夢想空間</h2>
                <p className="text-gray-600 text-lg">
                  我們的專業團隊隨時準備為您提供免費諮詢，了解您的需求和期望，為您量身定制完美的解決方案。
                </p>
              </div>
              
              <a 
                href="/contact" 
                className="px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] whitespace-nowrap"
              >
                立即預約諮詢
              </a>
            </div>
          </div>
        </div>
      </div>
      <MainFooter />
    </>
  );
} 