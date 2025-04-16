from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.routes import router as api_router
from app.auth_routes import router as auth_router
from app.database import engine, Base
from app.admin_routes import router as admin_router

# 创建上传目录
os.makedirs("uploads", exist_ok=True)

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="可京室內裝修 API",
    description="可京室內裝修服務的後端API",
    version="0.1.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载静态文件目录
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {"message": "歡迎使用可京室內裝修API"}

@app.get("/api/cases")
async def get_cases():
    # 示例数据
    return [
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

@app.get("/api/services")
async def get_services():
    return [
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

# 包含API路由
app.include_router(api_router, prefix="/api")
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 