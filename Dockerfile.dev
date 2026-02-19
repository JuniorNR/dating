FROM node:lts-alpine3.22

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm prisma generate

CMD ["pnpm", "start:dev"]