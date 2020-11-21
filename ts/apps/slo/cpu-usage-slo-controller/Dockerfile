# Builder stage
FROM node:14-alpine3.12 AS builder
WORKDIR /usr/src/sloc

ARG SLOC_APP_TYPE
ARG SLOC_APP_NAME
ENV SLOC_APP_TYPE ${SLOC_APP_TYPE}
ENV SLOC_APP_NAME ${SLOC_APP_NAME}

COPY . .

RUN npm install --unsafe-perm && \
    npx nx build ${SLOC_APP_TYPE}-${SLOC_APP_NAME} --with-deps=true



# Final image stage
FROM node:14-alpine3.12

ARG SLOC_APP_TYPE
ARG SLOC_APP_NAME
ENV SLOC_APP_TYPE ${SLOC_APP_TYPE}
ENV SLOC_APP_NAME ${SLOC_APP_NAME}

WORKDIR /usr/apps/${SLOC_APP_NAME}

# Copy the build output.
COPY --from=builder /usr/src/sloc/dist/apps/${SLOC_APP_TYPE}/${SLOC_APP_NAME} .

# ToDo
# Running image produces  Cannot find module '@kubernetes/client-node', maybe I need to copy all lib directories

CMD ["node", "main.js"]
