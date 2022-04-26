# Builder stage
FROM node:14-alpine3.15 AS builder
WORKDIR /usr/src/polaris

ARG POLARIS_APP_TYPE
ARG POLARIS_APP_NAME
ENV POLARIS_APP_TYPE ${POLARIS_APP_TYPE}
ENV POLARIS_APP_NAME ${POLARIS_APP_NAME}

# Copy package.json and similar files and download dependencies.
# Copying only package.json files here allows us to cache the downloaded dependencies as a layer.
COPY angular.json decorate-angular-cli.js jest.config.ts jest.preset.ts nx.json package.json package-lock.json tsconfig.base.json ./
COPY ./tools ./tools
RUN npm ci --unsafe-perm

# Copy source code.
COPY ./apps ./apps
COPY ./libs ./libs
COPY ./typings ./typings

# Build the app.
# It is important that "externalDependencies" is set to "none" in the node builder's options in angular.json
# to make sure that all dependencies are packaged into the main.js file.
RUN npx nx build ${POLARIS_APP_TYPE}-${POLARIS_APP_NAME}



# Final image stage
FROM node:14-alpine3.15

ARG POLARIS_APP_TYPE
ARG POLARIS_APP_NAME
ENV POLARIS_APP_TYPE ${POLARIS_APP_TYPE}
ENV POLARIS_APP_NAME ${POLARIS_APP_NAME}

WORKDIR /usr/apps/${POLARIS_APP_NAME}

# Copy the build output.
COPY --from=builder /usr/src/polaris/dist/apps/${POLARIS_APP_TYPE}/${POLARIS_APP_NAME} .

CMD ["node", "main.js"]
