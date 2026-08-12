# Stage 1: Build the Vite + React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install dependencies (using clean-install)
RUN npm ci

# Copy the rest of the application files
COPY . .


# Set non-sensitive environment variables directly in the Dockerfile
ENV VITE_CONTROL_PLANE_URL="http://127.0.0.1:8009"
ENV VITE_BUCKET_SERVICE_URL="https://bhiv-bucket-i1l6.onrender.com"
ENV VITE_PRANA_SERVICE_URL="http://163.128.209.18:8103"
ENV VITE_NIYANTRAN_URL="https://niyantran.blackholeinfiverse.com"
ENV VITE_INSIGHTFLOW_URL="https://bhiv-svacs.onrender.com"
ENV VITE_TANTRA_BASE_URL="https://tantra-gated-bridge-infrastructure.onrender.com"
ENV VITE_RAJYA_BASE_URL="https://text-risk-scoring-service.onrender.com"
ENV VITE_SANSKAR_BASE_URL="http://localhost:8000"
ENV VITE_KARMA_URL="http://163.128.209.18:8102"
ENV VITE_KESHAV_URL="https://keshav-cia7.onrender.com"
ENV VITE_SETU_URL="https://f12f-2409-40c2-1036-1957-5840-48d5-a6b3-98ab.ngrok-free.app"

# Declare build arguments for sensitive variables passed via GitHub secrets
ARG VITE_NIYANTRAN_EXECUTION_KEY
ARG VITE_NIYANTRAN_AUTH_TOKEN
ARG VITE_TANTRA_BRIDGE_SIGNATURE

# Map sensitive build args to environment variables for Vite build process
ENV VITE_NIYANTRAN_EXECUTION_KEY=$VITE_NIYANTRAN_EXECUTION_KEY
ENV VITE_NIYANTRAN_AUTH_TOKEN=$VITE_NIYANTRAN_AUTH_TOKEN
ENV VITE_TANTRA_BRIDGE_SIGNATURE=$VITE_TANTRA_BRIDGE_SIGNATURE

# Build the production bundle
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache curl && npm install -g serve
COPY --from=build /app/dist ./dist
RUN adduser --disabled-password --gecos "" frontend && \
    chown -R frontend:frontend /app
USER frontend
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]

