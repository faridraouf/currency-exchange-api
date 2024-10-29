# Stage 1: Build the application
FROM node:18-alpine AS builder

# set the working directory
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install --production

# copy the rest of the application files
COPY . .

# Stage 2: Create a lightweight production image
FROM node:18-alpine AS runtime

# set the working directory
WORKDIR /app

# copy only the necessary files from the builder stage
COPY --from=builder /app .

# port number
EXPOSE 3000

# run the application
CMD ["node", "index.js"]