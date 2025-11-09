# 🚀 快速开始 - Quick Start

## 现在就发布到 Chrome Web Store!

### 第 1 步: 准备发布包 (2 分钟)

```bash
# 运行自动化发布准备脚本
pnpm run prepare-release
```

这个脚本会:
- ✅ 运行所有测试
- ✅ 检查 TypeScript 类型
- ✅ 构建所有浏览器版本
- ✅ 创建 ZIP 发布包

完成后,你会在 `dist/` 目录看到:
```
dist/
├── github-zread-button-chrome-v1.0.0.zip    ← 上传到 Chrome
├── github-zread-button-firefox-v1.0.0.zip   ← 上传到 Firefox
├── github-zread-button-edge-v1.0.0.zip      ← 上传到 Edge
└── checksums.txt
```

---

### 第 2 步: 注册开发者账号

#### Chrome Web Store (推荐先发布这里)
1. 访问: https://chrome.google.com/webstore/devconsole
2. 使用 Google 账号登录
3. 支付 $5 一次性注册费
4. ✅ 完成!

#### Firefox Add-ons (免费)
1. 访问: https://addons.mozilla.org/developers/
2. 使用 Firefox 账号注册
3. ✅ 完全免费!

#### Microsoft Edge (免费)
1. 访问: https://partner.microsoft.com/dashboard
2. 使用 Microsoft 账号注册
3. ✅ 完全免费!

---

### 第 3 步: 上传到 Chrome Web Store (5 分钟)

1. **创建新项目**
   - 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - 点击 "New Item"
   - 上传 `dist/github-zread-button-chrome-v1.0.0.zip`

2. **填写商店详情**

   **扩展名称 (英文):**
   ```
   GitHub Zread Button
   ```

   **简短描述 (132 字符以内):**
   ```
   Quick access to Zread.ai documentation from any GitHub repository page
   ```

   **详细描述:**
   ```markdown
   GitHub Zread Button adds a convenient "Zread" button to GitHub repository navigation,
   providing instant access to comprehensive documentation on Zread.ai.

   ✨ Features:
   • One-click access to Zread.ai documentation
   • Seamless GitHub UI integration
   • Fast and lightweight (< 10KB)
   • Privacy-focused (no tracking, no data collection)
   • Light & dark theme support
   • Works with GitHub's single-page navigation

   🔒 Privacy:
   This extension does not collect any data. All processing happens locally in your browser.

   📖 How to Use:
   1. Install the extension
   2. Visit any GitHub repository
   3. Click the "Zread" button in the navigation bar
   4. View comprehensive documentation on Zread.ai
   ```

   **分类:**
   - 主类别: Developer Tools
   - 语言: English

3. **上传素材**

   **需要准备:**
   - 主图标 128x128 (必需)
   - 截图 1280x800 (至少 1 张)
   - 宣传图 440x280 (推荐)

   **临时方案 (如果还没有准备好素材):**
   - 使用现有的 `public/icon/zread-icon.svg`
   - 在 GitHub 页面截图作为示例图
   - 后续可以更新

4. **隐私设置**
   - ✅ 选择 "不收集用户数据"
   - 说明权限用途:
     ```
     This extension only requires access to github.com to inject the Zread button.
     No data is collected or transmitted.
     ```

5. **提交审核**
   - 点击 "Submit for review"
   - 等待 1-3 个工作日

---

### 第 4 步: 等待审核 ⏳

**审核时间:**
- Chrome: 1-3 个工作日
- Firefox: 1-2 周
- Edge: 3-5 个工作日

**审核期间你可以:**
- 准备更好的截图和宣传图
- 在社交媒体预告
- 准备发布博客文章

---

### 第 5 步: 审核通过后 🎉

**审核通过后立即做:**
1. 在 README.md 中添加商店徽章:
   ```markdown
   [![Chrome Web Store](https://img.shields.io/chrome-web-store/v/YOUR_EXTENSION_ID.svg)](https://chrome.google.com/webstore/detail/YOUR_EXTENSION_ID)
   ```

2. 发推文庆祝:
   ```
   🎉 GitHub Zread Button 现已上线 Chrome Web Store!

   一键从任何 GitHub 仓库访问 Zread.ai 文档。

   🔗 [商店链接]

   #GitHub #Chrome #开发工具
   ```

3. 在相关社区分享 (可选):
   - Product Hunt
   - Hacker News
   - Reddit r/chrome_extensions
   - V2EX

---

## 🎯 最小化发布流程 (极简版)

如果你想最快发布,只需要:

```bash
# 1. 准备发布包
pnpm run prepare-release

# 2. 上传 dist/github-zread-button-chrome-v1.0.0.zip 到 Chrome Web Store

# 3. 填写基本信息 (名称、描述)

# 4. 提交审核

# 完成! 🎉
```

素材可以后续慢慢完善,先发布最小可用版本!

---

## 📚 更多资源

**详细发布指南:**
- 查看 [docs/PUBLISHING_GUIDE.md](./docs/PUBLISHING_GUIDE.md) 了解完整发布流程

**发布检查清单:**
- 使用 [docs/RELEASE_CHECKLIST.md](./docs/RELEASE_CHECKLIST.md) 确保不遗漏任何步骤

**常见问题:**
- 在发布指南中有详细的 FAQ 章节

---

## ⚡ 常见问题快速解答

**Q: 我需要准备什么素材?**
A: 最少只需要:
- 128x128 的图标 (可以先用 SVG 转换)
- 1 张截图 (在 GitHub 页面截图即可)

**Q: 审核一般需要多久?**
A: Chrome 通常 1-3 天,Firefox 1-2 周,Edge 3-5 天

**Q: 如果审核被拒绝怎么办?**
A: 查看拒绝原因邮件,修复问题后重新提交。常见原因:
- 隐私政策说明不清楚
- 权限使用未说明

**Q: 发布需要付费吗?**
A:
- Chrome: $5 一次性注册费
- Firefox: 完全免费
- Edge: 完全免费

**Q: 可以同时发布到多个商店吗?**
A: 可以!建议顺序:
1. Chrome (最快)
2. Edge (使用相同包)
3. Firefox (需要单独构建)

---

**祝你发布顺利! 🚀**

有问题随时查看完整文档或在 GitHub Issues 提问。
