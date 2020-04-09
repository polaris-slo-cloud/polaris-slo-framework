FROM node:10.20.0-alpine3.11
WORKDIR /usr/apps/twitter-clone

# Copy the build output.
COPY dist/build/twitter-clone.js ./

EXPOSE 8080

CMD ["node", "twitter-clone.js"]
