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


# 包含API路由
app.include_router(api_router, prefix="/api")
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 