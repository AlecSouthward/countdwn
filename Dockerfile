FROM python:3.12-alpine

RUN addgroup -S countdwn_user \
    && adduser -S countdwn_user -G countdwn_user \
    && mkdir /data \
    && chown countdwn_user:countdwn_user /data

USER countdwn_user

WORKDIR /app
COPY server.py index.html ./
COPY public ./public
ENV HOST=0.0.0.0 PORT=8080 DB_PATH=/data/countdwn.db
VOLUME /data
EXPOSE 8080
CMD ["python", "-u", "server.py"]
