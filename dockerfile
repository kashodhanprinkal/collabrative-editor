# Stage 1: Build Frontend

FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY ./Frontend/package*.json ./
RUN npm install

COPY ./Frontend .
RUN npm run build

# Stage 2: Build Backend

FROM node:20-alpine

WORKDIR /app

COPY ./Backend/package*.json ./
RUN npm install

COPY ./Backend .

# Copy frontend build into backend public folder
COPY --from=frontend-builder /app/dist ./public

EXPOSE 3000

CMD ["npm", "start"]