"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminNav from '@/components/adminNav';
import { 
  FolderPlus, Settings, MessageSquare, 
  Camera, Image, Wrench, Mail, 
  ArrowRightCircle, BarChart2, TrendingUp 
} from 'lucide-react';

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
      title: '案例管理',
      description: '管理相冊和圖片上傳',
      icon: <FolderPlus className="w-8 h-8 text-blue-500" />,
      href: '/admin/albums',
      color: 'bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200',
      borderColor: 'border-blue-200',
    },
    {
      title: '服務管理',
      description: '編輯服務項目內容',
      icon: <Settings className="w-8 h-8 text-purple-500" />,
      href: '/admin/services',
      color: 'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200',
      borderColor: 'border-purple-200',
    },
    {
      title: '用戶消息',
      description: '查看用戶聯繫表單提交的消息',
      icon: <MessageSquare className="w-8 h-8 text-amber-500" />,
      href: '/admin/messages',
      color: 'bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200',
      borderColor: 'border-amber-200',
    },
  ];

  // 网站数据卡片
  const statsCards = [
    {
      title: '案例數量',
      value: stats.album_count.toString(),
      icon: <Camera className="w-6 h-6 text-indigo-500" />,
      color: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200',
    },
    {
      title: '圖片總數',
      value: stats.image_count.toString(),
      icon: <Image className="w-6 h-6 text-teal-500" />,
      color: 'bg-gradient-to-br from-teal-50 to-teal-100',
      borderColor: 'border-teal-200',
    },
    {
      title: '服務項目',
      value: stats.service_count.toString(),
      icon: <Wrench className="w-6 h-6 text-purple-500" />,
      color: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
    },
    {
      title: '用戶消息',
      value: `${stats.unread_contact_count}/${stats.contact_count}`,
      icon: <Mail className="w-6 h-6 text-rose-500" />,
      color: `bg-gradient-to-br ${stats.unread_contact_count > 0 ? 'from-rose-50 to-rose-100' : 'from-green-50 to-green-100'}`,
      borderColor: `${stats.unread_contact_count > 0 ? 'border-rose-200' : 'border-green-200'}`,
      badge: stats.unread_contact_count > 0 ? (
        <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {stats.unread_contact_count}
        </span>
      ) : null,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNav />
      
      <div className="pt-20"> {/* 为固定导航栏腾出空间 */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* 欢迎信息 */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    管理中心
                  </h1>
                  <p className="mt-2 text-gray-600">歡迎回來，<span className="font-medium text-blue-600">{username}</span>。這裏是您的管理儀表板。</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-3">
                  <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    <BarChart2 className="w-4 h-4 mr-1" />
                    <span>今日概覽</span>
                  </div>
                  <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>數據正常</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 数据统计区 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <BarChart2 className="w-6 h-6 mr-2 text-blue-600" />
              網站數據
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((card, index) => (
                <div key={index} className={`relative p-6 rounded-2xl shadow-sm ${card.color} border ${card.borderColor} transition-all duration-300 hover:shadow-md`}>
                  {card.badge}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-2">{card.value}</h3>
                    </div>
                    <div className="p-3 rounded-xl bg-white/80 shadow-sm">{card.icon}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 管理功能区 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Settings className="w-6 h-6 mr-2 text-blue-600" />
              管理功能
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {managementCards.map((card, index) => (
                <Link href={card.href} key={index}>
                  <div className={`p-6 rounded-2xl shadow-sm ${card.color} border ${card.borderColor} transition-all duration-300 hover:shadow-md hover:translate-y-[-4px] h-full flex flex-col`}>
                    <div className="p-3 bg-white rounded-xl shadow-sm inline-block mb-4 w-fit">
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                    <p className="text-gray-600 text-sm flex-grow">{card.description}</p>
                    <div className="mt-6 flex items-center text-blue-600 font-medium">
                      進入管理
                      <ArrowRightCircle className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 快速操作 */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FolderPlus className="w-6 h-6 mr-2 text-blue-600" />
              快速操作
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:border-blue-200">
                <div className="p-3 bg-blue-50 rounded-xl shadow-sm inline-block mb-4 w-fit">
                  <FolderPlus className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">新增案例</h3>
                <p className="text-gray-600 mb-6">快速創建新的相冊，用於整理和展示您的作品。</p>
                <Link href="/admin/albums/new">
                  <div className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-sm hover:shadow">
                    創建案例
                    <ArrowRightCircle className="w-5 h-5 ml-2" />
                  </div>
                </Link>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:border-green-200">
                <div className="p-3 bg-green-50 rounded-xl shadow-sm inline-block mb-4 w-fit">
                  <Settings className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">管理服務</h3>
                <p className="text-gray-600 mb-6">編輯服務項目內容。</p>
                <Link href="/admin/services">
                  <div className="inline-flex items-center px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-sm hover:shadow">
                    管理服務
                    <ArrowRightCircle className="w-5 h-5 ml-2" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          
          {/* 页脚 */}
          <div className="text-center text-gray-500 text-sm mt-12 pb-8">
            © {new Date().getFullYear()} 可京室內裝修 管理系統 • 版權所有
          </div>
        </div>
      </div>
    </div>
  );
} 