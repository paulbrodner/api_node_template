# ---- Base Node ----
FROM alpine:3.5 AS base
RUN apk add --no-cache nodejs-current tini
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /home/appuser/app
RUN chmod -R 777 /home/appuser/app
ENTRYPOINT ["/sbin/tini", "--"]
COPY package.json .

# ---- Dependencies ----
FROM base AS dependencies
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production
RUN cp -R node_modules prod_node_modules
RUN npm install

# ---- Release ----
FROM base AS release
COPY --from=dependencies /home/appuser/app/prod_node_modules ./node_modules
COPY . .
EXPOSE 8000
USER appuser
CMD npm run start