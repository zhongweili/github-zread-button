# 发布检查清单 - Release Checklist

使用此清单确保每次发布都完整、规范。

---

## 🔍 发布前检查 (Pre-Release)

### 代码质量
- [ ] 所有测试通过 (`pnpm test --run`)
- [ ] TypeScript 编译无错误 (`pnpm run type-check`)
- [ ] 代码已格式化 (`pnpm run format`)
- [ ] 代码已通过 lint 检查 (`pnpm run lint`)
- [ ] 没有 console.log 或 debugger 语句 (生产环境)

### 版本信息
- [ ] `wxt.config.ts` 中的版本号已更新
- [ ] `package.json` 中的版本号已更新
- [ ] `CHANGELOG.md` 已更新,记录本次版本的改动
- [ ] Git 工作目录干净 (没有未提交的更改)

### 文档
- [ ] README.md 准确描述当前功能
- [ ] 安装说明是最新的
- [ ] 使用示例是最新的
- [ ] LICENSE 文件存在且正确

### 功能测试
- [ ] 在 Chrome 中手动测试 (最新版)
- [ ] 在 Firefox 中手动测试 (最新版)
- [ ] 测试明亮模式
- [ ] 测试暗黑模式
- [ ] 测试 GitHub SPA 导航
- [ ] 测试不同类型的 GitHub 页面:
  - [ ] 仓库主页
  - [ ] Issues 页面
  - [ ] Pull Requests 页面
  - [ ] Code 页面
  - [ ] Actions 页面
- [ ] 按钮点击能正确跳转到 Zread.ai
- [ ] 按钮样式与 GitHub UI 一致
- [ ] 图标和文字间距正确

---

## 📦 构建和打包 (Build & Package)

### 自动化构建
- [ ] 运行发布准备脚本 (`pnpm run prepare-release`)
- [ ] 检查 `dist/` 目录中的所有 ZIP 文件
- [ ] 验证 checksums.txt 文件

### 手动检查
- [ ] 解压 Chrome 包,检查文件完整性
- [ ] 解压 Firefox 包,检查文件完整性
- [ ] 确认 manifest.json 中的版本号正确
- [ ] 确认所有必需的文件都包含在包中:
  - [ ] manifest.json
  - [ ] content.js
  - [ ] content.css
  - [ ] 图标文件

### 构建大小
- [ ] Chrome 包大小 < 100KB
- [ ] Firefox 包大小 < 100KB
- [ ] 没有不必要的文件 (如 .map, .DS_Store)

---

## 🎨 素材准备 (Assets)

### 图标
- [ ] icon-16.png (16x16)
- [ ] icon-32.png (32x32)
- [ ] icon-48.png (48x48)
- [ ] icon-128.png (128x128)
- [ ] 所有图标清晰,无锯齿

### 截图 (Chrome/Edge)
- [ ] 至少 1 张截图 (1280x800 或 640x400)
- [ ] 截图清晰,展示主要功能
- [ ] 建议: 明亮模式 1 张
- [ ] 建议: 暗黑模式 1 张
- [ ] 建议: 点击后跳转 1 张

### 宣传图 (Chrome/Edge)
- [ ] 小宣传图 440x280 (必需)
- [ ] 大宣传图 920x680 (可选但推荐)

---

## 🌐 商店信息 (Store Listings)

### 通用信息
- [ ] 扩展名称已确定 (英文和中文)
- [ ] 简短描述已准备 (< 132 字符)
- [ ] 详细描述已准备 (英文和中文)
- [ ] 分类已选择 (Developer Tools)
- [ ] 关键词已确定

### 隐私相关
- [ ] 隐私政策已说明 (无数据收集)
- [ ] 权限使用已解释
- [ ] 单一用途声明已准备

### 联系信息
- [ ] 支持邮箱已设置
- [ ] GitHub 仓库链接已准备
- [ ] 个人或组织网站链接 (可选)

---

## 🚀 发布流程 (Publishing)

### Git 操作
- [ ] 创建发布分支 (如果使用 Git Flow)
- [ ] 提交所有更改
- [ ] 创建 Git tag: `git tag v1.0.0`
- [ ] 推送代码: `git push`
- [ ] 推送标签: `git push --tags`
- [ ] 在 GitHub 上创建 Release (可选)

### Chrome Web Store
- [ ] 登录 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
- [ ] 上传新版本 ZIP 文件
- [ ] 填写版本信息和发行说明
- [ ] 上传截图和宣传图
- [ ] 填写隐私政策
- [ ] 提交审核
- [ ] 记录提交时间: _______________

### Firefox Add-ons (AMO)
- [ ] 登录 [Firefox Add-ons Developer Hub](https://addons.mozilla.org/developers/)
- [ ] 创建新扩展或上传新版本
- [ ] 上传 ZIP 文件
- [ ] 填写版本信息
- [ ] 提供源代码 (如果需要)
- [ ] 上传截图
- [ ] 提交审核
- [ ] 记录提交时间: _______________

### Microsoft Edge Add-ons
- [ ] 登录 [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/overview)
- [ ] 上传新版本
- [ ] 填写商店信息
- [ ] 上传素材
- [ ] 提交审核
- [ ] 记录提交时间: _______________

---

## 📢 发布后 (Post-Release)

### 监控
- [ ] 检查 Chrome Web Store 审核状态
- [ ] 检查 Firefox AMO 审核状态
- [ ] 检查 Edge Add-ons 审核状态
- [ ] 设置 Google Alerts 监控扩展提及

### 推广
- [ ] 在 GitHub README 中添加商店徽章
- [ ] 发布 Twitter/X 推文 (可选)
- [ ] 在相关社区分享 (可选)
- [ ] 更新个人网站/博客 (可选)

### 文档更新
- [ ] 更新 README 中的安装链接
- [ ] 更新文档中的版本号引用
- [ ] 确保所有链接可访问

### 监控反馈
- [ ] 监控用户评论 (Chrome)
- [ ] 监控用户评论 (Firefox)
- [ ] 监控用户评论 (Edge)
- [ ] 监控 GitHub Issues
- [ ] 设置邮件通知

---

## ⏱️ 审核时间线

### 预期审核时间
- **Chrome Web Store:** 1-3 个工作日
- **Firefox AMO:** 1-2 周
- **Microsoft Edge:** 3-5 个工作日

### 跟踪记录
| 商店 | 提交日期 | 审核开始 | 审核完成 | 状态 |
|------|----------|----------|----------|------|
| Chrome | ______ | ______ | ______ | _____ |
| Firefox | ______ | ______ | ______ | _____ |
| Edge | ______ | ______ | ______ | _____ |

---

## 🐛 如果审核被拒绝

### 常见拒绝原因
- [ ] 隐私政策不清晰或缺失
- [ ] 权限使用说明不充分
- [ ] 违反单一用途原则
- [ ] 包含恶意代码或可疑行为
- [ ] 元数据不准确或误导性

### 处理步骤
1. [ ] 仔细阅读拒绝邮件中的原因
2. [ ] 修复指出的问题
3. [ ] 更新代码/文档
4. [ ] 重新构建和打包
5. [ ] 重新提交审核
6. [ ] 在回复中说明已修复的问题

---

## 📝 发布记录

### v1.0.0
- 发布日期: _______________
- Chrome 审核通过: _______________
- Firefox 审核通过: _______________
- Edge 审核通过: _______________
- 备注: 首次发布

---

## 🔗 快速链接

**开发者控制台:**
- [Chrome Web Store](https://chrome.google.com/webstore/devconsole)
- [Firefox Add-ons](https://addons.mozilla.org/developers/)
- [Microsoft Edge](https://partner.microsoft.com/dashboard/microsoftedge/overview)

**文档:**
- [完整发布指南](./PUBLISHING_GUIDE.md)
- [Chrome 发布政策](https://developer.chrome.com/docs/webstore/program-policies/)
- [Firefox 发布政策](https://extensionworkshop.com/documentation/publish/add-on-policies/)

**工具:**
- 图标生成: https://realfavicongenerator.net/
- 截图美化: https://www.screely.com/
- 图片压缩: https://tinypng.com/

---

**最后检查:** 确认所有复选框都已勾选! ✅
