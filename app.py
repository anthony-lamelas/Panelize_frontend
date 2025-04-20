# file: app.py
from flask import Flask
from app.routes.panel_routes import panel_bp  

def create_app():
    app = Flask(__name__)

    app.register_blueprint(panel_bp, url_prefix="/api")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)



