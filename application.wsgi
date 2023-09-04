import sys
import os

# Add the root of your repository to the sys.path
sys.path.insert(0, os.path.dirname(__file__))

# Import your Flask app (assuming it's named 'app' in app.py)
from app import app

# Define the WSGI entry point
def application(environ, start_response):
    # Pass the request to your Flask app
    return app(environ, start_response)
