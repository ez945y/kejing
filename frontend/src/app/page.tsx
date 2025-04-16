"use client"
import Image from "next/image";
import Link from "next/link";
import MainNav from "@/components/mainNav";
import MainFooter from "@/components/mainFooter";
import {Button} from "@/components/ui/button";


export default function Home() {
  return (
    <>
      <MainNav />
      <Main />
      <MainFooter />
    </>
  );
}

function Main() {
  return (
    <main className="mt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-rose-50 to-stone-50 dark:from-gray-900 dark:to-gray-800 py-12 md:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:gap-12">
          <div className="flex flex-col justify-center lg:w-1/2 space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-rose-600">可京</span> 室內裝修
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              以人因做設計的基礎，運用節能和智能觀念，配合健康和安全建材，是我們無限追求的設計和裝修目標。
              致力創造一個美好，幸福，健康的居家環境。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/services">
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-6 rounded-lg text-lg font-medium transition-all shadow-md hover:shadow-lg">
                  查看服務項目
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-rose-600 text-rose-600 hover:bg-rose-50 px-8 py-6 rounded-lg text-lg font-medium transition-all">
                  聯絡我們
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:w-1/2 relative">
            <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
              <Image
                src="/images/mike.png"
                alt="室內設計展示"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xl"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-rose-600 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-amber-400 rounded-full opacity-20 blur-xl"></div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 relative">
              <div className="relative w-full h-[400px] overflow-hidden rounded-xl shadow-xl">
                <Image
                  src="/images/dragon.png"
                  alt="專業團隊"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-xl"
                />
              </div>
              <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-rose-200 dark:bg-rose-900 rounded-xl"></div>
            </div>
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-block px-3 py-1 text-xs font-medium text-rose-600 bg-rose-100 dark:bg-rose-900 rounded-full">
                專業團隊
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                老口碑，服務周道
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                可京全方位技術團隊不單只是工程統包公司，我們以接近三十年的工作經驗，在所有裝修主力工程，以自有工班和原物料採購，給客人提供最佳的施工技術品質，和服務態度。
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 text-rose-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>專業室內設計團隊</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 text-rose-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>自有施工團隊確保品質</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 text-rose-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>可靠的售後服務保障</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">我們的服務</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/services" className="transition-transform hover:scale-105">
              <FeatureCard iconType="components" number="專業設計" text="客製化空間規劃" />
            </Link>
            <Link href="/services" className="transition-transform hover:scale-105">
              <FeatureCard iconType="categories" number="精緻施工" text="高品質裝修工程" />
            </Link>
            <Link href="/services" className="transition-transform hover:scale-105">
              <FeatureCard iconType="compatibility" number="全屋翻新" text="舊屋改造煥然一新" />
            </Link>
            <Link href="/services" className="transition-transform hover:scale-105">
              <FeatureCard iconType="copyPaste" number="智能家居" text="現代化智慧空間" />
            </Link>
          </div>
          <div className="mt-10">
            <Link href="/services">
              <Button variant="outline" className="border-rose-600 text-rose-600 hover:bg-rose-50 px-8 py-2 rounded-lg text-lg font-medium transition-all">
                查看更多服務
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 bg-gradient-to-r from-rose-600 to-rose-700 text-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold">讓我們打造您的理想空間</h2>
            <p className="text-rose-100">立即聯繫我們，開始您的裝修之旅</p>
          </div>
          <div>
            <Link href="/contact">
              <Button className="bg-white text-rose-600 hover:bg-rose-50 px-8 py-6 rounded-lg text-lg font-medium transition-all shadow-md hover:shadow-lg">
                免費諮詢
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">常見問答</h2>
            <p className="text-gray-600 dark:text-gray-400">
              我們整理了客戶最常問的問題，希望能解答您的疑惑
            </p>
          </div>
          <div className="space-y-6">
            <FaqItem 
              question="裝修工程一般需要多長時間？" 
              answer="裝修時間取決於房屋面積和工程複雜度。一般來說，小戶型（40-60平方米）基礎裝修約需30-45天，中型戶（80-120平方米）需45-60天，大戶型（120平方米以上）或複雜設計則需60-90天。我們會根據具體情況提供詳細的時間表。" 
            />
            <FaqItem 
              question="如何確保裝修材料的環保安全？" 
              answer="我們選用具有環保認證的建材，如E0/E1級板材、低VOC塗料、符合國家標準的電線等。所有材料均需通過嚴格的環保檢測，我們也會向業主提供完整的材料清單和品牌信息，確保透明度和安全性。" 
            />
            <FaqItem 
              question="裝修過程中如何控制預算？" 
              answer="我們在項目開始前會提供詳細的預算明細，包括材料費、人工費和設計費等。簽訂合同時會明確付款節點和可能的變更流程。我們也會設立合理的預備金（一般為總預算的5-10%）應對不可預見的情況，並定期向業主報告預算執行情況。" 
            />
            <FaqItem 
              question="如何處理裝修過程中的設計變更？" 
              answer="我們理解裝修過程中可能會有設計調整的需求。對於小型變更，我們會靈活處理；而大型變更則需要簽訂正式的變更單，明確調整的內容、費用和工期影響。我們建議在施工前盡可能確定設計方案，以減少後期變更帶來的時間和成本增加。" 
            />
            <FaqItem 
              question="裝修後有保修服務嗎？" 
              answer="是的，我們提供全面的保修服務。防水工程保修5年，電路和管線保修3年，木作和油漆保修2年，其他項目保修1年。保修期內，我們會及時處理任何質量問題，保修期後我們也提供有償維護服務。" 
            />
            <FaqItem 
              question="如何評估房屋的裝修預算？" 
              answer="裝修預算主要取決於面積、裝修標準和個人需求。基礎裝修（僅包括水電改造、牆面、地面和基本傢俱）約每平方米4000-6000元；中檔裝修（含基礎裝修加品質建材和部分定制傢俱）約每平方米6000-9000元；高檔裝修（全面定制，高端建材和智能家居）則每平方米9000元以上。我們會根據您的需求提供個性化的預算評估。" 
            />
            <FaqItem 
              question="如何選擇適合的裝修風格？" 
              answer="選擇裝修風格應考慮個人喜好、家庭成員需求、預算和房屋特點。我們的設計師會與您詳細溝通，了解您的生活習慣和美學偏好，參考您喜歡的設計案例，結合專業建議，提供最適合您的風格選擇。我們也會製作3D效果圖，幫助您直觀感受設計效果。" 
            />
            <FaqItem 
              question="如何在裝修中實現智能家居功能？" 
              answer="智能家居可分階段實施。基礎階段可預留智能佈線和接口；進階階段可安裝智能照明、溫控系統和智能安防；全面智能化則包括語音控制系統、場景聯動和全屋智能設備互聯。我們會根據您的需求和預算，定制適合的智能家居方案，並確保系統易用性和擴展性。" 
            />
          </div>
        </div>
      </section>
    </main>
  );
}

const FeatureCard = ({
  iconType,
  number,
  text,
}: {
  iconType: "components" | "categories" | "compatibility" | "copyPaste";
  number: string;
  text: string;
}) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all">
      <div className="flex justify-center p-3 w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900 mb-4">
        <SVGIcon type={iconType} />
      </div>
      <h3 className="text-xl font-bold mb-2">{number}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-center">{text}</p>
    </div>
  );
};

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  return (
    <details className="group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <summary className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 cursor-pointer">
        <h3 className="text-lg font-medium">{question}</h3>
        <span className="ml-6 flex-shrink-0 text-rose-600 group-open:rotate-180 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </summary>
      <div className="p-4 pt-0 bg-white dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{answer}</p>
      </div>
    </details>
  );
};

const SVGIcon = ({
  type,
}: {
  type: "components" | "categories" | "compatibility" | "copyPaste";
}) => {
  switch (type) {
    case "components":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-9 w-9 text-rose-600"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      );
    case "categories":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-9 w-9 text-rose-600"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      );
    case "compatibility":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-9 w-9 text-rose-600"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      );
    case "copyPaste":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round" 
          className="h-9 w-9 text-rose-600"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
          <path d="M9 9h6v6H9z"></path>
        </svg>
      );
    default:
      return null;
  }
};
