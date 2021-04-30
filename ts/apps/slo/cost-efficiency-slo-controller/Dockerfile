# Builder stage
FROM node:14-alpine3.13 AS builder
WORKDIR /usr/src/sloc

ARG SLOC_APP_TYPE
ARG SLOC_APP_NAME
ENV SLOC_APP_TYPE ${SLOC_APP_TYPE}
ENV SLOC_APP_NAME ${SLOC_APP_NAME}

# Copy package.json and similar files and download dependencies.
# Copying only package.json files here allows us to cache the downloaded dependencies as a layer.
COPY angular.json decorate-angular-cli.js jest.config.js jest.preset.js nx.json package.json package-lock.json tsconfig.base.json ./
COPY ./tools ./tools
RUN npm install --unsafe-perm

# Copy source code.
COPY ./apps ./apps
COPY ./libs ./libs

# Build the app.
# It is important that "externalDependencies" is set to "none" in the node builder's options in angular.json
# to make sure that all dependencies are packaged into the main.js file.
RUN npx nx build ${SLOC_APP_TYPE}-${SLOC_APP_NAME} --with-deps=true



# Final image stage
FROM node:14-alpine3.13

ARG SLOC_APP_TYPE
ARG SLOC_APP_NAME
ENV SLOC_APP_TYPE ${SLOC_APP_TYPE}
ENV SLOC_APP_NAME ${SLOC_APP_NAME}

WORKDIR /usr/apps/${SLOC_APP_NAME}

# Copy the build output.
COPY --from=builder /usr/src/sloc/dist/apps/${SLOC_APP_TYPE}/${SLOC_APP_NAME} .

CMD ["node", "main.js"]
