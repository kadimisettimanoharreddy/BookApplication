#!/bin/sh
set -e
cat > /usr/share/nginx/html/config.js <<EOF
window.__APP_CONFIG__ = {
  API_BASE: "${API_BASE}"
};
EOF
exec nginx -g 'daemon off;'