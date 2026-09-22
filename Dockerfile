# Etapa 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@11.20.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build


# Etapa 2: Producción
FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/content ./content
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3333 || exit 1

# Sin pnpm en runtime: pnpm 11 ejecuta un `pnpm install` automático
# (verifyDepsBeforeRun) al correr comandos y falla al no tener pnpm-workspace.yaml.
# Ejecutamos los binarios directamente desde node_modules.
CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && ./node_modules/.bin/next start"]