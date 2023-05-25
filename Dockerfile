ARG NODE_VERSION

FROM node:${NODE_VERSION}-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY vite*.config.ts ./
COPY env.d.ts ./
COPY index.html ./
COPY ./src ./src

RUN npm ci --quiet && npm run build

FROM node:${NODE_VERSION}-alpine 

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
COPY server.js ./

RUN npm ci --quiet --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 80

CMD [ "node", "server.js" ]
