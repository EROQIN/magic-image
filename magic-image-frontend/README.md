# 魔法图片处理工具 - 前端应用

一个基于 React + TypeScript + Vite 开发的纯前端魔法图片处理应用。可以将两张图片合并成一个魔法图片，也可以从魔法图片中提取隐藏的内容。

## ✨ 功能特性

### 🎨 魔法图片创建
- 将两张图片合并成一个魔法图片文件
- 第一张图片在普通查看器中可见
- 第二张图片隐藏在文件中，只能通过专用工具提取
- 支持 PNG、JPEG、GIF、BMP 格式
- 拖拽上传，操作简单直观

### 🔍 魔法图片查看
- **分析模式**：分析魔法图片的内部结构，显示详细信息
- **普通模式**：提取并显示第一张图片
- **魔法模式**：提取并显示隐藏的第二张图片
- 实时预览提取结果
- 一键下载提取的图片

### 🛡️ 安全特性
- **纯前端处理**：文件不会上传到服务器
- **隐私保护**：所有处理都在浏览器本地完成
- **离线使用**：支持离线环境使用
- **开源免费**：完全开源，无任何费用

## 🚀 快速开始

### 环境要求
- Node.js 16+ 
- npm 或 yarn 包管理器
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
应用将在 `http://localhost:5173` 启动

### 构建生产版本
```bash
npm run build
```
构建文件将生成在 `dist` 目录

### 预览生产版本
```bash
npm run preview
```

## 📁 项目结构

```
magic-image-frontend/
├── src/
│   ├── components/           # React 组件
│   │   ├── ImageUploader.tsx    # 图片上传组件
│   │   ├── MagicImageCreator.tsx # 魔法图片创建器
│   │   └── MagicImageViewer.tsx  # 魔法图片查看器
│   ├── utils/               # 工具类
│   │   └── MagicImageProcessor.ts # 核心处理逻辑
│   ├── types/               # TypeScript 类型定义
│   │   └── index.ts
│   ├── App.tsx              # 主应用组件
│   ├── App.css              # 样式文件
│   └── main.tsx             # 应用入口
├── public/                  # 静态资源
├── package.json
└── README.md
```

## 🎯 使用说明

### 创建魔法图片
1. 点击导航栏的"创建魔法图片"
2. 上传第一张图片（可见图片）
3. 上传第二张图片（隐藏图片）
4. 点击"创建魔法图片"按钮
5. 下载生成的魔法图片

### 查看魔法图片
1. 点击导航栏的"查看魔法图片"
2. 上传魔法图片文件
3. 选择查看模式：
   - **分析模式**：查看图片结构信息
   - **普通模式**：提取第一张图片
   - **魔法模式**：提取隐藏图片
4. 点击相应按钮进行处理
5. 预览和下载提取的图片

## 🔧 技术栈

- **前端框架**：React 19 + TypeScript
- **构建工具**：Vite 7
- **UI 组件库**：Ant Design 5
- **图标库**：@ant-design/icons
- **样式**：CSS + Ant Design 主题
- **文件处理**：File API + ArrayBuffer + Blob API

## 🎨 核心技术实现

### 图片格式检测
通过读取文件头的魔数（Magic Number）来识别图片格式：
- PNG: `89 50 4E 47 0D 0A 1A 0A`
- JPEG: `FF D8 FF`
- GIF: `47 49 46 38`
- BMP: `42 4D`

### 魔法图片创建
```typescript
// 简化的创建逻辑
const image1Buffer = await image1.arrayBuffer();
const image2Buffer = await image2.arrayBuffer();
const combinedData = new Uint8Array(image1Buffer.byteLength + image2Buffer.byteLength);
combinedData.set(new Uint8Array(image1Buffer), 0);
combinedData.set(new Uint8Array(image2Buffer), image1Buffer.byteLength);
const magicBlob = new Blob([combinedData], { type: image1.type });
```

### 隐藏图片提取
通过智能算法查找第二张图片的起始位置，避免在第一张图片内部的误判：
```typescript
// 智能查找下一个图片签名
const nextImage = findNextImageStart(data, firstImageEnd, minGap);
const hiddenImageData = data.slice(nextImage.position, nextImageEnd);
```

## 🌟 特色功能

### 智能边界检测
- 避免在第一张图片内部误识别图片签名
- 使用最小间隔算法确保准确分割
- 支持各种图片格式的混合使用

### 用户体验优化
- 拖拽上传支持
- 实时进度显示
- 图片预览功能
- 响应式设计
- 错误处理和用户提示

### 性能优化
- 使用 Web Workers 处理大文件（计划中）
- 内存管理和资源清理
- 分块处理避免浏览器卡顿

## 📱 浏览器兼容性

| 浏览器 | 版本要求 | 支持状态 |
|--------|----------|----------|
| Chrome | 60+ | ✅ 完全支持 |
| Firefox | 60+ | ✅ 完全支持 |
| Safari | 12+ | ✅ 完全支持 |
| Edge | 79+ | ✅ 完全支持 |
| IE | - | ❌ 不支持 |

## 🚀 部署方案

### Vercel 部署（推荐）
```bash
npm install -g vercel
vercel --prod
```

### Netlify 部署
```bash
npm run build
# 将 dist 目录上传到 Netlify
```

### GitHub Pages 部署
```bash
npm run build
# 将 dist 目录内容推送到 gh-pages 分支
```

### 自定义服务器
```bash
npm run build
# 将 dist 目录部署到任何静态文件服务器
```

## 🔒 安全考虑

- 文件大小限制：单文件最大 50MB
- 文件类型验证：只允许图片格式
- 内存管理：及时清理 ArrayBuffer 和 Blob URL
- 错误处理：完善的异常捕获和用户提示

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [React](https://reactjs.org/) - 前端框架
- [Ant Design](https://ant.design/) - UI 组件库
- [Vite](https://vitejs.dev/) - 构建工具
- [TypeScript](https://www.typescriptlang.org/) - 类型系统

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 加入讨论群

---

**享受魔法图片的乐趣！** ✨