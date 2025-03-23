FROM nginx:stable-alpine
LABEL authors="rois2coeurs"

COPY html /usr/share/nginx/html
COPY style /usr/share/nginx/html/style
COPY script /usr/share/nginx/html/script
COPY assets /usr/share/nginx/html/assets
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY config-prod.json /usr/share/nginx/html/config.json