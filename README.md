# 今日待辦 — Todo List

React + Supabase 待辦清單專案

## 專案簡介

以 React 搭配 Supabase 雲端資料庫打造的全端待辦清單應用，資料即時儲存於雲端，重新整理後不會消失。

## 功能介紹

- 新增待辦事項，支援工作 / 個人 / 其他三種標籤分類
- 點擊圓圈切換完成狀態，附完成進度條
- 滑鼠移過顯示刪除按鈕
- 篩選全部 / 進行中 / 已完成
- 一鍵清除所有已完成項目
- 資料即時同步 Supabase 雲端資料庫

---
[Todos-app](https://jen041794.github.io/orginal_todos/)

## 設定步驟

### 1. 建立 Supabase 專案

1. 前往 [https://supabase.com](https://supabase.com) 登入或註冊
2. 點擊 **New project**，填入名稱和密碼
3. 等待約 1 分鐘讓資料庫啟動

### 2. 建立資料表

在 Supabase 左側選 **SQL Editor**，貼上並執行：

```sql
create table todos (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  tag text,
  is_done boolean default false,
  created_at timestamptz default now()
);

-- 允許匿名讀寫（開發用，正式環境請加入 Auth）
alter table todos enable row level security;

create policy "allow all" on todos
  for all using (true) with check (true);
```

### 3. 取得 API 金鑰

在 Supabase 左側 **Project Settings → API**，複製：
- **Project URL** → 貼到 `VITE_SUPABASE_URL`
- **anon public** key → 貼到 `VITE_SUPABASE_ANON_KEY`

### 4. 設定環境變數

```bash
cp .env.example .env
# 用編輯器開啟 .env，填入上面的 URL 和 Key
```

### 5. 安裝與啟動

```bash
npm install
npm run dev
```

瀏覽器開啟 `http://localhost:5173` 即可使用。

---

## 技術架構

| 類別 | 技術 |
|------|------|
| 前端框架 | React 18 |
| 建構工具 | Vite |
| 資料庫 | Supabase (PostgreSQL) |
| 部署 | GitHub Pages + GitHub Actions |

---

## 專案結構

```
src/
  lib/
    supabase.js       # Supabase 客戶端初始化
  components/
    AddTodo.jsx       # 新增表單
    TodoItem.jsx      # 單一待辦項目
    FilterBar.jsx     # 篩選列
  App.jsx             # 主邏輯
  main.jsx            # 入口
  index.css           # 全域樣式
```

## 資料表欄位

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | uuid | 主鍵，自動產生 |
| text | text | 待辦內容 |
| tag | text | 標籤（可空） |
| is_done | boolean | 是否完成 |
| created_at | timestamptz | 建立時間 |

---

## 製作過程與學習心得

這是我第一個串接雲端資料庫的前端專案，主要學習目標是理解前端如何與後端資料庫溝通。

過程中碰到幾個印象深刻的問題：

- **環境變數管理**：了解 `.env` 不能上傳 GitHub，改用 GitHub Secrets 在 CI/CD 流程中注入金鑰
- **資料庫權限設定**：學習 Supabase 的 Row Level Security (RLS) 政策設定
- **自動化部署**：第一次設定 GitHub Actions workflow，實現 push 後自動 build 並部署到 GitHub Pages

---

### 網頁demo顯示
![todos 網頁demo](https://github.com/user-attachments/assets/fabaabeb-e581-4af5-9bd5-e0ae672e2a27)

---

### 連結資料庫後的顯示(含測試)
![todos 資料庫連結](https://github.com/user-attachments/assets/7116cbbb-a4e8-4e59-a4a8-27bb80c2a72c)
