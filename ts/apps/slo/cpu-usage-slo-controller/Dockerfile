# Builder stage
FROM node:14-alpine3.12 AS builder
WORKDIR /usr/src/sloc

ARG SLOC_APP_TYPE
ARG SLOC_APP_NAME
ENV SLOC_APP_TYPE ${SLOC_APP_TYPE}
ENV SLOC_APP_NAME ${SLOC_APP_NAME}

COPY . .

# Download dependencies.
# Keeping this as a separate command allows caching this layer.
RUN npm install --unsafe-perm

# Build the app.
# It is important that "externalDependencies" is set to "none" in the node builder's options in angular.json
# to make sure that all dependencies are packaged into the main.js file.
RUN npx nx build ${SLOC_APP_TYPE}-${SLOC_APP_NAME} --with-deps=true



# Final image stage
FROM node:14-alpine3.12

ARG SLOC_APP_TYPE
ARG SLOC_APP_NAME
ENV SLOC_APP_TYPE ${SLOC_APP_TYPE}
ENV SLOC_APP_NAME ${SLOC_APP_NAME}

WORKDIR /usr/apps/${SLOC_APP_NAME}

# Copy the build output.
COPY --from=builder /usr/src/sloc/dist/apps/${SLOC_APP_TYPE}/${SLOC_APP_NAME} .

CMD ["node", "main.js"]
