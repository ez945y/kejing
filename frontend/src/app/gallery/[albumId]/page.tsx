"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/gallery" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回相簿列表
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
            title="未找到相册"
            description="无法找到指定的相册，可能已被删除或不存在。"
          />
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">{album.album_name}</h1>
            <p className="text-gray-600 mb-8">
              {album.description || `${album.label === 'business' ? '商业案例' : '住宅案例'}`}
            </p>

            {album.images && album.images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {album.images.map((image: any) => (
                  <div key={image.id} className="aspect-square rounded-lg overflow-hidden">
                    <div className="relative h-full w-full">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${image.object_name}`}
                        alt={image.image_name}
                        className="w-full h-full object-cover"
                      />
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
          </>
        )}
      </main>
      <MainFooter />
    </div>
  );
} 