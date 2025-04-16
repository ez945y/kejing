"use client"
import Image from "next/image";
import Link from "next/link";
import MainNav from "@/components/mainNav";
import MainFooter from "@/components/mainFooter";
import {Button} from "@/components/ui/button";
import { use } from "react";


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

      <section className="max-w-7xl flex flex-col justify-center p-1 md:px-10 mx-auto sm:pt-10 lg:flex-row lg:justify-between items-start">
        <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left leading-snug">
          <h1 className="text-5xl font-bold sm:text-6xl">
              <span className="text-rose-600">可京</span> 室內裝修
            </h1>
            <p className="mt-6 mb-8 text-lg sm:mb-12 leading-snug">
            以人因做設計的基礎，運用節能和智能觀念，配合健康和安全建材，是我們無限追求的設計和裝修目標。
            致力創造一個美好，幸福，健康的居家環境
            </p>{" "}
            <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start ">
              <Link href="/cases">
                <Button className="">查看服務項目</Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-80 xl:h-112 2xl:h-128 fade-in">
            <Image
              src="/images/mike.png"
              alt=""
              height={400}
              width={400}
              className="rounded-sm"
            />
          </div>
        </section>

        <section className="md:container px-2 mx-auto space-y-20 lg:space-y-36">
          <div className="flex flex-col max-w-xl mx-auto overflow-hidden rounded-md lg:max-w-full lg:flex-row min-h-96">
            <div className="flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-80 xl:h-112 2xl:h-128 fade-in">
              <Image
                src="/images/dragon.png"
                alt=""
                height={400}
                width={400}
                className="rounded-sm"
              />
            </div>
            <div className="sm:mt-6 lg:mt-6 flex flex-col justify-center flex-1 px-6 lg:flex-2 ">
              <span className="mb-2 text-xs tracking-widest uppercase text-rose-600">
                Make you feel all good
              </span>
              <h2 className="text-3xl font-bold">
                老口碑，服務周道
              </h2>
              <p className="mt-6 mb-8 text-lg sm:mb-12 leading-snug">
                可京全方位技術團隊不單只是工程統包公司，我們以接近三十年的工作經驗，在所有裝修主力工程，以自有工班和原物料採購，給客人提供最佳的施工技術品質，和服務態度。
              </p>
            </div>
          </div>
        </section>


      {/* banner section */}
      <section className="py-6 bg-rose-600 text-gray-50 mt-14">
        <div className="container justify-center p-4 mx-auto space-y-8 md:p-10 lg:space-y-0 lg:space-x-12 lg:justify-around lg:flex lg:flex-row">
          <div className="flex flex-col space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold leading-none">
              Follow on github for more project updates
            </h2>
            <p className="px-4 text-lg lg:px-0">
              {" "}
              When I add something new, you will be the first to know{" "}
            </p>
          </div>
          <div className="flex flex-row items-center self-center justify-center flex-shrink-0 lg:justify-end">
            <Link href="https://github.com/siddhartha-up80">
              <Button
                variant="outline"
                size="lg"
                className="text-black dark:text-white"
              >
                Github
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="p-6 my-6 mt-16">
        <div className="container grid grid-cols-1 gap-6 mx-auto sm:grid-cols-2 xl:grid-cols-4">
          <FeatureCard iconType="components" number="150+" text="Components" />
          <FeatureCard iconType="categories" number="30+" text="Categories" />
          <FeatureCard iconType="compatibility" number="100%" text="Next.js 14 Compatible" />
          <FeatureCard iconType="copyPaste" number="100%" text="Copy Paste work" />
        </div>
      </section>

      {/* faq section */}
      <section className="mt-14 md:max-w-[70vw] mx-auto">
        <div className="container flex flex-col justify-center px-4 py-8 mx-auto md:p-8">
          <h2 className="text-2xl font-semibold sm:text-4xl">
            常見Q&A
          </h2>
          <p className="mt-4 mb-8 ">
            這裡是我們常見的QA集，如果您有任何問題，歡迎來問我們，我們會盡快回覆您。
          </p>
          <div className="space-y-4">
            <details className="w-full border rounded-lg">
              <summary className="px-4 py-6 focus:outline-none focus-visible:ri">
              陳一太是誰?
              </summary>
              <p className="px-4 py-6 pt-0 ml-4 -mt-4 ">
               輔仁大學景觀設計系大三，有種樹經驗，會泡茶跟挖耳朵{" "}
              </p>
            </details>
            <details className="w-full border rounded-lg">
              <summary className="px-4 py-6 focus:outline-none focus-visible:ri">
              陳可是誰?
              </summary>
              <p className="px-4 py-6 pt-0 ml-4 -mt-4 ">
                陳一太的父親，腦袋不太好{" "}
              </p>
            </details>
            <details className="w-full border rounded-lg">
              <summary className="px-4 py-6 focus:outline-none focus-visible:ri">
                陳一心是誰?
              </summary>
              <p className="px-4 py-6 pt-0 ml-4 -mt-4 ">
                陳一太的姐姐，{" "}
              </p>
            </details>
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
    <div className="flex p-4 space-x-4 rounded-lg md:space-x-6">
      <div className="flex justify-center p-2 align-middle rounded-lg sm:p-4 bg-rose-600">
        <SVGIcon type={iconType} />
      </div>
      <div className="flex flex-col justify-center align-middle">
        <p className="text-3xl font-semibold">{number}</p>
        <p className="capitalize">{text}</p>
      </div>
    </div>
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
          viewBox="0 0 512 512"
          fill="currentColor"
          className="h-9 w-9 text-gray-100"
        >
          <path d="M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z"></path>
          <path d="M256,384A104,104,0,0,0,360,280H152A104,104,0,0,0,256,384Z"></path>
          <polygon points="205.757 228.292 226.243 203.708 168 155.173 109.757 203.708 130.243 228.292 168 196.827 205.757 228.292"></polygon>
          <polygon points="285.757 203.708 306.243 228.292 344 196.827 381.757 228.292 402.243 203.708 344 155.173 285.757 203.708"></polygon>
        </svg>
      );
    case "categories":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="currentColor"
          className="h-9 w-9 text-gray-100"
        >
          <path d="M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z"></path>
          <path d="M256,384A104,104,0,0,0,360,280H152A104,104,0,0,0,256,384Z"></path>
          <polygon points="205.757 228.292 226.243 203.708 168 155.173 109.757 203.708 130.243 228.292 168 196.827 205.757 228.292"></polygon>
          <polygon points="285.757 203.708 306.243 228.292 344 196.827 381.757 228.292 402.243 203.708 344 155.173 285.757 203.708"></polygon>
        </svg>
      );
    case "compatibility":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="currentColor"
          className="h-9 w-9 text-gray-100"
        >
          <path d="M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z"></path>
          <path d="M256,384A104,104,0,0,0,360,280H152A104,104,0,0,0,256,384Z"></path>
          <polygon points="205.757 228.292 226.243 203.708 168 155.173 109.757 203.708 130.243 228.292 168 196.827 205.757 228.292"></polygon>
          <polygon points="285.757 203.708 306.243 228.292 344 196.827 381.757 228.292 402.243 203.708 344 155.173 285.757 203.708"></polygon>
        </svg>
      );
    case "copyPaste":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="currentColor"
          className="h-9 w-9 text-gray-100"
        >
          <path d="M256,16C123.452,16,16,123.452,16,256S123.452,496,256,496,496,388.548,496,256,388.548,16,256,16ZM403.078,403.078a207.253,207.253,0,1,1,44.589-66.125A207.332,207.332,0,0,1,403.078,403.078Z"></path>
          <path d="M256,384A104,104,0,0,0,360,280H152A104,104,0,0,0,256,384Z"></path>
          <polygon points="205.757 228.292 226.243 203.708 168 155.173 109.757 203.708 130.243 228.292 168 196.827 205.757 228.292"></polygon>
          <polygon points="285.757 203.708 306.243 228.292 344 196.827 381.757 228.292 402.243 203.708 344 155.173 285.757 203.708"></polygon>
        </svg>
      );
    default:
      return null;
  }
};
