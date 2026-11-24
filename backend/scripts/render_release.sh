#!/usr/bin/env bash
# À lancer une fois dans le Shell Render (après premier deploy) :
#   bash scripts/render_release.sh
set -euo pipefail
python manage.py migrate --noinput
python manage.py seed_public_content
python manage.py seed_staff
echo "Release OK — contenus + comptes staff seedés."
