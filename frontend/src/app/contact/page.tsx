"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MainNav from "@/components/mainNav";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { submitContactForm } from "@/app/api/contactApi";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // 调用API发送联系表单数据
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });
      
      setSubmitStatus("success");
      // 重置表单
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("提交表单失败:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MainNav />
      <main className="min-h-screen pt-20 pb-16">
        {/* 页面标题 */}
        <section className="relative bg-gradient-to-r from-rose-50 to-stone-50 dark:from-gray-900 dark:to-gray-800 py-12 md:py-16 overflow-hidden">
          <div className="absolute -left-20 bottom-0 w-60 h-60 bg-rose-200 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -right-20 top-0 w-80 h-80 bg-amber-200 rounded-full opacity-30 blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">聯絡我們</h1>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                無論是裝修諮詢、報價要求還是其他合作提案，請隨時聯絡我們。我們的專業團隊隨時準備為您提供協助。
              </p>
            </div>
          </div>
        </section>

        {/* 联系信息和表单 */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* 左侧：联系信息 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 md:p-10">
                <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">聯絡資訊</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-rose-100 dark:bg-rose-900 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-rose-600 dark:text-rose-300" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">地址</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">新北市新莊區頭興街1之22號4樓</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-rose-100 dark:bg-rose-900 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-rose-600 dark:text-rose-300" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">電話</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">0928-220-153</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-rose-100 dark:bg-rose-900 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-rose-600 dark:text-rose-300" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">電子郵件</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">cdw1217com@yahoo.com.tw</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-rose-100 dark:bg-rose-900 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-rose-600 dark:text-rose-300" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">營業時間</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">週一至週五: 08:00 - 17:00</p>
                      <p className="text-gray-600 dark:text-gray-300">週六、週日: 休息</p>
                    </div>
                  </div>
                </div>
                
                {/* 地图 */}
                <div className="mt-10 h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.439802915028!2d121.45924157837786!3d25.0530784803146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a88bb85f5021%3A0x3c1297ec72653151!2zMjQy5paw5YyX5biC5paw6I6K5Y2A6aCt6IiI6KGXMS0xM-iZnw!5e0!3m2!1szh-TW!2stw!4v1744779800280!5m2!1szh-TW!2stw" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                  </iframe>
                </div>
              </div>
              
              {/* 右侧：联系表单 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 md:p-10">
                <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">傳送訊息</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 姓名 */}
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名 <span className="text-rose-500">*</span></Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="請輸入您的姓名" 
                      required 
                    />
                  </div>
                  
                  {/* 邮箱 */}
                  <div className="space-y-2">
                    <Label htmlFor="email">電子郵件 <span className="text-rose-500">*</span></Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="請輸入您的電子郵件" 
                      required 
                    />
                  </div>
                  
                  {/* 电话 */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">電話</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="請輸入您的電話號碼" 
                    />
                  </div>
                  
                  {/* 消息 */}
                  <div className="space-y-2">
                    <Label htmlFor="message">訊息內容 <span className="text-rose-500">*</span></Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      placeholder="請輸入您的訊息內容" 
                      rows={5} 
                      required 
                    />
                  </div>
                  
                  {/* 提交按钮 */}
                  <Button 
                    type="submit" 
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white py-6 text-lg font-medium rounded-lg transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        處理中...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Send className="mr-2 h-5 w-5" />
                        傳送訊息
                      </span>
                    )}
                  </Button>
                  
                  {/* 提交状态 */}
                  {submitStatus === "success" && (
                    <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                      訊息已成功傳送！我們會盡快回覆您。
                    </div>
                  )}
                  
                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                      傳送失敗，請稍後再試或直接使用其他聯絡方式。
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ部分 */}
        <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">常見問題</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                我們整理了一些客戶常見的問題，希望能幫助您更快地找到答案。
              </p>
            </div>
            
            <div className="space-y-6">
              <FaqItem 
                question="如何預約免費諮詢？" 
                answer="您可以透過我們的聯絡表單、電子郵件或撥打我們的電話來預約免費諮詢。我們的客服人員會根據您的需求安排適當的時間。" 
              />
              <FaqItem 
                question="初次諮詢需要準備哪些資料？" 
                answer="初次諮詢時，建議您準備房屋的平面圖(如有)、喜歡的裝修風格參考圖片，以及預算範圍。如果是舊屋翻新，可以提供現場照片，幫助我們更好地了解您的需求。" 
              />
              <FaqItem 
                question="服務地區範圍是哪裡？" 
                answer="我們主要服務台北市、新北市及桃園市區域。其他地區也可提供服務，但可能會有額外的交通和住宿費用。" 
              />
              <FaqItem 
                question="設計及裝修報價如何計算？" 
                answer="設計費根據房屋面積和設計複雜度計算，一般為每坪2,000-5,000元。裝修費用則根據材料選擇、工程難度和面積大小而定，一般基礎裝修約為每坪4-6萬元，中高檔裝修則為每坪6-10萬元。我們會提供詳細的報價明細，確保透明度。" 
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// FAQ项目组件
function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <summary className="flex justify-between items-center p-5 font-semibold cursor-pointer">
        <span>{question}</span>
        <span className="transition-transform duration-200 group-open:rotate-180">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </summary>
      <div className="px-5 pb-5 pt-0">
        <p className="text-gray-600 dark:text-gray-300">{answer}</p>
      </div>
    </details>
  );
} 