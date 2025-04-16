from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas
from typing import List, Optional
from .models import LabelEnum

# 相册相关操作
def get_albums(db: Session, skip: int = 0, limit: int = 100, label: Optional[LabelEnum] = None):
    query = db.query(models.AlbumModel)
    if label:
        query = query.filter(models.AlbumModel.label == label)
    return query.order_by(models.AlbumModel.created_at.desc()).offset(skip).limit(limit).all()

def get_album(db: Session, album_id: int):
    return db.query(models.AlbumModel).filter(models.AlbumModel.id == album_id).first()

def create_album(db: Session, album: schemas.AlbumCreate):
    db_album = models.AlbumModel(**album.dict())
    db.add(db_album)
    db.commit()
    db.refresh(db_album)
    return db_album

def update_album(db: Session, album_id: int, album: schemas.AlbumUpdate):
    db_album = get_album(db, album_id)
    if db_album:
        for key, value in album.dict(exclude_unset=True).items():
            setattr(db_album, key, value)
        db.commit()
        db.refresh(db_album)
    return db_album

def delete_album(db: Session, album_id: int):
    db_album = get_album(db, album_id)
    if db_album:
        db.delete(db_album)
        db.commit()
        return True
    return False

# 图片相关操作
def get_images(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ImageModel).order_by(models.ImageModel.created_at.desc()).offset(skip).limit(limit).all()

def get_images_by_album(db: Session, album_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.ImageModel).filter(models.ImageModel.album_id == album_id).order_by(models.ImageModel.created_at.desc()).offset(skip).limit(limit).all()

def get_image(db: Session, image_id: int):
    return db.query(models.ImageModel).filter(models.ImageModel.id == image_id).first()

def create_image(db: Session, image: schemas.ImageCreate):
    db_image = models.ImageModel(**image.dict())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def update_image(db: Session, image_id: int, image: schemas.ImageUpdate):
    db_image = get_image(db, image_id)
    if db_image:
        for key, value in image.dict(exclude_unset=True).items():
            setattr(db_image, key, value)
        db.commit()
        db.refresh(db_image)
    return db_image

def delete_image(db: Session, image_id: int):
    db_image = get_image(db, image_id)
    if db_image:
        db.delete(db_image)
        db.commit()
        return True
    return False

# 服务相关操作
def get_services(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ServiceModel).order_by(models.ServiceModel.order).offset(skip).limit(limit).all()

def get_service(db: Session, service_id: int):
    return db.query(models.ServiceModel).filter(models.ServiceModel.id == service_id).first()

def create_service(db: Session, service: schemas.ServiceCreate):
    db_service = models.ServiceModel(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

def update_service(db: Session, service_id: int, service: schemas.ServiceUpdate):
    db_service = get_service(db, service_id)
    if db_service:
        for key, value in service.dict(exclude_unset=True).items():
            setattr(db_service, key, value)
        db.commit()
        db.refresh(db_service)
    return db_service

def delete_service(db: Session, service_id: int):
    db_service = get_service(db, service_id)
    if db_service:
        db.delete(db_service)
        db.commit()
        return True
    return False

# 联系表单相关操作
def get_contacts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ContactModel).order_by(models.ContactModel.created_at.desc()).offset(skip).limit(limit).all()

def get_contact(db: Session, contact_id: int):
    return db.query(models.ContactModel).filter(models.ContactModel.id == contact_id).first()

def create_contact(db: Session, contact: schemas.ContactRequest):
    db_contact = models.ContactModel(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def update_contact_status(db: Session, contact_id: int, is_read: int):
    db_contact = get_contact(db, contact_id)
    if db_contact:
        db_contact.is_read = is_read
        db.commit()
        db.refresh(db_contact)
    return db_contact

def delete_contact(db: Session, contact_id: int):
    db_contact = get_contact(db, contact_id)
    if db_contact:
        db.delete(db_contact)
        db.commit()
        return True
    return False

# 统计相关操作
def get_statistics(db: Session):
    album_count = db.query(func.count(models.AlbumModel.id)).scalar()
    image_count = db.query(func.count(models.ImageModel.id)).scalar()
    service_count = db.query(func.count(models.ServiceModel.id)).scalar()
    contact_count = db.query(func.count(models.ContactModel.id)).scalar()
    unread_contact_count = db.query(func.count(models.ContactModel.id)).filter(models.ContactModel.is_read == 0).scalar()
    
    return {
        "album_count": album_count,
        "image_count": image_count,
        "service_count": service_count,
        "contact_count": contact_count,
        "unread_contact_count": unread_contact_count
    } 