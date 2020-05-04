FROM node:10-alpine3.11
WORKDIR /usr/apps/tweeter-test

# Copy the build output.
COPY dist/build/tweeter.js ./

EXPOSE 8080

CMD ["node", "tweeter.js"]
