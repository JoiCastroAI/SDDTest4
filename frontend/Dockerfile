# ---- Build stage ----
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:20-slim AS runtime

RUN groupadd --gid 1001 appuser && \
    useradd --uid 1001 --gid appuser --shell /bin/bash --create-home appuser

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

USER appuser

EXPOSE 5173

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD node -e "const http = require('http'); http.get('http://localhost:5173', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1));" || exit 1

CMD ["serve", "-s", "dist", "-l", "5173"]
