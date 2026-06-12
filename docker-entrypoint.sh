#!/bin/sh
set -e

: "${APP_URL:=https://example.com}"

if [ ! -f /usr/share/nginx/html/index.template.html ]; then
  echo "Missing /usr/share/nginx/html/index.template.html"
  ls -la /usr/share/nginx/html
  exit 1
fi

envsubst '$APP_URL' < /usr/share/nginx/html/index.template.html > /usr/share/nginx/html/index.html

exec nginx -g 'daemon off;'