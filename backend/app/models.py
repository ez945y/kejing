from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import relationship
import enum
from .database import Base
from datetime import datetime

# 标签枚举类型
class LabelEnum(str, enum.Enum):
    BUSINESS = "business"
    HOUSE = "house"

# SQLAlchemy 模型
class AlbumModel(Base):
    __tablename__ = "albums"
    
    id = Column(Integer, primary_key=True, index=True)
    album_name = Column(String(100), nullable=False)
    label = Column(Enum(LabelEnum), nullable=False, default=LabelEnum.HOUSE)
    description = Column(Text, nullable=True)
    cover_image = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # 关系
    images = relationship("ImageModel", back_populates="album", cascade="all, delete-orphan")

class ImageModel(Base):
    __tablename__ = "images"
    
    id = Column(Integer, primary_key=True, index=True)
    image_name = Column(String(255), nullable=False)
    object_name = Column(String(255), nullable=False)  # 存储路径或对象存储键
    description = Column(Text, nullable=True)
    album_id = Column(Integer, ForeignKey("albums.id"), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # 关系
    album = relationship("AlbumModel", back_populates="images")

class ServiceModel(Base):
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), nullable=True)  # 存储图标名称
    order = Column(Integer, default=0)  # 显示顺序
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class ContactModel(Base):
    __tablename__ = "contacts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(100), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Integer, default=0)  # 0表示未读，1表示已读
    created_at = Column(DateTime, default=func.now()) 