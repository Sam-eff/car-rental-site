from django.apps import AppConfig

class ConfigConfig(AppConfig):
    name = 'config'

    def ready(self):
        from .create_superuser import create_superuser
        import os
        if not os.environ.get('DISABLE_SUPERUSER_CREATION'):
            create_superuser()