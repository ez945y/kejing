"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  fetchAdminAlbums, 
  fetchFolders, 
  createFolder, 
  createAlbum, 
  uploadImage 
} from '@/app/api/adminService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AdminNav from '@/components/adminNav';

export default function AdminUploadPage() {
  const [loading, setLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [folders, setFolders] = useState([]);
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
        title: "加载数据失败",
        description: "请检查您的网络连接或权限",
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
        title: "请输入文件夹名称",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) throw new Error("未登录");

      await createFolder(token, { folder_name: newFolderName });
      
      // 刷新文件夹列表
      const foldersData = await fetchFolders(token);
      setFolders(foldersData);
      
      // 重置表单
      setNewFolderName('');
      
      toast({
        title: "文件夹创建成功",
      });
    } catch (error) {
      toast({
        title: "创建文件夹失败",
        description: "请稍后再试",
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
        title: "请输入相册名称",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) throw new Error("未登录");

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
        title: "相册创建成功",
      });
    } catch (error) {
      toast({
        title: "创建相册失败",
        description: "请稍后再试",
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
        title: "请选择相册",
        variant: "destructive",
      });
      return;
    }

    if (selectedFiles.length === 0) {
      toast({
        title: "请选择要上传的图片",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) throw new Error("未登录");

      // 逐个上传文件
      for (const file of selectedFiles) {
        await uploadImage(token, selectedAlbumId, file);
      }
      
      // 重置表单
      setSelectedFiles([]);
      
      toast({
        title: "图片上传成功",
        description: `已上传 ${selectedFiles.length} 张图片`,
      });
    } catch (error) {
      toast({
        title: "上传图片失败",
        description: "请稍后再试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>正在加载...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">内容管理</h1>
        
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">上传图片</TabsTrigger>
            <TabsTrigger value="album">管理相册</TabsTrigger>
            <TabsTrigger value="folder">管理文件夹</TabsTrigger>
          </TabsList>
          
          {/* 上传图片 */}
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>上传图片</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="album">选择相册</Label>
                  <Select 
                    value={selectedAlbumId?.toString() || ''} 
                    onValueChange={(value) => setSelectedAlbumId(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择相册" />
                    </SelectTrigger>
                    <SelectContent>
                      {albums.map((album: any) => (
                        <SelectItem key={album.id} value={album.id.toString()}>
                          {album.album_name} ({album.label})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="files">选择图片</Label>
                  <Input 
                    id="files" 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {selectedFiles.length > 0 && (
                    <p className="text-sm text-gray-500">已选择 {selectedFiles.length} 个文件</p>
                  )}
                </div>
                
                <Button 
                  onClick={handleUploadImages} 
                  disabled={loading || !selectedAlbumId || selectedFiles.length === 0}
                >
                  {loading ? '上传中...' : '上传图片'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* 管理相册 */}
          <TabsContent value="album">
            <Card>
              <CardHeader>
                <CardTitle>创建新相册</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="albumName">相册名称</Label>
                  <Input 
                    id="albumName" 
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    placeholder="输入相册名称"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="albumLabel">相册类型</Label>
                  <Select 
                    value={newAlbumLabel} 
                    onValueChange={setNewAlbumLabel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">商业空间</SelectItem>
                      <SelectItem value="house">居家空间</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="folderSelect">所属文件夹 (可选)</Label>
                  <Select 
                    value={newAlbumFolderId?.toString() || ''} 
                    onValueChange={(value) => setNewAlbumFolderId(value ? Number(value) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择文件夹" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">不属于任何文件夹</SelectItem>
                      {folders.map((folder: any) => (
                        <SelectItem key={folder.id} value={folder.id.toString()}>
                          {folder.folder_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleCreateAlbum} 
                  disabled={loading || !newAlbumName.trim()}
                >
                  {loading ? '创建中...' : '创建相册'}
                </Button>
              </CardContent>
            </Card>
            
            {/* 显示现有相册列表 */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">现有相册</h3>
              {albums.length === 0 ? (
                <p className="text-gray-500">暂无相册</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {albums.map((album: any) => (
                    <Card key={album.id}>
                      <CardContent className="p-4">
                        <h4 className="font-medium">{album.album_name}</h4>
                        <p className="text-sm text-gray-500">
                          类型: {album.label === 'business' ? '商业空间' : '居家空间'}
                        </p>
                        <p className="text-xs text-gray-400">
                          创建于: {new Date(album.created_at).toLocaleDateString()}
                        </p>
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
                <CardTitle>创建新文件夹</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="folderName">文件夹名称</Label>
                  <Input 
                    id="folderName" 
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="输入文件夹名称"
                  />
                </div>
                
                <Button 
                  onClick={handleCreateFolder} 
                  disabled={loading || !newFolderName.trim()}
                >
                  {loading ? '创建中...' : '创建文件夹'}
                </Button>
              </CardContent>
            </Card>
            
            {/* 显示现有文件夹列表 */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">现有文件夹</h3>
              {folders.length === 0 ? (
                <p className="text-gray-500">暂无文件夹</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {folders.map((folder: any) => (
                    <Card key={folder.id}>
                      <CardContent className="p-4">
                        <h4 className="font-medium">{folder.folder_name}</h4>
                        <p className="text-xs text-gray-400">
                          创建于: {new Date(folder.created_at).toLocaleDateString()}
                        </p>
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