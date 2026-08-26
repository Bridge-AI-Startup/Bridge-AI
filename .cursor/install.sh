#!/usr/bin/env bash
# Idempotent repository bootstrap for the Bridge AI Cloud Agent environment.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

install_mongodb() {
  if command -v mongod >/dev/null 2>&1; then
    echo "==> MongoDB already installed: $(mongod --version | head -1)"
    return
  fi
  echo "==> Installing MongoDB 8.0"
  # shellcheck disable=SC1091
  . /etc/os-release
  local codename="${VERSION_CODENAME:-noble}"
  curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc \
    | sudo gpg --yes -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu ${codename}/mongodb-org/8.0 multiverse" \
    | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list >/dev/null
  sudo apt-get update -qq
  sudo apt-get install -y -qq mongodb-org
  echo "==> Installed $(mongod --version | head -1)"
}

echo "==> Ensuring MongoDB is installed"
install_mongodb

echo "==> Installing server dependencies"
cd "$REPO_ROOT/server"
npm install

echo "==> Installing client dependencies"
cd "$REPO_ROOT/client"
npm install

echo "==> Ensuring MongoDB data directory exists"
mkdir -p "$HOME/.mongo-data"

echo "==> Ensuring server/.env exists"
if [ ! -f "$REPO_ROOT/server/.env" ]; then
  cat > "$REPO_ROOT/server/.env" <<'EOF'
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000
MONGODB_URI=mongodb://localhost:27017/bridge-ai
MONGO_URI=mongodb://localhost:27017/bridge-ai
JWT_SECRET=dev-local-jwt-secret-change-me
FRONTEND_URL=http://localhost:5173
# Set a real key to enable AI features; placeholder allows the server to boot.
OPENAI_API_KEY=sk-dev-placeholder-not-a-real-key
STORAGE_TYPE=local
# For full auth support set FIREBASE_SERVICE_ACCOUNT_KEY (single-line JSON) or FIREBASE_PROJECT_ID.
# FIREBASE_SERVICE_ACCOUNT_KEY=
# FIREBASE_PROJECT_ID=
EOF
fi

echo "==> Ensuring client/.env exists"
if [ ! -f "$REPO_ROOT/client/.env" ]; then
  cat > "$REPO_ROOT/client/.env" <<'EOF'
VITE_API_URL=http://localhost:5000
# Placeholder values let the app render; real values are required for auth flows to succeed.
VITE_FIREBASE_API_KEY=demo-api-key
VITE_FIREBASE_AUTH_DOMAIN=demo-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=demo-project
EOF
fi

echo "==> Install complete"
