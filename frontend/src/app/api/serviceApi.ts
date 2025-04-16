// 服务相关API
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 类型定义
export interface Service {
  id: number;
  name: string;
  description: string;
  icon?: string | null;
}

// 获取所有服务
export const fetchAllServices = async (): Promise<Service[]> => {
  try {
    // 添加时间戳参数，确保每次请求都是最新的数据，避免缓存问题
    const timestamp = new Date().getTime();
    const response = await fetch(`${API_URL}/api/services?t=${timestamp}`);
    if (!response.ok) {
      throw new Error('获取服务失败');
    }
    const data = await response.json();
    console.log('API返回的服务数据:', data); // 添加日志，查看API实际返回的数据
    return data;
  } catch (error) {
    console.error('获取服务出错:', error);
    return [];
  }
};

// 获取单个服务
export const fetchServiceById = async (serviceId: number): Promise<Service | null> => {
  try {
    const response = await fetch(`${API_URL}/api/services/${serviceId}`);
    if (!response.ok) {
      throw new Error('获取服务详情失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取服务详情出错:', error);
    return null;
  }
};

// 管理员创建服务 (需要认证)
export const createService = async (token: string, serviceData: Omit<Service, 'id'>): Promise<Service> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/services`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      throw new Error('创建服务失败');
    }

    return await response.json();
  } catch (error) {
    console.error('创建服务失败:', error);
    throw error;
  }
};

// 管理员更新服务 (需要认证)
export const updateService = async (token: string, serviceId: number, serviceData: Omit<Service, 'id'>): Promise<Service> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/services/${serviceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      throw new Error('更新服务失败');
    }

    return await response.json();
  } catch (error) {
    console.error('更新服务失败:', error);
    throw error;
  }
};

// 管理员删除服务 (需要认证)
export const deleteService = async (token: string, serviceId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/services/${serviceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('删除服务失败');
    }

    return true;
  } catch (error) {
    console.error('删除服务失败:', error);
    throw error;
  }
}; 