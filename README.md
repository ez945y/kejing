# 可京室內裝修

專業室內設計與裝修服務網站

## 專案結構

```
kejing/
├── frontend/         # Next.js 前端項目
│   ├── src/          # 前端源代碼
│   ├── public/       # 靜態資源
│   └── ...
├── backend/          # FastAPI 後端項目
│   ├── app/          # 後端應用代碼
│   │   ├── models.py # 數據模型
│   │   └── routes.py # API路由
│   ├── main.py       # 入口文件
│   └── ...
└── ...
```

## 技術棧

- **前端**：Next.js, React, Tailwind CSS
- **後端**：FastAPI, Python
- **工具**：TypeScript, ESLint

## 開發環境設置

### 前置條件

- Node.js 18+
- Python 3.8+
- npm 或 yarn

### 安裝依賴

```bash
# 安裝項目所有依賴
npm run setup
```

### 運行開發環境

```bash
# 同時運行前端和後端
npm run dev

# 僅運行前端
npm run dev:frontend

# 僅運行後端
npm run dev:backend
```

### 構建和部署

```bash
# 構建前端
npm run build

# 啟動生產環境
npm run start
```

## API文檔

啟動後端服務後，訪問以下地址查看API文檔：

```
http://localhost:8000/docs
```

## 功能特點

- 響應式設計，適配各種設備
- 現代化UI界面
- 案例展示
- 服務介紹
- 聯繫表單
- 專業FAQ問答
