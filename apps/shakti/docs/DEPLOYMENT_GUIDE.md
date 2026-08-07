# Deployment Guide

The SHAKTI Executive Dashboard is a standard Vite React Application. It compiles to static HTML/CSS/JS files and can be hosted on any static file server or CDN (S3, NGINX, Vercel, Netlify).

## 1. Prerequisites
- Node.js 18+ or 20+
- NPM or PNPM

## 2. Environment Setup
Ensure your CI/CD environment injects the correct backend URL during build time.
```bash
export VITE_CONTROL_PLANE_URL=https://api.production.internal/v1
```

## 3. Production Build
Run the Vite build command:
```bash
npm run build
```
This command performs type-checking via `tsc -b` and then invokes Vite to bundle the application into the `/dist` directory.

### Build Outputs
Because the dashboard heavily utilizes `React.lazy` and `Suspense`, the `/dist/assets` directory will contain dozens of small JavaScript chunks rather than one massive `index.js`. 
- `ExecutiveLayout-[hash].js`
- `ObservabilityLayout-[hash].js`
This is intentional and required for performance.

## 4. Hosting
Upload the contents of the `/dist` folder to your web server.
**Important for Single Page Apps (SPA):** Ensure your web server is configured to rewrite all 404 requests to `index.html`. 

### NGINX Example
```nginx
server {
    listen 80;
    server_name dashboard.internal;
    root /var/www/shakti-dashboard;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
