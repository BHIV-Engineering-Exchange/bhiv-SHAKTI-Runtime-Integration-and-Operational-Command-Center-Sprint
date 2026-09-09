# Deployment Guide

The SHAKTI Executive Dashboard is a standard Vite React Application. It compiles to static HTML/CSS/JS files and can be hosted on any static file server or CDN (S3, NGINX, Vercel, Netlify).

## 1. Prerequisites
- Node.js ≥ 20.x
- NPM or PNPM

## 2. Environment Setup
Ensure your CI/CD environment injects the correct backend URLs during build time. All VITE environment variables must be defined before compilation:

```bash
export VITE_CONTROL_PLANE_URL=https://api.production.internal/v1
export VITE_BUCKET_SERVICE_URL=https://bhiv-bucket-i1l6.onrender.com
export VITE_PRANA_SERVICE_URL=http://163.128.209.18:8103
export VITE_NIYANTRAN_URL=http://localhost:5001
export VITE_NIYANTRAN_EXECUTION_KEY=59d175200c3e26b42ba1532cd40090532b3e59c93be652311acbcdd6155dbb13159d8125a48364672d6c1d3d868fc2cf
export VITE_NIYANTRAN_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
export VITE_INSIGHTFLOW_URL=https://bhiv-svacs.onrender.com
export VITE_TANTRA_BASE_URL=https://tantra-gated-bridge-infrastructure.onrender.com
export VITE_TANTRA_BRIDGE_SIGNATURE=Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token_issued_by_sarathi
export VITE_RAJYA_BASE_URL=https://text-risk-scoring-service.onrender.com
export VITE_SANSKAR_BASE_URL=http://localhost:8000
export VITE_KARMA_URL=http://163.128.209.18:8102
export VITE_KESHAV_URL=https://keshav-cia7.onrender.com
export VITE_SETU_URL=https://db05-2409-40c2-103d-46f0-9d7b-3c78-2cde-82d4.ngrok-free.app
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
- `WorkflowLayout-[hash].js`
- ...and other lazy-loaded layouts.
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
