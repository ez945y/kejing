from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas
from typing import List, Optional
from .models import LabelEnum

# 文件夹相关操作
def get_folders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.FolderModel).offset(skip).limit(limit).all()

def get_folder(db: Session, folder_id: int):
    return db.query(models.FolderModel).filter(models.FolderModel.id == folder_id).first()

def create_folder(db: Session, folder: schemas.FolderCreate):
    db_folder = models.FolderModel(**folder.dict())
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder

def update_folder(db: Session, folder_id: int, folder: schemas.FolderCreate):
    db_folder = get_folder(db, folder_id)
    if db_folder:
        for key, value in folder.dict().items():
            setattr(db_folder, key, value)
        db.commit()
        db.refresh(db_folder)
    return db_folder

def delete_folder(db: Session, folder_id: int):
    db_folder = get_folder(db, folder_id)
    if db_folder:
        db.delete(db_folder)
        db.commit()
        return True
    return False

# 相册相关操作
def get_albums(db: Session, skip: int = 0, limit: int = 100, label: Optional[LabelEnum] = None):
    query = db.query(models.AlbumModel)
    if label:
        query = query.filter(models.AlbumModel.label == label)
    return query.offset(skip).limit(limit).all()

def get_albums_by_folder(db: Session, folder_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.AlbumModel).filter(models.AlbumModel.folder_id == folder_id).offset(skip).limit(limit).all()

def get_album(db: Session, album_id: int):
    return db.query(models.AlbumModel).filter(models.AlbumModel.id == album_id).first()

def create_album(db: Session, album: schemas.AlbumCreate):
    db_album = models.AlbumModel(**album.dict())
    db.add(db_album)
    db.commit()
    db.refresh(db_album)
    return db_album

def update_album(db: Session, album_id: int, album: schemas.AlbumCreate):
    db_album = get_album(db, album_id)
    if db_album:
        for key, value in album.dict().items():
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
    return db.query(models.ImageModel).offset(skip).limit(limit).all()

def get_images_by_album(db: Session, album_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.ImageModel).filter(models.ImageModel.album_id == album_id).offset(skip).limit(limit).all()

def get_image(db: Session, image_id: int):
    return db.query(models.ImageModel).filter(models.ImageModel.id == image_id).first()

def create_image(db: Session, image: schemas.ImageCreate):
    db_image = models.ImageModel(**image.dict())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def update_image(db: Session, image_id: int, image: schemas.ImageCreate):
    db_image = get_image(db, image_id)
    if db_image:
        for key, value in image.dict().items():
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

# 案例相关操作
def get_cases(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CaseModel).offset(skip).limit(limit).all()

def get_case(db: Session, case_id: int):
    return db.query(models.CaseModel).filter(models.CaseModel.id == case_id).first()

def create_case(db: Session, case: schemas.CaseCreate):
    db_case = models.CaseModel(**case.dict())
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

# 服务相关操作
def get_services(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ServiceModel).offset(skip).limit(limit).all()

def get_service(db: Session, service_id: int):
    return db.query(models.ServiceModel).filter(models.ServiceModel.id == service_id).first()

def create_service(db: Session, service: schemas.ServiceCreate):
    db_service = models.ServiceModel(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

# 联系表单相关操作
def create_contact(db: Session, contact: schemas.ContactRequest):
    db_contact = models.ContactModel(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact 