# 六爻排盘 — 部署指南

> 纯前端 Vue 3 + Vite 静态应用，构建后输出到 `dist/` 目录，无需服务器端运行环境。

## 构建

```bash
cd liuyao
npm run build
```

构建产物位于 `dist/` 目录。

## 部署

应用已配置为根路径部署（`base: '/'`），域名 `https://caterliuyao.keytoix.vip/` 指向静态资源即可。

### 方式一：推送到 GitHub

```bash
git add .
git commit -m "..."
git push
```

### 方式二：手动上传

将 `dist/` 目录下的文件上传到静态服务器的根目录。

---

## Nginx 配置参考（SPA 路由）

静态域名使用 Nginx 时，需配置 fallback 到 `index.html`，否则刷新页面会 404：

```nginx
server {
    listen 80;
    server_name caterliuyao.keytoix.vip;

    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
