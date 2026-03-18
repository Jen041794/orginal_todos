# 今日待辦 — Todo List

React + Supabase 待辦清單專案

## 功能
- 新增、完成、刪除待辦事項
- 標籤分類（工作 / 個人 / 其他）
- 篩選（全部 / 進行中 / 已完成）
- 進度條
- 清除所有已完成

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

### 網頁demo顯示
![todos 網頁demo](https://github.com/user-attachments/assets/fabaabeb-e581-4af5-9bd5-e0ae672e2a27)

---

### 連結資料庫後的顯示(含測試)
![todos 資料庫連結](https://github.com/user-attachments/assets/7116cbbb-a4e8-4e59-a4a8-27bb80c2a72c)
