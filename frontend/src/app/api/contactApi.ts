// 联系表单相关API
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 联系表单请求类型
export interface ContactRequest {
  name: string;
  phone: string;
  email: string;
  message: string;
}

// 联系表单响应类型
export interface ContactResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  created_at: string;
  is_read?: boolean;
}

// 更新联系表单状态请求
export interface ContactUpdateRequest {
  is_read: number;
}

/**
 * 提交联系表单
 * @param contactData 联系表单数据
 * @returns 创建的联系信息
 */
export const submitContactForm = async (contactData: ContactRequest): Promise<ContactResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      throw new Error('提交联系表单失败');
    }

    return await response.json();
  } catch (error) {
    console.error('提交联系表单出错:', error);
    throw error;
  }
};

/**
 * 获取所有联系表单（仅管理员）
 * @param token 管理员登录token
 * @returns 联系表单列表
 */
export const fetchAllContacts = async (token: string): Promise<ContactResponse[]> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/contacts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('获取联系表单列表失败');
    }

    return await response.json();
  } catch (error) {
    console.error('获取联系表单列表出错:', error);
    return [];
  }
};

/**
 * 获取单个联系表单详情（仅管理员）
 * @param token 管理员登录token
 * @param contactId 联系表单ID
 * @returns 联系表单详情
 */
export const fetchContactById = async (token: string, contactId: number): Promise<ContactResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/contacts/${contactId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('获取联系表单详情失败');
    }

    return await response.json();
  } catch (error) {
    console.error('获取联系表单详情出错:', error);
    return null;
  }
};

/**
 * 更新联系表单状态（仅管理员）
 * @param token 管理员登录token
 * @param contactId 联系表单ID
 * @param updateData 更新数据
 * @returns 更新后的联系表单
 */
export const updateContactStatus = async (
  token: string, 
  contactId: number, 
  updateData: { is_read: boolean }
): Promise<ContactResponse> => {
  try {
    // 将布尔值转换为数字(0/1)
    const payload: ContactUpdateRequest = {
      is_read: updateData.is_read ? 1 : 0
    };

    const response = await fetch(`${API_URL}/api/admin/contacts/${contactId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('更新联系表单状态失败');
    }

    return await response.json();
  } catch (error) {
    console.error('更新联系表单状态出错:', error);
    throw error;
  }
};

/**
 * 删除联系表单（仅管理员）
 * @param token 管理员登录token
 * @param contactId 联系表单ID
 * @returns 是否删除成功
 */
export const deleteContact = async (token: string, contactId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/admin/contacts/${contactId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('删除联系表单失败');
    }

    return true;
  } catch (error) {
    console.error('删除联系表单出错:', error);
    throw error;
  }
}; 