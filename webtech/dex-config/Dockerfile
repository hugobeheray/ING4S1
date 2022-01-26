FROM ghcr.io/dexidp/dex:v2.30.0

WORKDIR /usr/local/dex/conf

COPY config.yaml .

EXPOSE 5556

CMD ["dex", "serve", "./config.yaml"]