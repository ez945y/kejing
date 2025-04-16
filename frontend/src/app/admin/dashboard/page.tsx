"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '@/components/adminNav';

interface Statistics {
  album_count: number;
  image_count: number;
  service_count: number;
  contact_count: number;
  unread_contact_count: number;
}

export default function AdminDashboardPage() {
  const [username, setUsername] = useState<string>('管理員');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<Statistics>({
    album_count: 0,
    image_count: 0,
    service_count: 0,
    contact_count: 0,
    unread_contact_count: 0
  });
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // 检查是否已登录
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // 获取用户名（简化处理，实际应调用API）
    try {
      const user = localStorage.getItem('admin_username');
      if (user) {
        setUsername(user);
      }
    } catch (error) {
      console.error('獲取用戶信息失敗', error);
    }

    // 获取统计数据
    const fetchStatistics = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/statistics`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('獲取統計數據失敗');
        }
      } catch (error) {
        console.error('獲取統計數據出錯', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [router, API_URL]);

  // 管理功能卡片数据
  const managementCards = [
    {
      title: '相冊管理',
      description: '管理相冊和圖片上傳',
      icon: '📁',
      href: '/admin/albums',
      color: 'bg-blue-100 hover:bg-blue-200',
    },
    {
      title: '服務管理',
      description: '編輯服務項目內容',
      icon: '🛠️',
      href: '/admin/services',
      color: 'bg-purple-100 hover:bg-purple-200',
    },
    {
      title: '用戶消息',
      description: '查看用戶聯繫表單提交的消息',
      icon: '✉️',
      href: '/admin/messages',
      color: 'bg-yellow-100 hover:bg-yellow-200',
    },
  ];

  // 网站数据卡片
  const statsCards = [
    {
      title: '相冊數量',
      value: stats.album_count.toString(),
      icon: '📷',
      color: 'bg-indigo-100',
    },
    {
      title: '圖片總數',
      value: stats.image_count.toString(),
      icon: '🖼️',
      color: 'bg-teal-100',
    },
    {
      title: '服務項目',
      value: stats.service_count.toString(),
      icon: '🛠️',
      color: 'bg-purple-100',
    },
    {
      title: '用戶消息',
      value: `${stats.unread_contact_count}/${stats.contact_count}`,
      icon: '✉️',
      color: `${stats.unread_contact_count > 0 ? 'bg-red-100' : 'bg-green-100'}`,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="pt-16"> {/* 为固定导航栏腾出空间 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">管理中心</h1>
            <p className="mt-2 text-gray-600">歡迎回來，{username}。這裏是您的管理儀表板。</p>
          </div>
          
          {/* 管理功能区 */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">管理功能</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {managementCards.map((card, index) => (
                <Link href={card.href} key={index}>
                  <div className={`p-6 rounded-lg shadow-sm ${card.color} transition-colors duration-200 h-full flex flex-col`}>
                    <div className="text-3xl mb-4">{card.icon}</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-gray-600 text-sm flex-grow">{card.description}</p>
                    <div className="mt-4 text-sm font-medium text-blue-600">
                      進入管理 &rarr;
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* 数据统计区 */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">網站數據</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((card, index) => (
                <div key={index} className={`p-6 rounded-lg shadow-sm ${card.color} h-full`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600 text-sm">{card.title}</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
                    </div>
                    <div className="text-3xl">{card.icon}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 快速操作 */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">快速操作</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">新增相冊</h3>
                <p className="text-gray-600 mb-4">快速創建新的相冊，用於整理和展示您的作品。</p>
                <Link href="/admin/albums/new">
                  <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    創建相冊
                  </div>
                </Link>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">上傳圖片</h3>
                <p className="text-gray-600 mb-4">向現有相冊添加新的圖片。</p>
                <Link href="/admin/images/upload">
                  <div className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    上傳圖片
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 