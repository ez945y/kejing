"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/adminNav';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewAlbumPage() {
  const [formData, setFormData] = useState({
    album_name: '',
    label: 'house',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // 检查是否已登录
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.album_name.trim()) {
      setError('請輸入相冊名稱');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/albums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        router.push('/admin/albums');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || '創建相冊失敗');
      }
    } catch (error) {
      console.error('創建相冊出錯', error);
      setError('創建相冊時出現錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="pt-16"> {/* 为固定导航栏腾出空间 */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <Link href="/admin/albums" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回相冊列表
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">創建新相冊</h1>
            <p className="mt-2 text-gray-600">填寫以下信息創建一個新的相冊。</p>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="mb-6">
              <label htmlFor="album_name" className="block text-sm font-medium text-gray-700 mb-1">
                相冊名稱 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="album_name"
                name="album_name"
                value={formData.album_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                相冊類型 <span className="text-red-500">*</span>
              </label>
              <select
                id="label"
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="business">商業案例</option>
                <option value="house">住宅案例</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                相冊描述
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    儲存中...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    創建相冊
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">提示</h3>
            <p className="text-sm text-blue-600">
              創建相冊後，您可以上傳圖片並設置封面圖片。相冊將根據您選擇的類型顯示在相應的前台頁面中。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 