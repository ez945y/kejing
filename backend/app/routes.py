from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from typing import List, Optional
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import get_db
from .models import LabelEnum
import os
import shutil
from datetime import datetime
from fastapi.responses import FileResponse

router = APIRouter()

# 示例数据 - 在实际项目中应该从数据库获取
cases = [
    {
        "id": 1,
        "title": "現代簡約風格公寓",
        "description": "60平方米的小公寓，採用現代簡約風格設計，充分利用空間。",
        "image": "/images/case1.jpg",
        "date": "2023-01-15"
    },
    {
        "id": 2,
        "title": "日式風格別墅",
        "description": "180平方米的別墅，採用日式風格設計，注重自然材料與空間層次。",
        "image": "/images/case2.jpg",
        "date": "2023-03-20"
    },
    {
        "id": 3,
        "title": "北歐風格家居",
        "description": "120平方米的三居室，北歐風格裝修，簡潔明亮。",
        "image": "/images/case3.jpg",
        "date": "2023-05-10"
    }
]

services = [
    {
        "id": 1,
        "name": "專業設計",
        "description": "客製化空間規劃，根據您的需求打造理想家居。"
    },
    {
        "id": 2,
        "name": "精緻施工",
        "description": "高品質裝修工程，自有施工團隊確保工程品質。"
    },
    {
        "id": 3,
        "name": "全屋翻新",
        "description": "舊屋改造煥然一新，讓陳舊空間重獲新生。"
    },
    {
        "id": 4,
        "name": "智能家居",
        "description": "現代化智慧空間，提升居住體驗與便利性。"
    }
]

# 文件夹相关路由
@router.get("/folders", response_model=List[schemas.Folder])
async def get_folders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    folders = crud.get_folders(db, skip=skip, limit=limit)
    return folders

@router.post("/folders", response_model=schemas.Folder)
async def create_folder(folder: schemas.FolderCreate, db: Session = Depends(get_db)):
    return crud.create_folder(db=db, folder=folder)

@router.get("/folders/{folder_id}", response_model=schemas.Folder)
async def get_folder(folder_id: int, db: Session = Depends(get_db)):
    db_folder = crud.get_folder(db, folder_id=folder_id)
    if db_folder is None:
        raise HTTPException(status_code=404, detail="文件夹不存在")
    return db_folder

@router.put("/folders/{folder_id}", response_model=schemas.Folder)
async def update_folder(folder_id: int, folder: schemas.FolderCreate, db: Session = Depends(get_db)):
    db_folder = crud.update_folder(db, folder_id=folder_id, folder=folder)
    if db_folder is None:
        raise HTTPException(status_code=404, detail="文件夹不存在")
    return db_folder

@router.delete("/folders/{folder_id}", response_model=bool)
async def delete_folder(folder_id: int, db: Session = Depends(get_db)):
    result = crud.delete_folder(db, folder_id=folder_id)
    if not result:
        raise HTTPException(status_code=404, detail="文件夹不存在")
    return True

# 相册相关路由
@router.get("/albums", response_model=List[schemas.Album])
async def get_albums(skip: int = 0, limit: int = 100, label: Optional[LabelEnum] = None, db: Session = Depends(get_db)):
    albums = crud.get_albums(db, skip=skip, limit=limit, label=label)
    return albums

@router.get("/folders/{folder_id}/albums", response_model=List[schemas.Album])
async def get_folder_albums(folder_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_albums_by_folder(db, folder_id=folder_id, skip=skip, limit=limit)

@router.post("/albums", response_model=schemas.Album)
async def create_album(album: schemas.AlbumCreate, db: Session = Depends(get_db)):
    return crud.create_album(db=db, album=album)

@router.get("/albums/{album_id}", response_model=schemas.AlbumWithImages)
async def get_album(album_id: int, db: Session = Depends(get_db)):
    db_album = crud.get_album(db, album_id=album_id)
    if db_album is None:
        raise HTTPException(status_code=404, detail="相册不存在")
    return db_album

@router.put("/albums/{album_id}", response_model=schemas.Album)
async def update_album(album_id: int, album: schemas.AlbumUpdate, db: Session = Depends(get_db)):
    db_album = crud.update_album(db, album_id=album_id, album=album)
    if db_album is None:
        raise HTTPException(status_code=404, detail="相册不存在")
    return db_album

@router.delete("/albums/{album_id}", response_model=bool)
async def delete_album(album_id: int, db: Session = Depends(get_db)):
    result = crud.delete_album(db, album_id=album_id)
    if not result:
        raise HTTPException(status_code=404, detail="相册不存在")
    return True

# 图片相关路由
@router.get("/images", response_model=List[schemas.Image])
async def get_images(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    images = crud.get_images(db, skip=skip, limit=limit)
    return images

@router.get("/albums/{album_id}/images", response_model=List[schemas.Image])
async def get_album_images(album_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_images_by_album(db, album_id=album_id, skip=skip, limit=limit)

@router.post("/images", response_model=schemas.Image)
async def create_image(image: schemas.ImageCreate, db: Session = Depends(get_db)):
    return crud.create_image(db=db, image=image)

@router.put("/images/{image_id}", response_model=schemas.Image)
async def update_image(image_id: int, image: schemas.ImageUpdate, db: Session = Depends(get_db)):
    db_image = crud.update_image(db, image_id=image_id, image=image)
    if db_image is None:
        raise HTTPException(status_code=404, detail="图片不存在")
    return db_image

# 文件上传路由
@router.post("/upload", response_model=schemas.Image)
async def upload_image(
    album_id: int = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 确保相册存在
    album = crud.get_album(db, album_id=album_id)
    if not album:
        raise HTTPException(status_code=404, detail="相册不存在")
    
    # 确保上传目录存在
    upload_dir = os.path.join("uploads", str(album_id))
    os.makedirs(upload_dir, exist_ok=True)
    
    # 生成文件名和路径
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    file_extension = os.path.splitext(file.filename)[1]
    object_name = f"{timestamp}{file_extension}"
    file_path = os.path.join(upload_dir, object_name)
    
    # 保存文件
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 创建图片记录
    image_data = schemas.ImageCreate(
        image_name=file.filename,
        object_name=file_path,
        album_id=album_id,
        description=description
    )
    
    return crud.create_image(db=db, image=image_data)

@router.get("/images/{image_id}", response_model=schemas.Image)
async def get_image(image_id: int, db: Session = Depends(get_db)):
    db_image = crud.get_image(db, image_id=image_id)
    if db_image is None:
        raise HTTPException(status_code=404, detail="图片不存在")
    return db_image

@router.get("/images/{image_id}/file")
async def get_image_file(image_id: int, db: Session = Depends(get_db)):
    db_image = crud.get_image(db, image_id=image_id)
    if db_image is None:
        raise HTTPException(status_code=404, detail="图片不存在")
    
    if not os.path.exists(db_image.object_name):
        raise HTTPException(status_code=404, detail="图片文件不存在")
    
    return FileResponse(db_image.object_name)

@router.delete("/images/{image_id}", response_model=bool)
async def delete_image(image_id: int, db: Session = Depends(get_db)):
    result = crud.delete_image(db, image_id=image_id)
    if not result:
        raise HTTPException(status_code=404, detail="图片不存在")
    return True

# 案例相关路由
@router.get("/cases", response_model=List[schemas.Case])
async def get_cases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cases = crud.get_cases(db, skip=skip, limit=limit)
    return cases

@router.get("/cases/{case_id}", response_model=schemas.Case)
async def get_case(case_id: int, db: Session = Depends(get_db)):
    db_case = crud.get_case(db, case_id=case_id)
    if db_case is None:
        raise HTTPException(status_code=404, detail="案例不存在")
    return db_case

@router.post("/cases", response_model=schemas.Case)
async def create_case(case: schemas.CaseCreate, db: Session = Depends(get_db)):
    return crud.create_case(db=db, case=case)

# 服务相关路由
@router.get("/services", response_model=List[schemas.Service])
async def get_services(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    services = crud.get_services(db, skip=skip, limit=limit)
    return services

@router.get("/services/{service_id}", response_model=schemas.Service)
async def get_service(service_id: int, db: Session = Depends(get_db)):
    db_service = crud.get_service(db, service_id=service_id)
    if db_service is None:
        raise HTTPException(status_code=404, detail="服务不存在")
    return db_service

@router.post("/services", response_model=schemas.Service)
async def create_service(service: schemas.ServiceCreate, db: Session = Depends(get_db)):
    return crud.create_service(db=db, service=service)

@router.put("/services/{service_id}", response_model=schemas.Service)
async def update_service(service_id: int, service: schemas.ServiceUpdate, db: Session = Depends(get_db)):
    db_service = crud.update_service(db, service_id=service_id, service=service)
    if db_service is None:
        raise HTTPException(status_code=404, detail="服务不存在")
    return db_service

@router.delete("/services/{service_id}", response_model=bool)
async def delete_service(service_id: int, db: Session = Depends(get_db)):
    result = crud.delete_service(db, service_id=service_id)
    if not result:
        raise HTTPException(status_code=404, detail="服务不存在")
    return True

# 联系表单相关路由
@router.post("/contact", response_model=schemas.ContactResponse)
async def create_contact(contact: schemas.ContactRequest, db: Session = Depends(get_db)):
    return crud.create_contact(db=db, contact=contact)

@router.get("/admin/contacts", response_model=List[schemas.ContactResponse])
async def get_contacts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_contacts(db, skip=skip, limit=limit)

@router.get("/admin/contacts/{contact_id}", response_model=schemas.ContactResponse)
async def get_contact(contact_id: int, db: Session = Depends(get_db)):
    db_contact = crud.get_contact(db, contact_id=contact_id)
    if db_contact is None:
        raise HTTPException(status_code=404, detail="联系消息不存在")
    return db_contact

@router.put("/admin/contacts/{contact_id}", response_model=schemas.ContactResponse)
async def update_contact_status(contact_id: int, status: schemas.ContactUpdate, db: Session = Depends(get_db)):
    db_contact = crud.update_contact_status(db, contact_id=contact_id, is_read=status.is_read)
    if db_contact is None:
        raise HTTPException(status_code=404, detail="联系消息不存在")
    return db_contact

@router.delete("/admin/contacts/{contact_id}", response_model=bool)
async def delete_contact(contact_id: int, db: Session = Depends(get_db)):
    result = crud.delete_contact(db, contact_id=contact_id)
    if not result:
        raise HTTPException(status_code=404, detail="联系消息不存在")
    return True

# 统计数据路由
@router.get("/admin/statistics", response_model=schemas.Statistics)
async def get_statistics(db: Session = Depends(get_db)):
    return crud.get_statistics(db) 