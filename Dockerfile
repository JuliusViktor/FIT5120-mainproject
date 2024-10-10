FROM node:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy SSL certificates
COPY ./private.key ./
COPY ./certificate.crt ./
COPY ./ca_bundle.crt ./

# Copy the rest of the application
COPY . .

# Expose the HTTPS port
EXPOSE 443

# Start the application
CMD ["npm", "start"]