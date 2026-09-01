# syntax=docker/dockerfile:1

# ---- base -------------------------------------------------------------------
# Debian tabanlı imaj: alpine/musl bazı native modüllerde beklenmedik derleme
# hataları çıkarıyor, o riski almaya değmez.
FROM node:24-slim AS base

ARG UID=1000
ARG GID=1000
# package.json içindeki packageManager alanıyla aynı olmalı.
ARG PNPM_VERSION=11.25.0

ENV PNPM_HOME=/pnpm \
    COREPACK_HOME=/pnpm/corepack \
    PATH=/pnpm:$PATH

RUN apt-get update \
 && apt-get install -y --no-install-recommends git ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Konteynerdeki "node" kullanıcısını host kullanıcısıyla aynı UID/GID'e çek.
# Bunu atlarsak bind-mount üzerinde root:root dosyalar birikiyor ve host'tan
# silinemiyor.
RUN if [ "$GID" != "1000" ]; then groupmod -g "$GID" node; fi \
 && if [ "$UID" != "1000" ]; then usermod -u "$UID" -g "$GID" node; fi \
 && mkdir -p /pnpm/store /pnpm/corepack /workspace/node_modules \
 && chown -R "$UID:$GID" /pnpm /workspace

# pnpm imaja gömülüyor; aksi halde her `run --rm` çağrısında corepack yeniden
# indirmeye kalkıyor.
RUN corepack enable \
 && corepack prepare "pnpm@${PNPM_VERSION}" --activate \
 && chown -R "$UID:$GID" /pnpm

# git, bind-mount edilen depoyu farklı UID gördüğünde "dubious ownership"
# diye durur.
RUN git config --system --add safe.directory /workspace

# ---- dev --------------------------------------------------------------------
FROM base AS dev

USER node
WORKDIR /workspace

# Uzun ömürlü geliştirme konteyneri: `docker compose exec` ve Dev Container
# bunun üzerinde çalışıyor.
CMD ["sleep", "infinity"]
