#!/bin/bash
set -e

mkdir -p /app/logs

python manage.py migrate --noinput

exec "$@"
