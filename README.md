<p align="center">
  <a href="#简体中文">简体中文</a> | 
  <a href="#繁體中文">繁體中文</a> | 
  <a href="#english">English</a>
</p>

---

<a name="简体中文"></a>

# 🎬 TermCast

<div align="center">

**智能终端录制与回放工具**

[![npm version](https://img.shields.io/npm/v/termcast.svg)](https://www.npmjs.com/package/termcast)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)

**录制 • 回放 • 导出 • 分享**

</div>

---

## 🎉 项目介绍

**TermCast** 是一款功能强大的终端录制与回放工具，专为开发者、技术写作者和教育工作者设计。

### 解决的痛点

- 📹 **录制演示困难**：传统录屏文件体积大，难以编辑和搜索
- 🔍 **内容难以检索**：终端输出无法被搜索和定位
- 📤 **分享不便**：录制文件格式不通用，难以嵌入文档
- 🔒 **敏感信息泄露**：录制中可能包含密码、密钥等敏感数据

### 自研差异化亮点

- ✨ **AI智能标注**：自动识别命令类型，生成描述说明
- 🎯 **敏感信息脱敏**：自动检测并脱敏密码、API密钥等
- 🔄 **多格式导出**：支持HTML、Markdown、GIF、asciinema等格式
- 🔎 **内容搜索**：在录制中快速定位关键内容
- ⚡ **轻量高效**：纯文本存储，文件体积小，易于版本控制

---

## ✨ 核心特性

### 🎬 录制功能
- **PTY支持**：真实终端环境录制，支持所有交互式程序
- **实时预览**：录制过程中实时显示终端输出
- **元数据捕获**：自动记录环境变量、Shell类型、终端尺寸

### ▶️ 回放功能
- **变速播放**：支持0.5x到4x倍速回放
- **精确定位**：按帧号或时间戳跳转
- **循环播放**：适合演示和展示场景
- **搜索定位**：在录制中搜索关键词

### 📤 导出功能
- **HTML**：带主题的独立网页，支持暗色/亮色模式
- **Markdown**：适合嵌入文档和博客
- **asciinema**：兼容asciinema生态
- **GIF/视频**：适合社交媒体分享

### 🤖 AI智能功能
- **命令识别**：自动识别100+常用命令
- **风险评级**：标注高危操作（如`rm -rf`、`sudo`）
- **分类统计**：按文件、Git、网络等类别统计命令

---

## 🚀 快速开始

### 环境要求

- **Node.js**: 16.0.0 或更高版本
- **操作系统**: macOS, Linux, Windows (WSL)

### 安装

```bash
# 使用 npm 安装
npm install -g termcast

# 或使用 yarn
yarn global add termcast

# 或克隆源码
git clone https://github.com/gitstq/termcast.git
cd termcast
npm install
npm run build
npm link
```

### 基本使用

```bash
# 开始录制
termcast record my-demo

# 播放录制
termcast play recordings/my-demo.cast

# 导出为 HTML
termcast export my-demo.cast -f html -o demo.html

# 查看录制信息
termcast info my-demo.cast

# 搜索录制内容
termcast search my-demo.cast "error"
```

---

## 📖 详细使用指南

### 录制终端会话

```bash
# 基本录制
termcast record

# 指定标题
termcast record --title "Git 工作流演示"

# 执行特定命令
termcast record --command "npm test"

# 指定输出目录
termcast record -o ./demos
```

**录制控制**：
- 按 `Ctrl+C` 或输入 `exit` 停止录制
- 录制文件保存在 `~/.termcast/recordings/` 目录

### 回放录制

```bash
# 正常播放
termcast play recording.cast

# 2倍速播放
termcast play recording.cast -s 2

# 循环播放
termcast play recording.cast --loop

# 从第100帧开始
termcast play recording.cast --start 100
```

### 导出录制

```bash
# 导出为 HTML（暗色主题）
termcast export recording.cast -f html --theme dark

# 导出为 Markdown
termcast export recording.cast -f markdown -o demo.md

# 导出并脱敏敏感信息
termcast export recording.cast -f html --redact

# 导出为 asciinema 格式
termcast export recording.cast -f asciinema
```

### 管理录制

```bash
# 列出所有录制
termcast list

# 查看录制详情
termcast info recording.cast

# 搜索录制内容
termcast search recording.cast "npm install"
```

---

## 💡 设计思路与迭代规划

### 设计理念

1. **轻量优先**：采用纯文本格式存储，文件体积小，易于版本控制
2. **兼容生态**：支持asciinema格式，无缝对接现有工具链
3. **安全可靠**：内置敏感信息检测和脱敏功能
4. **开发者友好**：提供完整的CLI和编程API

### 技术选型

| 技术 | 选型理由 |
|------|----------|
| TypeScript | 类型安全，开发体验好 |
| node-pty | 真实PTY支持，兼容所有终端程序 |
| Ink | React风格的终端UI |
| Commander.js | 成熟的CLI框架 |

### 后续迭代计划

- [ ] **Web播放器**：在线播放录制文件
- [ ] **云端同步**：支持多设备同步
- [ ] **协作分享**：生成分享链接
- [ ] **实时协作**：支持多人观看实时终端
- [ ] **插件系统**：支持自定义命令识别规则

---

## 📦 打包与部署指南

### 本地开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 运行测试
npm test
```

### 跨平台打包

```bash
# 打包所有平台
npm run pack:all

# 输出目录: dist/bin/
# - termcast-linux-x64
# - termcast-macos-x64
# - termcast-win-x64.exe
```

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
COPY bin ./bin
ENTRYPOINT ["node", "bin/termcast.js"]
```

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 提交 PR

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'feat: add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

### 提交 Issue

- 使用清晰的标题描述问题
- 提供复现步骤
- 附上相关日志和截图

### 代码规范

- 遵循 TypeScript 最佳实践
- 使用 ESLint 进行代码检查
- 编写单元测试覆盖新功能

---

## 📄 开源协议说明

本项目采用 **MIT 协议** 开源。

这意味着您可以：
- ✅ 商业使用
- ✅ 修改代码
- ✅ 分发代码
- ✅ 私人使用

唯一要求是保留原始版权声明。

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给一个 Star！⭐**

Made with ❤️ by [gitstq](https://github.com/gitstq)

</div>

---

<a name="繁體中文"></a>

# 🎬 TermCast

<div align="center">

**智能終端錄製與回放工具**

[![npm version](https://img.shields.io/npm/v/termcast.svg)](https://www.npmjs.com/package/termcast)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)

**錄製 • 回放 • 匯出 • 分享**

</div>

---

## 🎉 專案介紹

**TermCast** 是一款功能強大的終端錄製與回放工具，專為開發者、技術寫作者和教育工作者設計。

### 解決的痛點

- 📹 **錄製演示困難**：傳統錄屏檔案體積大，難以編輯和搜尋
- 🔍 **內容難以檢索**：終端輸出無法被搜尋和定位
- 📤 **分享不便**：錄製檔案格式不通用，難以嵌入文件
- 🔒 **敏感資訊洩露**：錄製中可能包含密碼、金鑰等敏感資料

### 自研差異化亮點

- ✨ **AI智慧標註**：自動識別命令類型，生成描述說明
- 🎯 **敏感資訊脫敏**：自動檢測並脫敏密碼、API金鑰等
- 🔄 **多格式匯出**：支援HTML、Markdown、GIF、asciinema等格式
- 🔎 **內容搜尋**：在錄製中快速定位關鍵內容
- ⚡ **輕量高效**：純文字儲存，檔案體積小，易於版本控制

---

## ✨ 核心特性

### 🎬 錄製功能
- **PTY支援**：真實終端環境錄製，支援所有互動式程式
- **即時預覽**：錄製過程中即時顯示終端輸出
- **元資料捕獲**：自動記錄環境變數、Shell類型、終端尺寸

### ▶️ 回放功能
- **變速播放**：支援0.5x到4x倍速回放
- **精確定位**：按幀號或時間戳跳轉
- **循環播放**：適合演示和展示場景
- **搜尋定位**：在錄製中搜尋關鍵詞

### 📤 匯出功能
- **HTML**：帶主題的獨立網頁，支援暗色/亮色模式
- **Markdown**：適合嵌入文件和部落格
- **asciinema**：相容asciinema生態
- **GIF/影片**：適合社群媒體分享

### 🤖 AI智慧功能
- **命令識別**：自動識別100+常用命令
- **風險評級**：標註高危操作（如`rm -rf`、`sudo`）
- **分類統計**：按檔案、Git、網路等類別統計命令

---

## 🚀 快速開始

### 環境要求

- **Node.js**: 16.0.0 或更高版本
- **作業系統**: macOS, Linux, Windows (WSL)

### 安裝

```bash
# 使用 npm 安裝
npm install -g termcast

# 或使用 yarn
yarn global add termcast

# 或克隆原始碼
git clone https://github.com/gitstq/termcast.git
cd termcast
npm install
npm run build
npm link
```

### 基本使用

```bash
# 開始錄製
termcast record my-demo

# 播放錄製
termcast play recordings/my-demo.cast

# 匯出為 HTML
termcast export my-demo.cast -f html -o demo.html

# 查看錄製資訊
termcast info my-demo.cast

# 搜尋錄製內容
termcast search my-demo.cast "error"
```

---

## 📖 詳細使用指南

### 錄製終端會話

```bash
# 基本錄製
termcast record

# 指定標題
termcast record --title "Git 工作流演示"

# 執行特定命令
termcast record --command "npm test"

# 指定輸出目錄
termcast record -o ./demos
```

**錄製控制**：
- 按 `Ctrl+C` 或輸入 `exit` 停止錄製
- 錄製檔案儲存在 `~/.termcast/recordings/` 目錄

### 回放錄製

```bash
# 正常播放
termcast play recording.cast

# 2倍速播放
termcast play recording.cast -s 2

# 循環播放
termcast play recording.cast --loop

# 從第100幀開始
termcast play recording.cast --start 100
```

### 匯出錄製

```bash
# 匯出為 HTML（暗色主題）
termcast export recording.cast -f html --theme dark

# 匯出為 Markdown
termcast export recording.cast -f markdown -o demo.md

# 匯出並脫敏敏感資訊
termcast export recording.cast -f html --redact

# 匯出為 asciinema 格式
termcast export recording.cast -f asciinema
```

### 管理錄製

```bash
# 列出所有錄製
termcast list

# 查看錄製詳情
termcast info recording.cast

# 搜尋錄製內容
termcast search recording.cast "npm install"
```

---

## 💡 設計思路與迭代規劃

### 設計理念

1. **輕量優先**：採用純文字格式儲存，檔案體積小，易於版本控制
2. **相容生態**：支援asciinema格式，無縫對接現有工具鏈
3. **安全可靠**：內建敏感資訊檢測和脫敏功能
4. **開發者友善**：提供完整的CLI和程式設計API

### 技術選型

| 技術 | 選型理由 |
|------|----------|
| TypeScript | 類型安全，開發體驗好 |
| node-pty | 真實PTY支援，相容所有終端程式 |
| Ink | React風格的終端UI |
| Commander.js | 成熟的CLI框架 |

### 後續迭代計劃

- [ ] **Web播放器**：線上播放錄製檔案
- [ ] **雲端同步**：支援多裝置同步
- [ ] **協作分享**：生成分享連結
- [ ] **即時協作**：支援多人觀看即時終端
- [ ] **外掛系統**：支援自訂命令識別規則

---

## 📦 打包與部署指南

### 本地開發

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建構
npm run build

# 執行測試
npm test
```

### 跨平台打包

```bash
# 打包所有平台
npm run pack:all

# 輸出目錄: dist/bin/
# - termcast-linux-x64
# - termcast-macos-x64
# - termcast-win-x64.exe
```

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
COPY bin ./bin
ENTRYPOINT ["node", "bin/termcast.js"]
```

---

## 🤝 貢獻指南

我們歡迎所有形式的貢獻！

### 提交 PR

1. Fork 本倉庫
2. 建立功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'feat: add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交 Pull Request

### 提交 Issue

- 使用清晰的標題描述問題
- 提供重現步驟
- 附上相關日誌和截圖

### 程式碼規範

- 遵循 TypeScript 最佳實踐
- 使用 ESLint 進行程式碼檢查
- 編寫單元測試覆蓋新功能

---

## 📄 開源協議說明

本專案採用 **MIT 協議** 開源。

這意味著您可以：
- ✅ 商業使用
- ✅ 修改程式碼
- ✅ 分發程式碼
- ✅ 私人使用

唯一要求是保留原始版權聲明。

---

<div align="center">

**⭐ 如果這個專案對您有幫助，請給一個 Star！⭐**

Made with ❤️ by [gitstq](https://github.com/gitstq)

</div>

---

<a name="english"></a>

# 🎬 TermCast

<div align="center">

**Intelligent Terminal Recording & Playback Tool**

[![npm version](https://img.shields.io/npm/v/termcast.svg)](https://www.npmjs.com/package/termcast)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)

**Record • Playback • Export • Share**

</div>

---

## 🎉 Introduction

**TermCast** is a powerful terminal recording and playback tool designed for developers, technical writers, and educators.

### Problems We Solve

- 📹 **Difficult Demo Recording**: Traditional screen recordings are large and hard to edit or search
- 🔍 **Hard to Search Content**: Terminal output cannot be searched or located
- 📤 **Inconvenient Sharing**: Recording formats are not universal, hard to embed in documents
- 🔒 **Sensitive Data Leakage**: Recordings may contain passwords, keys, and other sensitive data

### Unique Features

- ✨ **AI-Powered Annotations**: Automatically identify command types and generate descriptions
- 🎯 **Sensitive Data Redaction**: Automatically detect and redact passwords, API keys, etc.
- 🔄 **Multi-Format Export**: Support HTML, Markdown, GIF, asciinema and more
- 🔎 **Content Search**: Quickly locate key content in recordings
- ⚡ **Lightweight & Efficient**: Plain text storage, small file size, easy version control

---

## ✨ Core Features

### 🎬 Recording
- **PTY Support**: Real terminal environment recording, supports all interactive programs
- **Real-time Preview**: Display terminal output during recording
- **Metadata Capture**: Automatically record environment variables, shell type, terminal size

### ▶️ Playback
- **Variable Speed**: Support 0.5x to 4x playback speed
- **Precise Positioning**: Jump by frame number or timestamp
- **Loop Playback**: Perfect for demos and presentations
- **Search & Locate**: Search keywords in recordings

### 📤 Export
- **HTML**: Standalone webpage with themes, supports dark/light mode
- **Markdown**: Perfect for embedding in docs and blogs
- **asciinema**: Compatible with asciinema ecosystem
- **GIF/Video**: Great for social media sharing

### 🤖 AI Features
- **Command Recognition**: Automatically identify 100+ common commands
- **Risk Rating**: Flag dangerous operations (like `rm -rf`, `sudo`)
- **Category Statistics**: Count commands by file, git, network, etc.

---

## 🚀 Quick Start

### Requirements

- **Node.js**: 16.0.0 or higher
- **OS**: macOS, Linux, Windows (WSL)

### Installation

```bash
# Install with npm
npm install -g termcast

# Or with yarn
yarn global add termcast

# Or clone from source
git clone https://github.com/gitstq/termcast.git
cd termcast
npm install
npm run build
npm link
```

### Basic Usage

```bash
# Start recording
termcast record my-demo

# Play recording
termcast play recordings/my-demo.cast

# Export to HTML
termcast export my-demo.cast -f html -o demo.html

# View recording info
termcast info my-demo.cast

# Search recording content
termcast search my-demo.cast "error"
```

---

## 📖 Detailed Guide

### Recording Terminal Sessions

```bash
# Basic recording
termcast record

# Specify title
termcast record --title "Git Workflow Demo"

# Execute specific command
termcast record --command "npm test"

# Specify output directory
termcast record -o ./demos
```

**Recording Controls**:
- Press `Ctrl+C` or type `exit` to stop recording
- Recordings are saved in `~/.termcast/recordings/` directory

### Playing Recordings

```bash
# Normal playback
termcast play recording.cast

# 2x speed playback
termcast play recording.cast -s 2

# Loop playback
termcast play recording.cast --loop

# Start from frame 100
termcast play recording.cast --start 100
```

### Exporting Recordings

```bash
# Export to HTML (dark theme)
termcast export recording.cast -f html --theme dark

# Export to Markdown
termcast export recording.cast -f markdown -o demo.md

# Export with sensitive data redaction
termcast export recording.cast -f html --redact

# Export to asciinema format
termcast export recording.cast -f asciinema
```

### Managing Recordings

```bash
# List all recordings
termcast list

# View recording details
termcast info recording.cast

# Search recording content
termcast search recording.cast "npm install"
```

---

## 💡 Design Philosophy & Roadmap

### Design Principles

1. **Lightweight First**: Plain text format storage, small file size, easy version control
2. **Ecosystem Compatible**: Support asciinema format, seamless integration with existing tools
3. **Secure & Reliable**: Built-in sensitive data detection and redaction
4. **Developer Friendly**: Complete CLI and programming API

### Tech Stack

| Technology | Reason |
|------------|--------|
| TypeScript | Type safety, great developer experience |
| node-pty | Real PTY support, compatible with all terminal programs |
| Ink | React-style terminal UI |
| Commander.js | Mature CLI framework |

### Future Roadmap

- [ ] **Web Player**: Online playback of recording files
- [ ] **Cloud Sync**: Multi-device synchronization support
- [ ] **Collaborative Sharing**: Generate shareable links
- [ ] **Real-time Collaboration**: Multi-user live terminal viewing
- [ ] **Plugin System**: Support custom command recognition rules

---

## 📦 Build & Deployment

### Local Development

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build
npm run build

# Run tests
npm test
```

### Cross-Platform Packaging

```bash
# Package for all platforms
npm run pack:all

# Output directory: dist/bin/
# - termcast-linux-x64
# - termcast-macos-x64
# - termcast-win-x64.exe
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
COPY bin ./bin
ENTRYPOINT ["node", "bin/termcast.js"]
```

---

## 🤝 Contributing

We welcome all forms of contributions!

### Submitting PRs

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Submit Pull Request

### Submitting Issues

- Use clear titles to describe problems
- Provide reproduction steps
- Include relevant logs and screenshots

### Code Standards

- Follow TypeScript best practices
- Use ESLint for code linting
- Write unit tests for new features

---

## 📄 License

This project is open-sourced under the **MIT License**.

This means you can:
- ✅ Commercial use
- ✅ Modify code
- ✅ Distribute code
- ✅ Private use

The only requirement is to preserve the original copyright notice.

---

<div align="center">

**⭐ If this project helps you, please give it a Star! ⭐**

Made with ❤️ by [gitstq](https://github.com/gitstq)

</div>
