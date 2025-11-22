#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Make migrations for any model changes
python manage.py makemigrations

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsu