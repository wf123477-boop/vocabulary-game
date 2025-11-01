# Git 推送和 GitHub Pages 部署指南

## 前置準備

確保您已經：
1. 在 GitHub 上建立了一個名為 `vocabulary-game` 的倉庫
2. 在電腦上安裝了 Git（https://git-scm.com/）

## 步驟 1：下載程式碼

首先，下載本專案的所有程式碼文件。您可以從 Manus 下載完整的專案資料夾。

## 步驟 2：打開終端/命令提示符

- **Windows**：按 `Win + R`，輸入 `cmd` 或 `powershell`
- **Mac**：按 `Cmd + Space`，搜尋 `Terminal`
- **Linux**：打開終端應用

## 步驟 3：進入專案目錄

```bash
cd 路徑/到/vocabulary-game
```

例如，如果您的專案在 `C:\Users\YourName\vocabulary-game`，則輸入：
```bash
cd C:\Users\YourName\vocabulary-game
```

## 步驟 4：初始化 Git 倉庫（如果尚未初始化）

```bash
git init
```

## 步驟 5：設置 Git 用戶信息

```bash
git config user.email "your-email@example.com"
git config user.name "Your Name"
```

將 `your-email@example.com` 和 `Your Name` 替換為您的 GitHub 帳戶信息。

## 步驟 6：添加遠端倉庫

```bash
git remote add origin https://github.com/wf123477-boop/vocabulary-game.git
```

**注意**：將 `wf123477-boop` 替換為您的 GitHub 用戶名。

## 步驟 7：添加所有文件

```bash
git add .
```

## 步驟 8：提交更改

```bash
git commit -m "Initial commit: Vocabulary Learning Game"
```

## 步驟 9：推送到 GitHub

```bash
git branch -M main
git push -u origin main
```

系統可能會要求您輸入 GitHub 帳戶信息。如果您啟用了雙因素認證，您需要使用 **Personal Access Token** 而不是密碼。

### 如何生成 Personal Access Token：

1. 訪問 https://github.com/settings/tokens
2. 點擊「Generate new token」
3. 選擇「Generate new token (classic)」
4. 勾選以下權限：
   - `repo` (完整控制私有倉庫)
   - `workflow` (更新 GitHub Actions 工作流)
5. 點擊「Generate token」
6. 複製生成的 token（這是您唯一一次看到它）
7. 當 Git 要求密碼時，貼上這個 token

## 步驟 10：設置 GitHub Pages

1. 訪問您的倉庫：https://github.com/wf123477-boop/vocabulary-game
2. 點擊「Settings」
3. 在左側菜單中找到「Pages」
4. 在「Build and deployment」部分：
   - 選擇 **Source** 為 「Deploy from a branch」
   - 選擇 **Branch** 為 「main」
   - 選擇資料夾為 「/root」（或 「/ (root)」）
5. 點擊「Save」

## 步驟 11：等待部署完成

GitHub 會自動構建並部署您的網站。等待 1-2 分鐘，然後刷新 Settings 頁面。

您會看到一個綠色的訊息，顯示您的網站已發佈在：
```
https://wf123477-boop.github.io/vocabulary-game
```

## 完成！

您現在可以通過上面的 URL 訪問您的單字練習遊戲了！

## 常見問題

### Q: 推送時出現「Permission denied」錯誤？
A: 確保您使用了正確的 Personal Access Token，而不是密碼。

### Q: 網站無法訪問？
A: 
1. 檢查 GitHub Pages 設置是否正確
2. 等待 5-10 分鐘讓 GitHub 完成部署
3. 檢查倉庫是否為 Public（私有倉庫需要付費才能使用 Pages）

### Q: 如何更新網站？
A: 修改本地文件後，執行：
```bash
git add .
git commit -m "Update: 您的更新描述"
git push
```

GitHub 會自動重新部署您的網站。

## 需要幫助？

如果您遇到任何問題，請查看 GitHub 官方文檔：
- Git 基礎：https://git-scm.com/doc
- GitHub Pages：https://docs.github.com/en/pages
