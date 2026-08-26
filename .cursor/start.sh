#!/usr/bin/env bash
# Per-boot startup: ensure MongoDB is running before the app services start.
set -euo pipefail

mkdir -p "$HOME/.mongo-data" "$HOME/.mongo-logs"

if pgrep -x mongod >/dev/null 2>&1; then
  echo "mongod already running"
else
  echo "Starting mongod"
  mongod --dbpath "$HOME/.mongo-data" \
    --bind_ip 127.0.0.1 --port 27017 \
    --fork --logpath "$HOME/.mongo-logs/mongod.log"
fi

# Wait for MongoDB to accept connections.
for i in $(seq 1 30); do
  if mongosh --quiet --eval "db.runCommand({ ping: 1 })" >/dev/null 2>&1; then
    echo "MongoDB is ready"
    break
  fi
  sleep 1
done
