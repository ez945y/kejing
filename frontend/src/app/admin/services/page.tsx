"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/adminNav';
import { Pencil, Trash2, PlusCircle, GripVertical, Save } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: ''
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // 检查是否已登录
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchServices();
  }, [router]);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/services`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        console.error('獲取服務失敗');
      }
    } catch (error) {
      console.error('獲取服務出錯', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      name: '',
      description: '',
      icon: ''
    });
    setEditingService(null);
    setIsEditing(true);
    setError('');
  };

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      icon: service.icon || ''
    });
    setEditingService(service);
    setIsEditing(true);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.description.trim()) {
      setError('請填寫所有必填欄位');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const token = localStorage.getItem('admin_token');
      const url = editingService 
        ? `${API_URL}/api/services/${editingService.id}` 
        : `${API_URL}/api/services`;
      
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          order: editingService?.order || services.length
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (editingService) {
          setServices(services.map(service => 
            service.id === editingService.id ? data : service
          ));
        } else {
          setServices([...services, data]);
        }
        
        setIsEditing(false);
        setEditingService(null);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || '儲存服務失敗');
      }
    } catch (error) {
      console.error('儲存服務出錯', error);
      setError('儲存服務時出現錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!serviceToDelete) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/services/${serviceToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // 从列表中移除
        setServices(services.filter(service => service.id !== serviceToDelete.id));
        setDeleteModalOpen(false);
        setServiceToDelete(null);
      } else {
        console.error('刪除服務失敗');
      }
    } catch (error) {
      console.error('刪除服務出錯', error);
    }
  };

  const handleReorder = () => {
    setIsReordering(!isReordering);
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    
    const newServices = [...services];
    const temp = newServices[index];
    newServices[index] = newServices[index - 1];
    newServices[index - 1] = temp;
    
    // 更新顺序
    newServices[index].order = index;
    newServices[index - 1].order = index - 1;
    
    setServices(newServices);
    
    // 保存到服务器
    try {
      const token = localStorage.getItem('admin_token');
      await Promise.all([
        fetch(`${API_URL}/api/services/${newServices[index].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ order: newServices[index].order })
        }),
        fetch(`${API_URL}/api/services/${newServices[index - 1].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ order: newServices[index - 1].order })
        })
      ]);
    } catch (error) {
      console.error('更新服務順序出錯', error);
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === services.length - 1) return;
    
    const newServices = [...services];
    const temp = newServices[index];
    newServices[index] = newServices[index + 1];
    newServices[index + 1] = temp;
    
    // 更新顺序
    newServices[index].order = index;
    newServices[index + 1].order = index + 1;
    
    setServices(newServices);
    
    // 保存到服务器
    try {
      const token = localStorage.getItem('admin_token');
      await Promise.all([
        fetch(`${API_URL}/api/services/${newServices[index].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ order: newServices[index].order })
        }),
        fetch(`${API_URL}/api/services/${newServices[index + 1].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ order: newServices[index + 1].order })
        })
      ]);
    } catch (error) {
      console.error('更新服務順序出錯', error);
    }
  };

  // 模拟图标选项
  const iconOptions = [
    { value: 'lightbulb', label: '燈泡 (專業設計)' },
    { value: 'home', label: '房屋 (精緻施工)' },
    { value: 'refresh-cw', label: '循環 (全屋翻新)' },
    { value: 'smartphone', label: '智能手機 (智能家居)' },
    { value: 'tool', label: '工具' },
    { value: 'settings', label: '設置' },
    { value: 'heart', label: '心形' },
    { value: 'star', label: '星形' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="pt-16"> {/* 为固定导航栏腾出空间 */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">服務管理</h1>
              <p className="mt-2 text-gray-600">創建和管理提供的服務項目。</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleReorder}
                className={`px-4 py-2 border rounded-md ${
                  isReordering 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {isReordering ? '完成排序' : '調整順序'}
              </button>
              <button
                onClick={handleAddNew}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={isEditing}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                新增服務
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {isEditing ? (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {editingService ? '編輯服務' : '新增服務'}
                  </h2>
                  
                  {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        服務名稱 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        服務描述 <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                        圖標
                      </label>
                      <select
                        id="icon"
                        name="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">選擇圖標</option>
                        {iconOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditingService(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100"
                        disabled={isSubmitting}
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            儲存中...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            儲存
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : services.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">沒有服務</h3>
                  <p className="text-gray-600 mb-6">還沒有創建任何服務項目，點擊上方按鈕添加新服務。</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {isReordering && (
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            排序
                          </th>
                        )}
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          服務名稱
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          描述
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          圖標
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {services.map((service, index) => (
                        <tr key={service.id} className="hover:bg-gray-50">
                          {isReordering && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col items-center">
                                <button
                                  onClick={() => handleMoveUp(index)}
                                  disabled={index === 0}
                                  className="p-1 disabled:opacity-30"
                                >
                                  ▲
                                </button>
                                <GripVertical className="w-4 h-4 text-gray-400 my-1" />
                                <button
                                  onClick={() => handleMoveDown(index)}
                                  disabled={index === services.length - 1}
                                  className="p-1 disabled:opacity-30"
                                >
                                  ▼
                                </button>
                              </div>
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 line-clamp-2">{service.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{service.icon || '無'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleEdit(service)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                              disabled={isReordering}
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(service)}
                              className="text-red-600 hover:text-red-900"
                              disabled={isReordering}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* 删除确认对话框 */}
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">確認刪除</h3>
            <p className="text-gray-600 mb-6">
              您確定要刪除服務「{serviceToDelete?.name}」嗎？此操作無法撤銷。
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                取消
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                確認刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 