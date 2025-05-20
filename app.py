# file: app.py
from flask import Flask
from app.routes.panel_routes import panel_bp  
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])

    app.register_blueprint(panel_bp, url_prefix="/api")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)



