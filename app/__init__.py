from flask import Flask
from flask_cors import CORS
from .config import Config
from .routes.panel_routes import panel_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)  

    CORS(app)  # Enable Cross Origin Resource Sharing (CORS) which allows requests from backend/frontend when on diffenet ports

    app.register_blueprint(panel_bp, url_prefix='/api') # Blueprint used to split the app into different modules and stay organized

    return app


