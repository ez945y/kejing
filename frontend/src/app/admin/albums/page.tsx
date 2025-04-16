"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/adminNav';
import Link from 'next/link';
import { Pencil, Trash2, PlusCircle, Images, Image, Upload } from 'lucide-react';

interface Album {
  id: number;
  album_name: string;
  label: 'business' | 'house';
  description: string | null;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLabel, setSelectedLabel] = useState<'all' | 'business' | 'house'>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // 检查是否已登录
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchAlbums();
  }, [router, selectedLabel]);

  const fetchAlbums = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('admin_token');
      let url = `${API_URL}/api/albums`;
      
      if (selectedLabel !== 'all') {
        url += `?label=${selectedLabel}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAlbums(data);
      } else {
        console.error('獲取相冊失敗');
      }
    } catch (error) {
      console.error('獲取相冊出錯', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (album: Album) => {
    setAlbumToDelete(album);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!albumToDelete) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/albums/${albumToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // 从列表中移除
        setAlbums(albums.filter(album => album.id !== albumToDelete.id));
        setDeleteModalOpen(false);
        setAlbumToDelete(null);
      } else {
        console.error('刪除相冊失敗');
      }
    } catch (error) {
      console.error('刪除相冊出錯', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getImageCount = async (albumId: number) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/albums/${albumId}/images`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.length;
      }
      return 0;
    } catch (error) {
      console.error('獲取圖片數量出錯', error);
      return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="pt-16"> {/* 为固定导航栏腾出空间 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">相冊管理</h1>
              <p className="mt-2 text-gray-600">創建和管理相冊，上傳和整理圖片。</p>
            </div>
            <div className="flex space-x-3">
              <Link href="/admin/albums/new/upload">
                <div className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  快速創建並上傳
                </div>
              </Link>
            </div>
          </div>
          
          {/* 筛选选项 */}
          <div className="mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedLabel('all')}
                className={`px-4 py-2 rounded-md ${selectedLabel === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                所有相冊
              </button>
              <button
                onClick={() => setSelectedLabel('business')}
                className={`px-4 py-2 rounded-md ${selectedLabel === 'business' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                商業案例
              </button>
              <button
                onClick={() => setSelectedLabel('house')}
                className={`px-4 py-2 rounded-md ${selectedLabel === 'house' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                住宅案例
              </button>
            </div>
          </div>
          
          {/* 相册列表 */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : albums.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <Images className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">沒有相冊</h3>
              <p className="text-gray-600 mb-6">還沒有創建任何相冊，點擊下方按鈕創建第一個相冊。</p>
              <div className="flex justify-center space-x-4">
                <Link href="/admin/albums/new/upload">
                  <div className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    <Upload className="w-4 h-4 mr-2" />
                    快速創建並上傳
                  </div>
                </Link>
                <Link href="/admin/albums/new">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    創建新相冊
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <div key={album.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 bg-gray-200 relative">
                    {album.cover_image ? (
                      <img 
                        src={`${API_URL}/api/images/${album.cover_image}/file`} 
                        alt={album.album_name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      album.label === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {album.label === 'business' ? '商業案例' : '住宅案例'}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{album.album_name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {album.description || '無描述'}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        創建於 {formatDate(album.created_at)}
                      </span>
                      <div className="flex space-x-2">
                        <Link href={`/admin/albums/${album.id}`}>
                          <div className="p-1 rounded-full hover:bg-gray-100">
                            <Images className="w-5 h-5 text-gray-600" />
                          </div>
                        </Link>
                        <Link href={`/admin/albums/${album.id}/edit`}>
                          <div className="p-1 rounded-full hover:bg-gray-100">
                            <Pencil className="w-5 h-5 text-gray-600" />
                          </div>
                        </Link>
                        <button 
                          onClick={() => handleDeleteClick(album)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Trash2 className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* 删除确认对话框 */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">確認刪除</h3>
            <p className="text-gray-600 mb-2">
              您確定要刪除相冊 "{albumToDelete?.album_name}" 嗎？
            </p>
            <p className="text-red-600 text-sm mb-6">
              警告：刪除相冊將同時刪除其中的所有圖片，此操作無法撤銷。
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 右下角固定按钮 */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
        <Link href="/admin/albums/new/upload">
          <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-700 transition-colors" title="快速創建並上傳">
            <Upload className="w-6 h-6" />
          </div>
        </Link>
      </div>
    </div>
  );
} 