"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminNav from '@/components/adminNav';
import { 
  ArrowLeft, 
  Upload, 
  Plus, 
  Trash2, 
  Info, 
  XCircle, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface Album {
  id: number;
  album_name: string;
  label: 'business' | 'house';
  description: string | null;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}

interface AlbumImage {
  id: number;
  image_name: string;
  object_name: string;
  description: string | null;
  album_id: number;
  created_at: string;
  updated_at: string;
}

export default function AlbumDetailPage() {
  const [album, setAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<AlbumImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<null | 'success' | 'error'>(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const albumId = params.albumId as string;

  useEffect(() => {
    // 检查是否已登录
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchAlbumDetails();
  }, [router, albumId]);

  const fetchAlbumDetails = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('admin_token');
      
      // 获取相册信息
      const albumResponse = await fetch(`${API_URL}/api/albums/${albumId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!albumResponse.ok) {
        throw new Error('相册不存在或无法访问');
      }
      
      const albumData = await albumResponse.json();
      setAlbum(albumData);
      
      // 获取相册中的图片
      const imagesResponse = await fetch(`${API_URL}/api/albums/${albumId}/images`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        setImages(imagesData);
      }
    } catch (error) {
      console.error('获取相册详情失败', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setUploadStatus(null);
      setUploadMessage('');
      
      const token = localStorage.getItem('admin_token');
      
      // 上传多个文件
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('album_id', albumId);
        formData.append('description', '');
        
        const response = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        if (response.ok) {
          const newImage = await response.json();
          setImages(prev => [...prev, newImage]);
          setUploadStatus('success');
          setUploadMessage(`成功上传 ${files.length} 张图片`);
        } else {
          setUploadStatus('error');
          setUploadMessage('上传图片失败，请重试');
          break;
        }
      }
    } catch (error) {
      console.error('上传图片出错', error);
      setUploadStatus('error');
      setUploadMessage('上传过程中发生错误');
    } finally {
      setIsUploading(false);
      // 清空文件选择，以便再次选择相同文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteClick = (imageId: number) => {
    setSelectedImageId(imageId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedImageId === null) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/images/${selectedImageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // 从列表中移除
        setImages(images.filter(image => image.id !== selectedImageId));
        setDeleteModalOpen(false);
        setSelectedImageId(null);
      } else {
        console.error('删除图片失败');
      }
    } catch (error) {
      console.error('删除图片出错', error);
    }
  };

  const handleSetCoverImage = async (imageId: number) => {
    if (!album) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/albums/${album.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cover_image: String(imageId)
        })
      });
      
      if (response.ok) {
        // 更新本地相册信息
        setAlbum({
          ...album,
          cover_image: String(imageId)
        });
      } else {
        console.error('设置封面图片失败');
      }
    } catch (error) {
      console.error('设置封面图片出错', error);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="pt-16 flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <Info className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">相册不存在</h3>
            <p className="text-gray-600 mb-6">无法找到该相册或您没有权限访问。</p>
            <Link href="/admin/albums">
              <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回相册列表
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* 标题和导航 */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link href="/admin/albums">
                <div className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  返回相册列表
                </div>
              </Link>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{album.album_name}</h1>
                <p className="mt-2 text-gray-600">
                  {album.label === 'business' ? '商业案例' : '住宅案例'} · 創建於 {formatDate(album.created_at)}
                </p>
                {album.description && (
                  <p className="mt-2 text-gray-700">
                    {album.description}
                  </p>
                )}
              </div>
              <button
                onClick={handleUploadClick}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                上傳圖片
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                multiple
              />
            </div>
          </div>
          
          {/* 上传状态消息 */}
          {uploadStatus && (
            <div className={`mb-6 p-4 rounded-lg flex items-center ${
              uploadStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {uploadStatus === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 mr-2" />
              )}
              {uploadMessage}
            </div>
          )}
          
          {/* 图片上传中状态 */}
          {isUploading && (
            <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg flex items-center">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              正在上传图片，请稍候...
            </div>
          )}
          
          {/* 图片列表 */}
          {images.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <Upload className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">相册中没有图片</h3>
              <p className="text-gray-600 mb-6">点击上传按钮添加第一张图片到这个相册。</p>
              <button
                onClick={handleUploadClick}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                上传图片
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((image) => (
                <div 
                  key={image.id} 
                  className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group 
                    ${String(album.cover_image) === String(image.id) ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className="h-48 bg-gray-200 relative">
                    <img 
                      src={`${API_URL}/api/images/${image.id}/file`}
                      alt={image.image_name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        {String(album.cover_image) !== String(image.id) && (
                          <button
                            onClick={() => handleSetCoverImage(image.id)}
                            className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
                            title="设为封面"
                          >
                            <Info className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteClick(image.id)}
                          className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                          title="删除图片"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    {String(album.cover_image) === String(image.id) && (
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-md">
                        封面图片
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 truncate" title={image.image_name}>
                      {image.image_name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      上传于 {formatDate(image.created_at)}
                    </p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">确认删除</h3>
            <p className="text-gray-600 mb-6">
              您确定要删除这张图片吗？此操作无法撤销。
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
                删除
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 右下角固定上传按钮 */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleUploadClick}
          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
} 