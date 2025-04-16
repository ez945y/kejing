"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '@/components/adminNav';

export default function AdminDashboardPage() {
  const [username, setUsername] = useState<string>('管理員');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

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
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // 管理功能卡片数据
  const managementCards = [
    {
      title: '案例管理',
      description: '管理相冊、文件夾和圖片上傳',
      icon: '📁',
      href: '/admin/upload',
      color: 'bg-blue-100 hover:bg-blue-200',
    },
    {
      title: '作品集管理',
      description: '管理案例展示內容',
      icon: '🏠',
      href: '/admin/cases',
      color: 'bg-green-100 hover:bg-green-200',
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
      value: '12',
      icon: '📷',
      color: 'bg-indigo-100',
    },
    {
      title: '案例數量',
      value: '8',
      icon: '📋',
      color: 'bg-pink-100',
    },
    {
      title: '圖片總數',
      value: '48',
      icon: '🖼️',
      color: 'bg-teal-100',
    },
    {
      title: '訪問量',
      value: '1,254',
      icon: '👁️',
      color: 'bg-orange-100',
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* 最近活动 */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">最近活動</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="text-gray-600 text-sm">2023-11-01 10:30</p>
                  <p className="text-gray-800">上傳了5張新圖片到"現代簡約風格"相冊</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-gray-600 text-sm">2023-10-28 15:45</p>
                  <p className="text-gray-800">創建了新相冊"北歐風格"</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">2023-10-25 09:15</p>
                  <p className="text-gray-800">更新了"專業設計"服務內容</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  查看更多活動
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 