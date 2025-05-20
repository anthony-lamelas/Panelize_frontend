# file: app.py
from flask import Flask
from app.routes.panel_routes import panel_bp  
from flask_cors import CORS
from wsgi import create_app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)



