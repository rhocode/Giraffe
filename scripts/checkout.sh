#!/usr/bin/env bash
set -e

REPOSITORY="${1}"
TARGET_REF="${2:-master}"

DESTINATION=./src/.${REPOSITORY}

if [[ ! -d "${DESTINATION}" ]]; then
  git clone \
    https://github.com/ficsit/${REPOSITORY} \
    --quiet \
    --reference-if-able ../${REPOSITORY} \
    -n \
    "${DESTINATION}"
fi

cd "${DESTINATION}"
git fetch --quiet --tags --force --prune-tags origin
git checkout --quiet "${TARGET_REF}"
