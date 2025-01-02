FROM node:20.11-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

# also has dev dependencies
FROM base AS build
ARG BUILD_MODE
ENV VITE_BUILD_MODE=$BUILD_MODE
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile
RUN pnpm run build

FROM nginx:1.16-alpine
COPY ./nginx/config/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
