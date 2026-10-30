FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package.json ./
COPY apps/api/package.json ./apps/api/package.json
RUN npm install --omit=dev --workspace=@sdas/api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
USER node
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node --from=dependencies /app/apps/api/node_modules ./apps/api/node_modules
COPY --chown=node:node apps/api ./apps/api
EXPOSE 5000
CMD ["node", "apps/api/src/server.js"]

