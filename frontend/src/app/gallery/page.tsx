"use client"

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { fetchAllAlbumsWithImages, Album, Image as ImageType } from '@/app/api/galleryService';
import Link from 'next/link';
import MainNav from '@/components/mainNav';
import MainFooter from '@/components/mainFooter';
import { Button } from "@/components/ui/button";

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<string>('business');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const data = await fetchAllAlbumsWithImages(activeTab);
        setAlbums(data);
      } catch (error) {
        console.error('Error fetching albums:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [activeTab]);

  const renderAlbumCards = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden border border-gray-200">
              <div className="h-[200px] w-full bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <div className="h-5 w-3/4 mb-2 bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (albums.length === 0) {
      return (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium">暂无相册</h3>
          <p className="text-gray-500 mt-2">当前分类下没有相册，请稍后再试。</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <Link key={album.id} href={`/gallery/${album.id}`}>
            <div className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300">
              {album.images && album.images.length > 0 ? (
                <div className="relative h-[200px]">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}/api/images/${album.images[0].id}/file`}
                    alt={album.album_name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="bg-gray-200 h-[200px] flex items-center justify-center">
                  <p className="text-gray-500">无图片</p>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-medium">{album.album_name}</h3>
                <p className="text-sm text-gray-500">
                  {album.images ? `${album.images.length} 张图片` : '0 张图片'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <>
      <MainNav />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">精选作品集</h1>
        
        <Tabs 
          defaultValue="business" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full max-w-2xl mx-auto mb-12"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="business">商業空間</TabsTrigger>
            <TabsTrigger value="house">居家空間</TabsTrigger>
          </TabsList>
        </Tabs>

        {renderAlbumCards()}
      </main>
      <MainFooter />
    </>
  );
} 