# PWA 安装说明

## 当前状态

由于生成的图标实际尺寸为 1024x1024px，已更新配置以匹配实际尺寸。

## 如何测试 PWA 安装

### Chrome/Edge 浏览器

1. 打开应用：http://localhost:5173/
2. 等待几秒钟让 Service Worker 注册
3. 查看地址栏右侧是否出现安装图标 ⊕
4. 或者点击浏览器菜单 → "安装极简Todo"

### 检查 PWA 状态

打开浏览器开发者工具（F12）：

1. **Application** 标签页
2. 查看 **Manifest** 部分，确认配置正确
3. 查看 **Service Workers** 部分，确认已注册
4. 查看 **Storage** → **IndexedDB**，确认数据库已创建

### 如果仍然无法安装

PWA 安装需要满足以下条件：

1. ✅ 使用 HTTPS 或 localhost
2. ✅ 有有效的 Web App Manifest
3. ✅ 注册了 Service Worker
4. ⚠️ 图标尺寸需要符合规范（建议 192x192 和 512x512）

## 临时解决方案

由于当前图标尺寸为 1024x1024，建议：

1. 使用图片编辑工具将图标调整为标准尺寸
2. 或者使用在线工具生成多尺寸图标：
   - https://realfavicongenerator.net/
   - https://www.pwabuilder.com/imageGenerator

## 生产环境部署

生产环境构建时：

```bash
npm run build
npm run preview
```

然后访问预览地址测试 PWA 功能。
