FROM node:18 AS build

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /poger

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

RUN rm -rf node_modules && pnpm install --frozen-lockfile --prod


FROM node:18

WORKDIR /poger

RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

COPY --from=build /poger .
COPY .env .

CMD [ "node", "." ]
