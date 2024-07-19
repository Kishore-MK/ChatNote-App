FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install
RUN npx prisma generate

EXPOSE 3000

RUN npm run build

CMD npm run dev