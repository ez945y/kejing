// 管理员API服务
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
console.log('使用的API地址:', API_URL); // 调试用

// 类型定义
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface AdminUser {
  username: string;
  disabled?: boolean;
}

export interface Folder {
  id: number;
  folder_name: string;
  created_at: string;
  updated_at: string;
}

export interface FolderCreate {
  folder_name: string;
}

export interface Album {
  id: number;
  album_name: string;
  label: 'business' | 'house';
  folder_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface AlbumCreate {
  album_name: string;
  label: 'business' | 'house';
  folder_id?: number | null;
}

export interface Image {
  id: number;
  image_name: string;
  object_name: string;
  album_id: number;
  created_at: string;
  updated_at: string;
}

// 以下是辅助函数，用于构建完整的API URL
const buildApiUrl = (path: string): string => {
  const baseUrl = API_URL.replace(/\/$/, '');
  return `${baseUrl}${path}`;
};

// 管理员登录
export const adminLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('开始登录请求');
    // 确保API_URL存在且末尾没有斜杠
    const baseUrl = API_URL.replace(/\/$/, '');
    const url = `${baseUrl}/api/auth/token`;
    
    console.log('登录请求URL:', url); // 调试用
    
    // 将凭据转换为表单数据格式
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '登录失败');
    }

    const data = await response.json();
    console.log('登录成功');
    
    // 存储用户名便于后续使用
    localStorage.setItem('admin_username', credentials.username);
    
    return data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

// 获取当前登录的管理员信息
export const getCurrentAdmin = async (token: string): Promise<AdminUser> => {
  try {
    const response = await fetch(buildApiUrl('/api/auth/me'), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('获取用户信息失败');
    }

    return await response.json();
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

// 获取所有文件夹
export const fetchFolders = async (token: string): Promise<Folder[]> => {
  try {
    const response = await fetch(buildApiUrl('/api/admin/folders'), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('获取文件夹失败');
    }

    return await response.json();
  } catch (error) {
    console.error('获取文件夹失败:', error);
    return [];
  }
};

// 创建文件夹
export const createFolder = async (token: string, folder: FolderCreate): Promise<Folder> => {
  try {
    const response = await fetch(buildApiUrl('/api/admin/folders'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(folder),
    });

    if (!response.ok) {
      throw new Error('创建文件夹失败');
    }

    return await response.json();
  } catch (error) {
    console.error('创建文件夹失败:', error);
    throw error;
  }
};

// 删除文件夹
export const deleteFolder = async (token: string, folderId: number): Promise<boolean> => {
  try {
    const response = await fetch(buildApiUrl(`/api/admin/folders/${folderId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('删除文件夹失败');
    }

    return await response.json();
  } catch (error) {
    console.error('删除文件夹失败:', error);
    throw error;
  }
};

// 获取所有相册（管理员视图）
export const fetchAdminAlbums = async (token: string): Promise<Album[]> => {
  try {
    const response = await fetch(buildApiUrl('/api/admin/albums'), {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('获取相册失败');
    }

    return await response.json();
  } catch (error) {
    console.error('获取相册失败:', error);
    return [];
  }
};

// 创建相册
export const createAlbum = async (token: string, album: AlbumCreate): Promise<Album> => {
  try {
    const response = await fetch(buildApiUrl('/api/admin/albums'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(album),
    });

    if (!response.ok) {
      throw new Error('创建相册失败');
    }

    return await response.json();
  } catch (error) {
    console.error('创建相册失败:', error);
    throw error;
  }
};

// 删除相册
export const deleteAlbum = async (token: string, albumId: number): Promise<boolean> => {
  try {
    const response = await fetch(buildApiUrl(`/api/admin/albums/${albumId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('删除相册失败');
    }

    return await response.json();
  } catch (error) {
    console.error('删除相册失败:', error);
    throw error;
  }
};

// 上传图片
export const uploadImage = async (token: string, albumId: number, file: File): Promise<Image> => {
  try {
    const formData = new FormData();
    formData.append('album_id', albumId.toString());
    formData.append('file', file);

    const response = await fetch(buildApiUrl('/api/admin/upload'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('上传图片失败');
    }

    return await response.json();
  } catch (error) {
    console.error('上传图片失败:', error);
    throw error;
  }
};

// 删除图片
export const deleteImage = async (token: string, imageId: number): Promise<boolean> => {
  try {
    const response = await fetch(buildApiUrl(`/api/admin/images/${imageId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('删除图片失败');
    }

    return await response.json();
  } catch (error) {
    console.error('删除图片失败:', error);
    throw error;
  }
}; 