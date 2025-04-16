from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List
from . import crud, schemas, auth
from .database import get_db
from .auth import User, get_current_active_user

router = APIRouter()

# 受保护的管理员路由 - 需要认证
@router.get("/dashboard", response_model=dict)
async def admin_dashboard(current_user: User = Depends(get_current_active_user)):
    return {
        "message": "管理员面板访问成功",
        "username": current_user.username
    }

# 文件夹管理
@router.get("/folders", response_model=List[schemas.Folder])
async def get_admin_folders(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return crud.get_folders(db, skip=skip, limit=limit)

@router.post("/folders", response_model=schemas.Folder)
async def create_admin_folder(
    folder: schemas.FolderCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return crud.create_folder(db=db, folder=folder)

@router.delete("/folders/{folder_id}", response_model=bool)
async def delete_admin_folder(
    folder_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = crud.delete_folder(db, folder_id=folder_id)
    if not result:
        raise HTTPException(status_code=404, detail="文件夹不存在")
    return True

# 相册管理
@router.get("/albums", response_model=List[schemas.Album])
async def get_admin_albums(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return crud.get_albums(db, skip=skip, limit=limit)

@router.post("/albums", response_model=schemas.Album)
async def create_admin_album(
    album: schemas.AlbumCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return crud.create_album(db=db, album=album)

@router.delete("/albums/{album_id}", response_model=bool)
async def delete_admin_album(
    album_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    result = crud.delete_album(db, album_id=album_id)
    if not result:
        raise HTTPException(status_code=404, detail="相册不存在")
    return True

# 图片管理 - 文件上传
@router.post("/upload", response_model=schemas.Image)
async def admin_upload_image(
    album_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # 复用已有的上传逻辑，但添加了身份验证
    # 确保相册存在
    album = crud.get_album(db, album_id=album_id)
    if not album:
        raise HTTPException(status_code=404, detail="相册不存在")
    
    # 使用通用上传函数
    image_data = schemas.ImageCreate(
        image_name=file.filename,
        object_name=f"uploads/{album_id}/{file.filename}",
        album_id=album_id
    )
    
    # 确保上传目录存在
    import os
    import shutil
    
    upload_dir = os.path.join("uploads", str(album_id))
    os.makedirs(upload_dir, exist_ok=True)
    
    # 保存文件
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 更新图片路径
    image_data.object_name = file_path
    
    return crud.create_image(db=db, image=image_data)

@router.delete("/images/{image_id}", response_model=bool)
async def delete_admin_image(
    image_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_image = crud.get_image(db, image_id=image_id)
    if not db_image:
        raise HTTPException(status_code=404, detail="图片不存在")
    
    # 尝试删除文件
    try:
        import os
        if os.path.exists(db_image.object_name):
            os.remove(db_image.object_name)
    except Exception as e:
        # 记录错误但继续删除数据库记录
        print(f"删除文件时出错: {str(e)}")
    
    result = crud.delete_image(db, image_id=image_id)
    return result 