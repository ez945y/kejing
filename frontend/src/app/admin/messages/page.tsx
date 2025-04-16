"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '@/components/adminNav';
import { Eye, Trash2, Mail, CheckCircle, PhoneCall, Clock } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  is_read: number;
  created_at: string;
}

export default function MessagesPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    // 检查是否已登录
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchContacts();
  }, [router]);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/contacts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      } else {
        console.error('獲取聯繫消息失敗');
      }
    } catch (error) {
      console.error('獲取聯繫消息出錯', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClick = async (contact: Contact) => {
    setSelectedContact(contact);
    setViewModalOpen(true);
    
    // 如果消息未读，则标记为已读
    if (contact.is_read === 0) {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${API_URL}/api/admin/contacts/${contact.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ is_read: 1 })
        });
        
        if (response.ok) {
          // 更新本地状态
          setContacts(contacts.map(c => 
            c.id === contact.id ? { ...c, is_read: 1 } : c
          ));
          if (selectedContact) {
            setSelectedContact({ ...contact, is_read: 1 });
          }
        }
      } catch (error) {
        console.error('更新消息狀態出錯', error);
      }
    }
  };

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/api/admin/contacts/${contactToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // 从列表中移除
        setContacts(contacts.filter(c => c.id !== contactToDelete.id));
        setDeleteModalOpen(false);
        setContactToDelete(null);
        
        // 如果正在查看的消息被删除，则关闭查看模态框
        if (selectedContact && selectedContact.id === contactToDelete.id) {
          setViewModalOpen(false);
          setSelectedContact(null);
        }
      } else {
        console.error('刪除消息失敗');
      }
    } catch (error) {
      console.error('刪除消息出錯', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    if (filter === 'unread') return contact.is_read === 0;
    if (filter === 'read') return contact.is_read === 1;
    return true;
  });

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const unreadContacts = contacts.filter(c => c.is_read === 0);
      
      if (unreadContacts.length === 0) return;
      
      // 使用 Promise.all 并行处理所有请求
      await Promise.all(unreadContacts.map(contact => 
        fetch(`${API_URL}/api/admin/contacts/${contact.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ is_read: 1 })
        })
      ));
      
      // 更新本地状态
      setContacts(contacts.map(c => ({ ...c, is_read: 1 })));
    } catch (error) {
      console.error('標記所有消息為已讀出錯', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="pt-16"> {/* 为固定导航栏腾出空间 */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">用戶消息</h1>
              <p className="mt-2 text-gray-600">查看並管理用戶通過聯繫表單提交的消息。</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="flex space-x-1 bg-white border border-gray-300 rounded-md p-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-sm ${
                    filter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-sm ${
                    filter === 'unread' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  未讀
                </button>
                <button
                  onClick={() => setFilter('read')}
                  className={`px-3 py-1 rounded-sm ${
                    filter === 'read' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  已讀
                </button>
              </div>
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                全部標記為已讀
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="flex justify-center mb-4">
                <Mail className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">沒有{filter === 'unread' ? '未讀' : filter === 'read' ? '已讀' : ''}消息</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? '還沒有用戶提交任何聯繫消息。' 
                  : filter === 'unread' 
                    ? '沒有未讀消息。' 
                    : '沒有已讀消息。'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      狀態
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      姓名
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      聯繫方式
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      消息摘要
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      提交時間
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className={`hover:bg-gray-50 ${contact.is_read === 0 ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contact.is_read === 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            未讀
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            已讀
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {contact.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <PhoneCall className="w-4 h-4 mr-1" />
                            {contact.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2">{contact.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(contact.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleViewClick(contact)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(contact)}
                          className="text-red-600 hover:text-red-900"
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
        </div>
      </div>
      
      {/* 查看消息对话框 */}
      {viewModalOpen && selectedContact && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">查看消息</h3>
              <button onClick={() => setViewModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">姓名</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedContact.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">提交時間</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedContact.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">電子郵件</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:text-blue-800">
                      {selectedContact.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">電話</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:text-blue-800">
                      {selectedContact.phone}
                    </a>
                  </dd>
                </div>
                <div className="md:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">消息內容</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                    {selectedContact.message}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => {
                  handleDeleteClick(selectedContact);
                  setViewModalOpen(false);
                }}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                刪除消息
              </button>
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 删除确认对话框 */}
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">確認刪除</h3>
            <p className="text-gray-600 mb-6">
              您確定要刪除來自「{contactToDelete?.name}」的消息嗎？此操作無法撤銷。
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