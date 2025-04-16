"use client";
import { useRouter, useSearchParams } from 'next/navigation'
import MainNav from "@/components/mainNav";
import MainFooter from "@/components/mainFooter";
import {AlbumGrid} from '../cases/album_grid';

const AlbumDetail = () => {
  const router = useRouter();
  const getParams = useSearchParams();
  const title = getParams.get("title") || "";

  const backToFormerPage = () =>{
    router.back()
  }
  
  
  return (
    <div className='wrapper'>
    <MainNav/>
    <div className='flex-1'>
      <div className="mt-16">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <button onClick={backToFormerPage}>
        <img src="/images/go-back-arrow.png" alt="Back" style={{ width: '20px', height: '20px' }} />
      </button>
      <h1 className="text-center text-4xl mt-8 mb-8 ml-8">{title}</h1>
    </div>
            <AlbumGrid title={title} />
        </div>
        </div>
    <MainFooter/>
    </div>
  );
};
export default AlbumDetail;
