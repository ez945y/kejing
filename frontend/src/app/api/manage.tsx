// galleryApi.js
export const fetchGalleries = async () => {
    const response = await fetch('http://127.0.0.1:5568/api/galleries/');
    const data = await response.json();
    return data;
  };

  export const fetchAlbum = async (title:string) => {
    const response = await fetch(`http://127.0.0.1:5568/api/gallery/${title}/`);
    const data = await response.json();
    return data;
  };
  
  export const uploadFiles = async (title:string, files: any[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
  
    const response = await fetch(`http://127.0.0.1:5568/api/upload/${title}/`, {
      method: 'POST',
      body: formData,
    });
  
    return response.json();
  };
  
  export const deleteAlbum = async (title:string) => {
    if (window.confirm("你確定要刪除這本相簿嗎?")) {
      const response = await fetch(`http://127.0.0.1:5568/api/gallery/${title}`, {
        method: 'DELETE',
      });
      return response.ok;
    }
    return false;
  };

  
  export const deletePhoto = async (title:string, indexes:number[]) => {
    const response = await fetch(`http://127.0.0.1:5568/api/photo/${title}/`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ indexes })
  });
  return response.ok;
  };