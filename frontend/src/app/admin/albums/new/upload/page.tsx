"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/adminNav';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, Image as ImageIcon, Check, X, Loader2 } from 'lucide-react';

export default function NewAlbumWithUploadPage() {
  const [formData, setFormData] = useState({
    album_name: '',
    label: 'house',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: 创建相册, 2: 上传图片
  const [newAlbumId, setNewAlbumId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // 检查是否已登录
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  // 当选择文件发生变化时，创建预览URL
  useEffect(() => {
    // 清理旧的预览URL
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    // 创建新的预览URL
    const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
    
    // 清理函数
    return () => {
      newPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

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
        setNewAlbumId(data.id);
        setStep(2); // 进入上传图片步骤
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

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // 转换为数组并保存
    const filesArray = Array.from(files);
    setSelectedFiles(filesArray);
  };

  const handleFileRemove = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!newAlbumId || selectedFiles.length === 0) return;
    
    try {
      setIsUploading(true);
      setUploadSuccess(false);
      const token = localStorage.getItem('admin_token');
      
      // 上传多个文件
      let uploadedCount = 0;
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('album_id', String(newAlbumId));
        formData.append('description', '');
        
        const response = await fetch(`${API_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        if (response.ok) {
          uploadedCount++;
          setUploadProgress(Math.round((uploadedCount / selectedFiles.length) * 100));
        } else {
          console.error('上传图片失败:', await response.text());
        }
      }
      
      if (uploadedCount === selectedFiles.length) {
        setUploadSuccess(true);
      }
    } catch (error) {
      console.error('上传图片出错:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinish = () => {
    router.push(`/admin/albums/${newAlbumId}`);
  };

  const handleSkip = () => {
    router.push('/admin/albums');
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
            <h1 className="text-3xl font-bold text-gray-900">創建相冊並上傳圖片</h1>
            <p className="mt-2 text-gray-600">創建新相冊並立即上傳圖片，快速完成操作。</p>
          </div>
          
          {/* 步骤指示器 */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`h-1 flex-1 mx-2 ${
                step >= 2 ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm font-medium text-gray-700">創建相冊</span>
              <span className="text-sm font-medium text-gray-700">上傳圖片</span>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          {step === 1 && (
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
                      創建相冊並繼續
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
          
          {step === 2 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">上傳圖片到新相冊</h2>
              
              {!uploadSuccess ? (
                <>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={handleFileSelect}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                      multiple
                    />
                    
                    {selectedFiles.length === 0 ? (
                      <>
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">點擊或拖放文件到此處上傳</p>
                        <p className="text-sm text-gray-500">支持 JPG, PNG, GIF 格式的圖片</p>
                      </>
                    ) : (
                      <>
                        <p className="text-blue-600 font-medium mb-4">已選擇 {selectedFiles.length} 張圖片</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                          {previewUrls.map((url, index) => (
                            <div key={index} className="relative aspect-square w-full">
                              <img 
                                src={url} 
                                alt={`Preview ${index}`} 
                                className="w-full h-full object-cover rounded-md"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFileRemove(index);
                                }}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center aspect-square w-full cursor-pointer hover:border-blue-500 transition-colors"
                            onClick={handleFileSelect}
                          >
                            <Upload className="w-8 h-8 text-gray-400" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {isUploading && (
                    <div className="mb-6">
                      <div className="h-2 bg-gray-200 rounded-full mb-2">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">正在上傳...</p>
                        <p className="text-sm font-medium text-gray-700">{uploadProgress}%</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <button
                      onClick={handleSkip}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      稍後再上傳
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={selectedFiles.length === 0 || isUploading}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          上傳中...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          上傳圖片
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">上傳成功！</h3>
                  <p className="text-gray-600 mb-6">所有圖片已成功上傳到您的新相冊。</p>
                  <button
                    onClick={handleFinish}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    查看相冊
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">提示</h3>
            <p className="text-sm text-blue-600">
              創建相冊後，您可以繼續上傳圖片並設置封面圖片。相冊將根據您選擇的類型顯示在相應的前台頁面中。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 