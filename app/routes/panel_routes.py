from flask import Blueprint, request, jsonify
from ..services.openai_service import generate_panels

@panel_bp.route('/generate_panels', methods=['POST'])
def generate_panels_route():
    pass