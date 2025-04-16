from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from .models import LabelEnum

# 文件夹相关模型
class FolderBase(BaseModel):
    folder_name: str

class FolderCreate(FolderBase):
    pass

class Folder(FolderBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

# 相册相关模型
class AlbumBase(BaseModel):
    album_name: str
    label: LabelEnum
    description: Optional[str] = None
    cover_image: Optional[str] = None

class AlbumCreate(AlbumBase):
    pass

class AlbumUpdate(BaseModel):
    album_name: Optional[str] = None
    label: Optional[LabelEnum] = None
    description: Optional[str] = None
    cover_image: Optional[str] = None

class Album(AlbumBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

# 图片相关模型
class ImageBase(BaseModel):
    image_name: str
    object_name: str
    album_id: int
    description: Optional[str] = None

class ImageCreate(ImageBase):
    pass

class ImageUpdate(BaseModel):
    image_name: Optional[str] = None
    description: Optional[str] = None
    album_id: Optional[int] = None

class Image(ImageBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

# 相册带图片的模型
class AlbumWithImages(Album):
    images: List[Image] = []
    
    class Config:
        orm_mode = True

# 案例相关模型
class CaseBase(BaseModel):
    title: str
    description: str
    image: str
    date: str

class CaseCreate(CaseBase):
    pass

class Case(CaseBase):
    id: int
    
    class Config:
        orm_mode = True

# 服务相关模型
class ServiceBase(BaseModel):
    name: str
    description: str
    icon: Optional[str] = None
    order: Optional[int] = 0

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    order: Optional[int] = None

class Service(ServiceBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

# 联系表单相关模型
class ContactRequest(BaseModel):
    name: str
    phone: str
    email: EmailStr
    message: str

class ContactUpdate(BaseModel):
    is_read: int

class ContactResponse(ContactRequest):
    id: int
    is_read: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# 统计数据模型
class Statistics(BaseModel):
    album_count: int
    image_count: int
    service_count: int
    contact_count: int
    unread_contact_count: int 