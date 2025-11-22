from django.contrib.auth import get_user_model
from django.db import IntegrityError

def create_superuser():
    User = get_user_model()
    try:
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123'  # Change this password!
            )
            print("Superuser created successfully!")
    except IntegrityError:
        print("Superuser already exists")