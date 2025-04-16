"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  fetchAdminAlbums, 
  fetchFolders, 
  createFolder, 
  createAlbum, 
  uploadImage,
  Album,
  Folder 
} from '@/app/api/adminService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AdminNav from '@/components/adminNav';

export default function AdminUploadPage() {
  const [loading, setLoading] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 新增相册表单状态
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumLabel, setNewAlbumLabel] = useState('business');
  const [newAlbumFolderId, setNewAlbumFolderId] = useState<number | null>(null);
  
  // 新增文件夹表单状态
  const [newFolderName, setNewFolderName] = useState('');

  const router = useRouter();
  const { toast } = useToast();

  // 验证是否已登录
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      loadData(token);
    }
  }, [router]);

  // 加载数据
  const loadData = async (token: string) => {
    setLoading(true);
    try {
      const [albumsData, foldersData] = await Promise.all([
        fetchAdminAlbums(token),
        fetchFolders(token)
      ]);
      setAlbums(albumsData);
      setFolders(foldersData);
    } catch (error) {
      toast({
        title: "載入數據失敗",
        description: "請檢查您的網絡連接或權限",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 创建新文件夹
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "請輸入文件夾名稱",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) throw new Error("未登錄");

      await createFolder(token, { folder_name: newFolderName });
      
      // 刷新文件夹列表
      const foldersData = await fetchFolders(token);
      setFolders(foldersData);
      
      // 重置表单
      setNewFolderName('');
      
      toast({
        title: "文件夾創建成功",
      });
    } catch (error) {
      toast({
        title: "創建文件夾失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 创建新相册
  const handleCreateAlbum = async () => {
    if (!newAlbumName.trim()) {
      toast({
        title: "請輸入案例名稱",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) throw new Error("未登錄");

      await createAlbum(token, {
        album_name: newAlbumName,
        label: newAlbumLabel as 'business' | 'house',
        folder_id: newAlbumFolderId
      });
      
      // 刷新相册列表
      const albumsData = await fetchAdminAlbums(token);
      setAlbums(albumsData);
      
      // 重置表单
      setNewAlbumName('');
      setNewAlbumLabel('business');
      setNewAlbumFolderId(null);
      
      toast({
        title: "案例創建成功",
      });
    } catch (error) {
      toast({
        title: "創建案例失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // 上传图片
  const handleUploadImages = async () => {
    if (!selectedAlbumId) {
      toast({
        title: "請選擇案例",
        variant: "destructive",
      });
      return;
    }

    if (selectedFiles.length === 0) {
      toast({
        title: "請選擇要上傳的圖片",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) throw new Error("未登錄");

      // 逐个上传文件
      for (const file of selectedFiles) {
        await uploadImage(token, selectedAlbumId, file);
      }
      
      // 重置表单
      setSelectedFiles([]);
      
      toast({
        title: "圖片上傳成功",
        description: `已上傳 ${selectedFiles.length} 張圖片`,
      });
    } catch (error) {
      toast({
        title: "上傳圖片失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>正在載入...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="container mx-auto py-10 px-4 pt-20">
        <h1 className="text-3xl font-bold mb-8">案例管理</h1>
        
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">上傳圖片</TabsTrigger>
            <TabsTrigger value="album">管理案例</TabsTrigger>
            <TabsTrigger value="folder">管理文件夾</TabsTrigger>
          </TabsList>
          
          {/* 上传图片 */}
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>上傳圖片</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="album">選擇案例</Label>
                  <Select 
                    value={selectedAlbumId?.toString() || 'none'} 
                    onValueChange={(value) => value !== 'none' && setSelectedAlbumId(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇案例" />
                    </SelectTrigger>
                    <SelectContent>
                      {albums.length === 0 ? (
                        <SelectItem value="none" disabled>
                          暫無案例，請先創建案例
                        </SelectItem>
                      ) : (
                        albums.map((album) => (
                          <SelectItem key={album.id} value={album.id.toString()}>
                            {album.album_name} ({album.label === 'business' ? '商業空間' : '居家空間'})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.querySelector('[value="album"]')?.dispatchEvent(new Event('click'))}
                    >
                      + 創建新案例
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="files">選擇圖片</Label>
                  <Input 
                    id="files" 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {selectedFiles.length > 0 && (
                    <p className="text-sm text-gray-500">已選擇 {selectedFiles.length} 個文件</p>
                  )}
                </div>
                
                <Button 
                  onClick={handleUploadImages} 
                  disabled={loading || !selectedAlbumId || selectedFiles.length === 0}
                >
                  {loading ? '上傳中...' : '上傳圖片'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* 管理相册 */}
          <TabsContent value="album">
            <Card>
              <CardHeader>
                <CardTitle>創建新案例</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="albumName">案例名稱</Label>
                  <Input 
                    id="albumName" 
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    placeholder="輸入案例名稱"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="albumLabel">案例類型</Label>
                  <Select 
                    value={newAlbumLabel} 
                    onValueChange={setNewAlbumLabel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇類型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">商業空間</SelectItem>
                      <SelectItem value="house">居家空間</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="folderSelect">所屬文件夾 (可選)</Label>
                  <Select 
                    value={newAlbumFolderId?.toString() || 'none'} 
                    onValueChange={(value) => setNewAlbumFolderId(value === 'none' ? null : Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇文件夾" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">不屬於任何文件夾</SelectItem>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id.toString()}>
                          {folder.folder_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.querySelector('[value="folder"]')?.dispatchEvent(new Event('click'))}
                    >
                      + 創建新文件夾
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={handleCreateAlbum} 
                  disabled={loading || !newAlbumName.trim()}
                >
                  {loading ? '創建中...' : '創建案例'}
                </Button>
              </CardContent>
            </Card>
            
            {/* 显示现有相册列表 */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">現有案例</h3>
              {albums.length === 0 ? (
                <p className="text-gray-500">暫無案例</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {albums.map((album) => (
                    <Card key={album.id}>
                      <CardContent className="p-4">
                        <h4 className="font-medium">{album.album_name}</h4>
                        <p className="text-sm text-gray-500">
                          類型: {album.label === 'business' ? '商業空間' : '居家空間'}
                        </p>
                        <p className="text-xs text-gray-400">
                          創建於: {new Date(album.created_at).toLocaleDateString('zh-TW')}
                        </p>
                        <div className="mt-3 pt-3 border-t flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mr-2"
                            onClick={() => {
                              setSelectedAlbumId(album.id);
                              document.querySelector('[value="upload"]')?.dispatchEvent(new Event('click'));
                            }}
                          >
                            上傳圖片
                          </Button>
                          <Button variant="destructive" size="sm">
                            刪除
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* 管理文件夹 */}
          <TabsContent value="folder">
            <Card>
              <CardHeader>
                <CardTitle>創建新文件夾</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="folderName">文件夾名稱</Label>
                  <Input 
                    id="folderName" 
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="輸入文件夾名稱"
                  />
                </div>
                
                <Button 
                  onClick={handleCreateFolder} 
                  disabled={loading || !newFolderName.trim()}
                >
                  {loading ? '創建中...' : '創建文件夾'}
                </Button>
              </CardContent>
            </Card>
            
            {/* 显示现有文件夹列表 */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">現有文件夾</h3>
              {folders.length === 0 ? (
                <p className="text-gray-500">暫無文件夾</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {folders.map((folder) => (
                    <Card key={folder.id}>
                      <CardContent className="p-4">
                        <h4 className="font-medium">{folder.folder_name}</h4>
                        <p className="text-xs text-gray-400">
                          創建於: {new Date(folder.created_at).toLocaleDateString('zh-TW')}
                        </p>
                        <div className="mt-3 pt-3 border-t flex justify-end">
                          <Button variant="destructive" size="sm">
                            刪除
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 