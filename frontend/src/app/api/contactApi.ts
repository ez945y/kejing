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