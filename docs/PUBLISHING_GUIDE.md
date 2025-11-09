# 发布指南 - Publishing Guide

本文档介绍如何将 GitHub Zread Button 扩展发布到各大浏览器扩展商店。

---

## 📋 发布前检查清单

### 1. 代码质量检查

```bash
# 运行所有测试
pnpm test

# TypeScript 类型检查
pnpm run type-check

# 代码格式检查
pnpm run lint

# 构建生产版本
pnpm run build
```

确保所有检查都通过! ✅

### 2. 准备扩展图标

需要准备以下尺寸的图标:

- **16x16** - 浏览器工具栏小图标
- **32x32** - Windows 系统
- **48x48** - 扩展管理页面
- **128x128** - Chrome Web Store 和安装时显示
- **440x280** - Chrome Web Store 小宣传图
- **920x680** - Chrome Web Store 大宣传图 (可选)
- **1280x800** - Chrome Web Store 截图 (至少1张,最多5张)

**当前状态:**
- ✅ `public/icon/zread-icon.svg` (需要转换为 PNG)
- ⚠️ 需要生成各种尺寸的 PNG 图标

**生成图标:**

```bash
# 使用在线工具或 ImageMagick
# 方法1: 使用在线工具
# - 访问 https://realfavicongenerator.net/
# - 上传你的 SVG 图标
# - 下载所有尺寸的 PNG

# 方法2: 使用 ImageMagick (如果已安装)
convert public/icon/zread-icon.svg -resize 16x16 public/icon/icon-16.png
convert public/icon/zread-icon.svg -resize 32x32 public/icon/icon-32.png
convert public/icon/zread-icon.svg -resize 48x48 public/icon/icon-48.png
convert public/icon/zread-icon.svg -resize 128x128 public/icon/icon-128.png
```

### 3. 准备宣传材料

#### 截图要求 (Chrome Web Store)
- **尺寸:** 1280x800 或 640x400
- **格式:** PNG 或 JPEG
- **数量:** 至少 1 张,最多 5 张
- **内容建议:**
  1. 按钮在 GitHub 仓库页面的展示 (明亮模式)
  2. 按钮在 GitHub 仓库页面的展示 (暗黑模式)
  3. 点击按钮后跳转到 Zread.ai 页面
  4. 扩展功能介绍图

#### 宣传图要求
- **小宣传图:** 440x280 (必需)
- **大宣传图:** 920x680 (可选,但推荐)
- **内容:** 突出扩展的核心功能和价值

### 4. 更新 manifest.json

检查 `wxt.config.ts` 中的 manifest 配置:

```typescript
export default defineConfig({
  manifest: {
    name: 'GitHub Zread Button',
    description: 'Adds a Zread.ai button to GitHub repository pages for quick access to documentation',
    version: '1.0.0',
    icons: {
      16: 'icon/icon-16.png',
      32: 'icon/icon-32.png',
      48: 'icon/icon-48.png',
      128: 'icon/icon-128.png',
    },
    // ... 其他配置
  },
});
```

---

## 🌐 发布到 Chrome Web Store

### 前置要求

1. **Google 开发者账号**
   - 访问: https://chrome.google.com/webstore/devconsole
   - 一次性注册费用: $5 USD
   - 需要 Google 账号

2. **准备构建产物**

```bash
# 构建 Chrome 版本
pnpm run build

# 打包为 ZIP
cd .output/chrome-mv3
zip -r ../../chrome-extension.zip .
cd ../..
```

### 发布步骤

#### 第 1 步: 登录开发者控制台

1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. 使用 Google 账号登录
3. 如果是首次使用,支付 $5 注册费

#### 第 2 步: 创建新项目

1. 点击 **"New Item"** (新建项)
2. 上传 `chrome-extension.zip` 文件
3. 等待上传完成

#### 第 3 步: 填写商店详情

**基本信息:**
- **扩展名称 (英文):** GitHub Zread Button
- **扩展名称 (中文):** GitHub Zread 按钮
- **简短描述 (英文,132 字符以内):**
  ```
  Quick access to Zread.ai documentation from any GitHub repository page
  ```
- **简短描述 (中文):**
  ```
  从任何 GitHub 仓库页面快速访问 Zread.ai 文档
  ```

**详细描述 (英文):**
```markdown
GitHub Zread Button adds a convenient "Zread" button to GitHub repository navigation, providing instant access to comprehensive documentation on Zread.ai.

✨ Features:
• One-click access to Zread.ai documentation
• Seamless GitHub UI integration
• Fast and lightweight (< 10KB)
• Privacy-focused (no tracking, no data collection)
• Light & dark theme support
• Works with GitHub's single-page navigation

🔒 Privacy:
This extension does not collect any data. All processing happens locally in your browser. No external API calls are made except when you click the button to visit Zread.ai.

📖 How to Use:
1. Install the extension
2. Visit any GitHub repository
3. Look for the "Zread" button in the navigation bar
4. Click to view comprehensive documentation on Zread.ai

Perfect for developers who want quick access to high-quality documentation while browsing GitHub repositories.

🆓 100% Free and Open Source
Source code: https://github.com/[your-username]/github-zread-button
```

**详细描述 (中文):**
```markdown
GitHub Zread Button 在 GitHub 仓库导航栏添加了一个便捷的 "Zread" 按钮,让你能够即时访问 Zread.ai 上的全面文档。

✨ 功能特性:
• 一键访问 Zread.ai 文档
• 无缝融入 GitHub UI
• 轻量快速 (< 10KB)
• 隐私优先 (无跟踪、无数据收集)
• 支持明暗主题
• 兼容 GitHub 单页导航

🔒 隐私保护:
本扩展不收集任何数据。所有处理都在浏览器本地完成。除了点击按钮访问 Zread.ai 外,不会进行任何外部 API 调用。

📖 使用方法:
1. 安装扩展
2. 访问任意 GitHub 仓库
3. 在导航栏找到 "Zread" 按钮
4. 点击查看 Zread.ai 上的全面文档

适合在浏览 GitHub 仓库时想要快速访问高质量文档的开发者。

🆓 100% 免费且开源
源代码: https://github.com/[your-username]/github-zread-button
```

**分类设置:**
- **主类别:** Developer Tools (开发者工具)
- **语言:** English, 中文

#### 第 4 步: 上传素材

1. **图标:** 上传 128x128 的主图标
2. **截图:** 上传 1-5 张 1280x800 的截图
3. **宣传图:** 上传 440x280 的小宣传图
4. **宣传图 (可选):** 上传 920x680 的大宣传图

#### 第 5 步: 隐私设置

**隐私实践披露:**

1. **数据使用声明:**
   - ✅ 不收集用户数据
   - ✅ 不使用个人信息
   - ✅ 不进行跟踪

2. **权限说明:**
   - `host_permissions: ["https://github.com/*"]` - 仅用于在 GitHub 页面注入按钮

3. **单一用途说明:**
   ```
   This extension has a single purpose: to add a "Zread" button to GitHub repository pages
   that links to Zread.ai documentation.
   ```

#### 第 6 步: 提交审核

1. 点击 **"Submit for review"** (提交审核)
2. 审核通常需要 **1-3 个工作日**
3. 你会收到邮件通知审核结果

---

## 🦊 发布到 Firefox Add-ons (AMO)

### 前置要求

1. **Firefox 开发者账号**
   - 访问: https://addons.mozilla.org/developers/
   - 免费注册,无需付费
   - 需要 Firefox 账号

2. **准备构建产物**

```bash
# 构建 Firefox 版本
pnpm run build:firefox

# 打包为 ZIP
cd .output/firefox-mv2
zip -r ../../firefox-extension.zip .
cd ../..
```

### 发布步骤

#### 第 1 步: 登录开发者中心

1. 访问 [Firefox Add-ons Developer Hub](https://addons.mozilla.org/developers/)
2. 使用 Firefox 账号登录
3. 点击 **"Submit a New Add-on"**

#### 第 2 步: 上传扩展

1. 选择 **"On this site"** (在此网站上发布)
2. 上传 `firefox-extension.zip`
3. Firefox 会自动验证扩展

#### 第 3 步: 填写版本信息

**基本信息:**
- **版本号:** 1.0.0
- **发行说明:**
  ```
  Initial release of GitHub Zread Button
  - Adds Zread button to GitHub repository pages
  - One-click access to Zread.ai documentation
  - Lightweight and privacy-focused
  ```

**源代码 (如果需要):**
- Firefox 可能要求提供源代码
- 上传完整的 GitHub 仓库或提供 GitHub 链接

#### 第 4 步: 填写扩展详情

**名称和描述 (同 Chrome 版本):**
- 使用与 Chrome Web Store 相同的名称和描述
- 支持多语言

**分类:**
- **类别:** Developer Tools
- **标签:** github, documentation, productivity

#### 第 5 步: 上传图标和截图

- **图标:** 64x64 和 128x128
- **截图:** 至少 1 张

#### 第 6 步: 提交审核

1. 点击 **"Submit Version"**
2. Firefox 审核通常需要 **1-2 周**
3. 审核过程中可能会有人工审查源代码

---

## 🌊 发布到 Microsoft Edge Add-ons

### 前置要求

1. **Microsoft Partner Center 账号**
   - 访问: https://partner.microsoft.com/dashboard
   - 需要 Microsoft 账号
   - 免费注册

2. **准备构建产物**

Edge 使用与 Chrome 相同的构建:

```bash
# 使用 Chrome 构建
pnpm run build
cd .output/chrome-mv3
zip -r ../../edge-extension.zip .
cd ../..
```

### 发布步骤

#### 第 1 步: 注册开发者账号

1. 访问 [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/overview)
2. 注册为扩展开发者 (免费)

#### 第 2 步: 提交新扩展

1. 点击 **"Create new extension"**
2. 上传 `edge-extension.zip`

#### 第 3 步: 填写详情

使用与 Chrome Web Store 类似的信息:
- 名称、描述、分类等
- 上传图标和截图

#### 第 4 步: 提交审核

- Edge 审核通常需要 **3-5 个工作日**
- 审核标准与 Chrome 类似

---

## 📦 版本管理最佳实践

### 语义化版本号 (Semantic Versioning)

遵循 `MAJOR.MINOR.PATCH` 格式:

- **MAJOR (主版本):** 重大功能变更或不兼容的 API 更改
  - 例: 1.0.0 → 2.0.0

- **MINOR (次版本):** 新功能添加,向后兼容
  - 例: 1.0.0 → 1.1.0

- **PATCH (补丁):** Bug 修复,向后兼容
  - 例: 1.0.0 → 1.0.1

### 发布新版本流程

```bash
# 1. 更新版本号
# 编辑 wxt.config.ts 中的 version 字段

# 2. 更新 CHANGELOG.md
# 记录本次版本的更改内容

# 3. Git 提交
git add .
git commit -m "chore: bump version to 1.1.0"
git tag v1.1.0
git push && git push --tags

# 4. 构建新版本
pnpm run build

# 5. 打包
cd .output/chrome-mv3
zip -r ../../chrome-extension-v1.1.0.zip .
cd ../..

# 6. 上传到各个商店
# - Chrome Web Store: 更新现有项目
# - Firefox AMO: 上传新版本
# - Edge Add-ons: 上传新版本
```

---

## 🚀 发布后的工作

### 1. 监控反馈

- **Chrome Web Store:** 查看用户评论和评分
- **Firefox AMO:** 查看评论和支持请求
- **GitHub Issues:** 接收 bug 报告和功能请求

### 2. 推广

发布博客文章或社交媒体:

```markdown
🎉 GitHub Zread Button 现已上线!

一键从任何 GitHub 仓库访问 Zread.ai 文档。

🔗 Chrome: [商店链接]
🔗 Firefox: [商店链接]
🔗 Edge: [商店链接]

✨ 功能:
• 轻量快速
• 隐私优先
• 无缝集成

#GitHub #Chrome #Firefox #开发工具
```

### 3. 持续维护

- 定期更新依赖
- 修复 bug
- 响应用户反馈
- 适配 GitHub UI 变化

---

## ⚠️ 常见问题和注意事项

### Chrome Web Store

**Q: 审核被拒绝了怎么办?**
A: 查看拒绝原因邮件,通常是因为:
- 隐私政策缺失或不清晰
- 权限使用说明不充分
- 单一用途原则违反
- 修复后重新提交即可

**Q: 多久审核一次?**
A: Chrome 的审核通常 1-3 天,但有时可能更长

### Firefox AMO

**Q: 为什么需要源代码?**
A: Firefox 对某些扩展要求提供源代码以便审查,尤其是使用了混淆或压缩的代码时

**Q: 审核很慢怎么办?**
A: Firefox 审核可能需要 1-2 周,耐心等待。可以在开发者中心查看进度

### Microsoft Edge

**Q: 可以直接使用 Chrome 的包吗?**
A: 是的,Edge 基于 Chromium,可以使用相同的构建

---

## 📊 发布检查表

发布前请确认:

- [ ] 所有测试通过
- [ ] 版本号已更新
- [ ] CHANGELOG.md 已更新
- [ ] README.md 信息完整
- [ ] 图标已准备 (16, 32, 48, 128)
- [ ] 截图已准备 (至少 1 张)
- [ ] 宣传图已准备 (440x280)
- [ ] 描述文本已准备 (英文+中文)
- [ ] 隐私政策已说明
- [ ] 构建产物已生成
- [ ] ZIP 文件已创建
- [ ] GitHub 仓库链接可访问
- [ ] 开发者账号已注册

---

## 🔗 有用的链接

**Chrome Web Store:**
- [开发者控制台](https://chrome.google.com/webstore/devconsole)
- [发布指南](https://developer.chrome.com/docs/webstore/publish/)
- [政策文档](https://developer.chrome.com/docs/webstore/program-policies/)

**Firefox Add-ons:**
- [开发者中心](https://addons.mozilla.org/developers/)
- [发布指南](https://extensionworkshop.com/documentation/publish/)
- [审核政策](https://extensionworkshop.com/documentation/publish/add-on-policies/)

**Microsoft Edge:**
- [合作伙伴中心](https://partner.microsoft.com/dashboard/microsoftedge/overview)
- [发布指南](https://learn.microsoft.com/microsoft-edge/extensions-chromium/publish/publish-extension)

**工具:**
- [图标生成器](https://realfavicongenerator.net/)
- [截图工具](https://www.screely.com/)
- [ZIP 打包](https://www.7-zip.org/)

---

**祝你发布顺利! 🎉**
