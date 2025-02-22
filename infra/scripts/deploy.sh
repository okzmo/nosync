#!/bin/bash

set -e

export PATH="/usr/local/lib/nodejs/node-v22.13.1-linux-x64/bin:$PATH"

if [[ -z "$1" ]]; then
  echo "Missing commit hash"
  exit 1
fi

RELEASES_DIR="/home/deploy/releases"
PROD_BACKEND="/home/deploy/production/backend"
PROD_FRONTEND="/home/deploy/production/frontend"
COMMIT_HASH=$1
BACKEND="back-${COMMIT_HASH}"
FRONTEND="front-${COMMIT_HASH}"
BACKEND_SERVICE="backend.service"
BACKEND_QUEUE_SERVICE="backend-queue.service"
BACKEND_MIGRATION_SERVICE="backend-migration.service"

if [[ ! -d "${RELEASES_DIR}/${BACKEND}" ]]; then
  echo "Missing backend release in ${RELEASES_DIR}"
  exit 1
fi

if [[ ! -d "${RELEASES_DIR}/${FRONTEND}" ]]; then
  echo "Missing frontend release in ${RELEASES_DIR}"
  exit 1
fi

if [[ -L "${PROD_BACKEND}" ]]; then
  PREVIOUS_BACK=$(readlink ${PROD_BACKEND})
  echo "Found a symbolic link for backend, save for rollback."
else
  PREVIOUS_BACK=""
fi

if [[ -L "${PROD_FRONTEND}" ]]; then
  PREVIOUS_FRONT=$(readlink ${PROD_FRONTEND})
  echo "Found a symbolic link for frontend, save for rollback."
else
  PREVIOUS_FRONT=""
fi

rollback_deploy() {
  if [[ -n "$PREVIOUS_BACK" ]]; then
    echo "Rolling back to previous backend release: ${PREVIOUS_BACK}"
    ln -sfn "${PREVIOUS_BACK}" "${PROD_BACKEND}"
  else
    echo "No backend symbolic link found for rollback"
  fi

  if [[ -n "$PREVIOUS_FRONT" ]]; then
    echo "Rolling back to previous frontend release: ${PREVIOUS_FRONT}"
    ln -sfn "${PREVIOUS_FRONT}" "${PROD_FRONTEND}"
  else
    echo "No frontend symbolic link found for rollback"
  fi

  sleep 10

  echo "Restarting backend service"
  sudo systemctl restart $BACKEND_SERVICE

  echo "Restarting backend queue service"
  sudo systemctl restart $BACKEND_QUEUE_SERVICE

  echo "Rollback completed."
}

echo "Installing backend dependencies..."
cd "${RELEASES_DIR}/${BACKEND}" && npm i --omit=dev

echo "Changing backend symlink..."
ln -sfn "${RELEASES_DIR}/${BACKEND}" "${PROD_BACKEND}"

echo "Changing frontend symlink..."
ln -sfn "${RELEASES_DIR}/${FRONTEND}" "${PROD_FRONTEND}"

restart_service() {
  local SERVICE = $1
  echo "Restarting ${SERVICE}..."

  if ! sudo systemctl restart "$SERVICE"; then
    echo "Failed to restart ${SERVICE} rolling back..."

    rollback_deploy
    exit 1
  fi

  sleep 5

  if ! systemctl is-active --quiet "${SERVICE}"; then
    echo "Failed to start ${SERVICE} rolling back..."

    rollback_deploy
    exit 1
  fi

  echo "${SERVICE} started successfully"
}

restart_service $BACKEND_SERVICE
restart_service $BACKEND_QUEUE_SERVICE

sudo systemctl start $BACKEND_MIGRATION_SERVICE

echo "Deployment successful"
