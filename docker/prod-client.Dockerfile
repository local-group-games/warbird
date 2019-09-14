# 1: Dev
FROM node:12-alpine as builder

ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin

WORKDIR /app

# Install bash dependency
RUN apk add --no-cache bash

# Add config files
ADD package.json ./package.json
ADD yarn.lock ./yarn.lock
ADD lerna.json ./lerna.json
ADD tsconfig.json ./tsconfig.json

# Create env file
COPY packages/client/.env.example packages/client/.env

# Add monrepo utilities
ADD bin ./bin

# Add source code
ADD packages/core ./packages/core
ADD packages/client ./packages/client
ADD packages/ui ./packages/ui
ADD packages/utils ./packages/utils

# Fix npm warning
RUN npm config set scripts-prepend-node-path true

# Install dev and project dependencies
RUN yarn

# Build
RUN yarn build:client

# 2: NGINX
FROM nginx:alpine

# nginx config
RUN rm -rf /etc/nginx/conf.d
COPY ./conf/nginx.conf /etc/nginx/

COPY --from=builder /app/packages/client/build /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

COPY packages/client/.env.example .env
COPY packages/client/bin/build_env_config.sh .

# Add bash
RUN apk add --no-cache bash
RUN chmod +x ./build_env_config.sh
RUN ls /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html/assets

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/build_env_config.sh && nginx -g \"daemon off;\""]
