#!/bin/sh
set -e

: "${APP_URL:=https://example.com}"

envsubst '$APP_URL' < /usr/share/nginx/html/index.template.html > /usr/share/nginx/html/index.html

exec nginx -g 'daemon off;'