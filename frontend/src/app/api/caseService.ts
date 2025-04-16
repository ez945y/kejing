// 案例相关API服务
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 类型定义
export interface Case {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

// 获取所有案例
export const fetchAllCases = async (): Promise<Case[]> => {
  try {
    const response = await fetch(`${API_URL}/api/cases`);
    if (!response.ok) {
      throw new Error('获取案例失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取案例出错:', error);
    return [];
  }
};

// 获取单个案例
export const fetchCaseById = async (caseId: number): Promise<Case | null> => {
  try {
    const response = await fetch(`${API_URL}/api/cases/${caseId}`);
    if (!response.ok) {
      throw new Error('获取案例详情失败');
    }
    return await response.json();
  } catch (error) {
    console.error('获取案例详情出错:', error);
    return null;
  }
};

// 管理员创建案例 (需要认证)
export const createCase = async (token: string, caseData: Omit<Case, 'id'>): Promise<Case> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/cases`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(caseData),
    });

    if (!response.ok) {
      throw new Error('创建案例失败');
    }

    return await response.json();
  } catch (error) {
    console.error('创建案例失败:', error);
    throw error;
  }
};

// 管理员更新案例 (需要认证)
export const updateCase = async (token: string, caseId: number, caseData: Omit<Case, 'id'>): Promise<Case> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/cases/${caseId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(caseData),
    });

    if (!response.ok) {
      throw new Error('更新案例失败');
    }

    return await response.json();
  } catch (error) {
    console.error('更新案例失败:', error);
    throw error;
  }
};

// 管理员删除案例 (需要认证)
export const deleteCase = async (token: string, caseId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/cases/${caseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('删除案例失败');
    }

    return true;
  } catch (error) {
    console.error('删除案例失败:', error);
    throw error;
  }
}; 