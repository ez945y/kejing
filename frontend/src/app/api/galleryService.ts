// galleryService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 类型定义
export interface Album {
  id: number;
  album_name: string;
  label: 'business' | 'house';
  folder_id: number | null;
  created_at: string;
  updated_at: string;
  images?: Image[];
}

export interface Image {
  id: number;
  image_name: string;
  object_name: string;
  album_id: number;
  created_at: string;
  updated_at: string;
}

// 获取特定标签的相册列表
export const fetchAlbumsByLabel = async (label: string): Promise<Album[]> => {
  try {
    const response = await fetch(`${API_URL}/api/albums?label=${label}`);
    if (!response.ok) {
      throw new Error('获取相册失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取相册出错:', error);
    return [];
  }
};

// 获取特定相册的图片列表
export const fetchImagesByAlbumId = async (albumId: number): Promise<Image[]> => {
  try {
    const response = await fetch(`${API_URL}/api/albums/${albumId}/images`);
    if (!response.ok) {
      throw new Error('获取图片失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取图片出错:', error);
    return [];
  }
};

// 获取相册及其所有图片
export const fetchAlbumWithImages = async (albumId: number): Promise<Album | null> => {
  try {
    const albumResponse = await fetch(`${API_URL}/api/albums/${albumId}`);
    if (!albumResponse.ok) {
      throw new Error('获取相册失败');
    }
    
    const album = await albumResponse.json();
    const imagesResponse = await fetch(`${API_URL}/api/albums/${albumId}/images`);
    
    if (imagesResponse.ok) {
      const images = await imagesResponse.json();
      return { ...album, images };
    }
    
    return { ...album, images: [] };
  } catch (error) {
    console.error('获取相册和图片出错:', error);
    return null;
  }
};

// 获取所有相册并包含图片
export const fetchAllAlbumsWithImages = async (label?: string): Promise<Album[]> => {
  try {
    const url = label 
      ? `${API_URL}/api/albums?label=${label}` 
      : `${API_URL}/api/albums`;
    
    // 先打印一下API URL和完整请求URL，方便调试
    console.log('API_URL:', API_URL);
    console.log('请求URL:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`获取相册失败: ${response.status} ${response.statusText}`);
    }
    
    const albums = await response.json();
    console.log('获取到的相册数据:', albums);
    
    // 为每个相册获取图片
    const albumsWithImages = await Promise.all(
      albums.map(async (album: Album) => {
        const imageResponse = await fetch(`${API_URL}/api/albums/${album.id}/images`);
        if (imageResponse.ok) {
          const images = await imageResponse.json();
          return { ...album, images };
        }
        return { ...album, images: [] };
      })
    );
    
    return albumsWithImages;
  } catch (error) {
    console.error('获取相册和图片出错:', error);
    return [];
  }
}; 