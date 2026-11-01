# Mandate Storefront — judge-friendly container
# Runs the exact same flow as `npm run dev` (API + Vite), zero credentials.
# Node 22.9+ required (the --env-file-if-exists flag); 22-alpine is well past that.
FROM node:22-alpine

WORKDIR /app

# Install deps first for layer caching
COPY package.json package-lock.json ./
RUN npm ci

# App source only — .env, docs, and git are excluded via .dockerignore
COPY . .

EXPOSE 5173

# vite --host so the page is reachable from outside the container
CMD ["npx", "concurrently", "-n", "server,client", "-c", "blue,magenta", \
     "tsx --env-file-if-exists=.env server/index.ts", "vite --host"]
