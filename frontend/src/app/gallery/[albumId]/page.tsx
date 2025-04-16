"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchAlbumWithImages } from "@/app/api/galleryService";
import { EmptyState } from "@/components/ui/emptyState";
import { Skeleton } from "@/components/ui/skeleton";
import MainNav from "@/components/mainNav";
import MainFooter from "@/components/mainFooter";

export default function AlbumDetailPage() {
  const params = useParams();
  const albumId = params.albumId as string;
  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadAlbum = async () => {
      try {
        const data = await fetchAlbumWithImages(parseInt(albumId, 10));
        setAlbum(data);
      } catch (error) {
        console.error("获取相册详情失败:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAlbum();
  }, [albumId]);

  // 打开灯箱
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
  };

  // 关闭灯箱
  const closeLightbox = () => {
    setLightboxOpen(false);
    // 恢复背景滚动
    document.body.style.overflow = 'auto';
  };

  // 显示上一张图片
  const showPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!album || !album.images || album.images.length === 0) return;
    setCurrentImageIndex((prevIndex) => 
      (prevIndex > 0) ? prevIndex - 1 : album.images.length - 1
    );
  };

  // 显示下一张图片
  const showNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!album || !album.images || album.images.length === 0) return;
    setCurrentImageIndex((prevIndex) => 
      (prevIndex < album.images.length - 1) ? prevIndex + 1 : 0
    );
  };

  // 键盘操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          setCurrentImageIndex((prevIndex) => 
            (prevIndex > 0) ? prevIndex - 1 : (album?.images?.length || 1) - 1
          );
          break;
        case 'ArrowRight':
          setCurrentImageIndex((prevIndex) => 
            (prevIndex < (album?.images?.length || 1) - 1) ? prevIndex + 1 : 0
          );
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, album]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <MainNav />
      <main className="flex-grow container mx-auto mt-12 px-4 py-8">
        <div className="mb-8">
          <Link href="/gallery" className="inline-flex items-center text-blue-600 hover:text-blue-800 bg-white px-4 py-2 rounded-full shadow-sm transition-all hover:shadow-md">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回相冊列表
          </Link>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="h-8 w-1/3">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="aspect-square">
                  <Skeleton className="h-full w-full rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ) : !album ? (
          <EmptyState
            title="未找到相冊"
            description="無法找到指定的相冊，可能已被刪除或不存在"
          />
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h1 className="text-3xl font-bold mb-2">{album.album_name}</h1>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {album.label === 'business' ? '商業案例' : '住宅案例'}
                </span>
                {album.description && (
                  <p className="ml-3 text-gray-600">
                    {album.description}
                  </p>
                )}
              </div>
            </div>

            {album.images && album.images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {album.images.map((image: any, index: number) => (
                  <div 
                    key={image.id} 
                    className="aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg group"
                    onClick={() => openLightbox(index)}
                  >
                    <div className="relative h-full w-full overflow-hidden">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/images/${image.id}/file`}
                        alt={image.image_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4 w-full">
                          <h3 className="text-white text-sm font-medium truncate">{image.image_name}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="暂无图片"
                description="此相册中还没有任何图片。"
              />
            )}

            {/* 灯箱 */}
            {lightboxOpen && album.images && album.images.length > 0 && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
                onClick={closeLightbox}
              >
                <button 
                  className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 p-2 rounded-full z-[60]"
                  onClick={closeLightbox}
                >
                  <X className="h-6 w-6" />
                </button>
                
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-3 rounded-full text-white hover:bg-opacity-70 transition-all z-[60]"
                  onClick={showPrevImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </button>
                
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-3 rounded-full text-white hover:bg-opacity-70 transition-all z-[60]"
                  onClick={showNextImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
                
                <div className="max-w-[90vw] max-h-[85vh] relative">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/api/images/${album.images[currentImageIndex].id}/file`}
                    alt={album.images[currentImageIndex].image_name}
                    className="max-w-full max-h-[85vh] object-contain"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 backdrop-blur-sm text-white p-4 text-center">
                    <h3 className="text-lg font-medium">
                      {album.images[currentImageIndex].description || album.images[currentImageIndex].image_name}
                    </h3>
                    <div className="text-sm text-gray-300 mt-1">
                      {currentImageIndex + 1} / {album.images.length}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <MainFooter />
    </div>
  );
} 