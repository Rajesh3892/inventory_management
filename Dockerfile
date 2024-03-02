# Stage 1: Build TypeScript code
FROM node:latest as build

WORKDIR /data

COPY package*.json ./
RUN npm install

COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Run the application
FROM node:latest

WORKDIR /data

# Copy only necessary files from the previous stage
COPY --from=build /data/dist ./dist
COPY --from=build /data/package*.json ./

# Install only production dependencies
RUN npm install

# Copy the .env file
COPY .env ./

# Expose the port your app runs on
EXPOSE 5020

# Command to run the application
CMD ["npm", "start"]