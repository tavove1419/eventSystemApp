FROM node:18-bullseye-slim AS Builder

RUN mkdir /app

WORKDIR /app

RUN npm install -g @quasar/cli

COPY package.json ./

RUN npm i

COPY . .

CMD ["quasar", "dev"]

FROM builder AS dev-envs

RUN apt-get update && apt-get install -y --no-install-recommends git

RUN useradd -s /bin/bash -m vscode && groupadd docker && usermod -aG docker vscode

# install Docker tools (cli, buildx, compose)

COPY --from=gloursdocker/docker / /

CMD ["quasar", "dev"]
