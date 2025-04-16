"use client"

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { fetchAllAlbumsWithImages, Album, Image as ImageType } from '@/app/api/galleryService';
import Link from 'next/link';
import MainNav from '@/components/mainNav';
import MainFooter from '@/components/mainFooter';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/emptyState';
import { FileQuestion } from 'lucide-react';

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<string>('business');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAlbums = async (label?: string) => {
    setLoading(true);
    try {
      console.log('正在获取相册，标签:', label);
      const albumsData = await fetchAllAlbumsWithImages(label);
      console.log('获取到的相册数据:', albumsData);
      setAlbums(albumsData);
    } catch (error) {
      console.error('获取相册失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums(activeTab);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-grow container mx-auto mt-12 px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">精選作品集</h1>
        
        <Tabs 
          defaultValue="business" 
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full max-w-2xl mx-auto mb-8"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="business">商業空間</TabsTrigger>
            <TabsTrigger value="house">居家空間</TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="h-5 bg-gray-200 animate-pulse w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : albums.length === 0 ? (
          <EmptyState 
            icon={FileQuestion}
            title="暫無相冊" 
            description="當前分類下沒有相冊，請稍後再試。" 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Link href={`/gallery/${album.id}`} key={album.id}>
                <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="h-48 relative overflow-hidden">
                    {album.images && album.images.length > 0 ? (
                      <div className="h-full w-full relative">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}/${album.images[0].object_name}`}
                          alt={album.album_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">暫無圖片</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg">{album.album_name}</h3>
                    <p className="text-sm text-gray-500">{album.images?.length || 0} 張圖片</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      <MainFooter />
    </div>
  );
} 