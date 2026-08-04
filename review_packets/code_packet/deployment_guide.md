# Deployment Guide

The SHAKTI Command Center dashboard is a standard Vite React Application. It compiles to static HTML/CSS/JS files and can be hosted on any static file server or CDN (S3, NGINX, Vercel, Netlify).

## Prerequisites
- Node.js ≥ 20.x
- NPM

## Environment Configuration
Define backend URLs before initiating production compile steps:

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

## Production Build
To bundle the dashboard:
```bash
npm run build
```
This performs a compile check (`tsc -b`) and generates production output inside `/dist`.

## Preview Build Locally
To check the production bundle locally:
```bash
npm run preview
```
This spins up a local server hosting the `/dist` files on `http://localhost:4173`.
