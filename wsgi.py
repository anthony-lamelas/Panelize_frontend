# Web Server Gateway Interface
# WSGI is a specification that describes how a web server communicates with web applications
from flask import Flask
from app.routes.panel_routes import panel_bp  # Import the blueprint
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    # Allow all origins, methods, and headers for CORS
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    app.register_blueprint(panel_bp, url_prefix="/api")
    return app

app = create_app()
