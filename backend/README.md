# 可京室內裝修 - 後端

室內裝修服務網站的FastAPI後端部分

## 技術棧

- FastAPI
- Python 3.8+
- Pydantic
- Uvicorn

## 開發環境設置

```bash
# 安裝依賴
pip install -r requirements.txt

# 運行開發服務器
uvicorn main:app --reload

# 生產環境運行
uvicorn main:app
```

## 目錄結構

- `main.py` - 應用入口點和主要配置
- `app/models.py` - 數據模型和驗證架構
- `app/routes.py` - API路由和端點處理

## API端點

- `GET /api/cases` - 獲取所有案例
- `GET /api/cases/{case_id}` - 獲取特定案例詳情
- `GET /api/services` - 獲取所有服務
- `GET /api/services/{service_id}` - 獲取特定服務詳情
- `POST /api/contact` - 提交聯繫表單

## API文檔

啟動服務後，在以下地址查看自動生成的API文檔：

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc` 