#!/bin/sh
set -eu

# Generate runtime env file for the browser (no secrets!)
# Coolify sets env vars at runtime; Vite "import.meta.env" is build-time only.

js_escape() {
  # Escape backslashes and double-quotes for JS string literals
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

VITE_APP_ENV_ESC="$(js_escape "${VITE_APP_ENV:-}")"
VITE_SUPABASE_URL_ESC="$(js_escape "${VITE_SUPABASE_URL:-}")"
VITE_SUPABASE_PUBLISHABLE_KEY_ESC="$(js_escape "${VITE_SUPABASE_PUBLISHABLE_KEY:-}")"
VITE_ALLOW_PAYMENTS_ESC="$(js_escape "${VITE_ALLOW_PAYMENTS:-}")"
VITE_ALLOW_REGISTRATIONS_ESC="$(js_escape "${VITE_ALLOW_REGISTRATIONS:-}")"
VITE_MAINTENANCE_MODE_ESC="$(js_escape "${VITE_MAINTENANCE_MODE:-}")"

cat > /usr/share/nginx/html/env.js <<EOF
window.__ENV__ = {
  VITE_APP_ENV: "${VITE_APP_ENV_ESC}",
  VITE_SUPABASE_URL: "${VITE_SUPABASE_URL_ESC}",
  VITE_SUPABASE_PUBLISHABLE_KEY: "${VITE_SUPABASE_PUBLISHABLE_KEY_ESC}",
  VITE_ALLOW_PAYMENTS: "${VITE_ALLOW_PAYMENTS_ESC}",
  VITE_ALLOW_REGISTRATIONS: "${VITE_ALLOW_REGISTRATIONS_ESC}",
  VITE_MAINTENANCE_MODE: "${VITE_MAINTENANCE_MODE_ESC}"
};
EOF

exec "$@"


