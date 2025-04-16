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
    folder_id: Optional[int] = None

class AlbumCreate(AlbumBase):
    pass

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

class ImageCreate(ImageBase):
    pass

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

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    id: int
    
    class Config:
        orm_mode = True

# 联系表单相关模型
class ContactRequest(BaseModel):
    name: str
    phone: str
    email: EmailStr
    message: str

class ContactResponse(ContactRequest):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True 