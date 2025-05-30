    # Use an official Node.js runtime as a parent image
    FROM node:22-alpine

    # Set the working directory in the container
    WORKDIR /app

    # Copy package.json and package-lock.json (or yarn.lock)
    COPY package*.json ./

    # Install dependencies
    RUN npm install

    # Define an ARG for build-time value
    ARG NEXT_PUBLIC_DRUPAL_BASE_URL

    # Set an ENV variable from the ARG
    ENV NEXT_PUBLIC_DRUPAL_BASE_URL=$NEXT_PUBLIC_DRUPAL_BASE_URL
    RUN printf "$NEXT_PUBLIC_DRUPAL_BASE_URL" >> .env.production

    # Copy the rest of your application
    COPY . .

    # Build the Next.js app
    RUN npm run build

    # Expose the port that the app will run on
    EXPOSE 3000

    # Command to run the application
    CMD ["npm", "start"]
