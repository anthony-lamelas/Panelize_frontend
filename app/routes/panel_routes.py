from flask import Blueprint, request, jsonify
from ..services.openai_service import generate_panels

panel_bp = Blueprint("panel_bp", __name__)

@panel_bp.route('/generate-panels', methods=['POST'])
def generate_panels_route():
    try:
        data = request.get_json()
        print("Received data:\n", data)

        story_description = data.get('story_description', "")
        num_panels = data.get('num_panels', 1)
        theme = data.get('style', 'manga')
    except Exception as e: 
        return jsonify({"error": str(e)}), 400

    # Validate inputs, if invalid return error
    if not story_description or num_panels < 1:
        return jsonify({"error": "Invalid input"}), 400
    
    # debug logging
    # try:
    #     print("✅ Simulating panel generation")
    #     results = [
    #         {"image_url": "https://example.com/panel1.jpg", "caption": "A brave cat runs for office"},
    #         {"image_url": "https://example.com/panel2.jpg", "caption": "Now the president!"}
    #     ]
    #     return jsonify({"panels": results}), 200

    try:
        # Call service function (openai_service.py) to generate panels
        results = generate_panels(story_description, num_panels, theme)
        return jsonify({"panels": results}), 200
    
    except Exception as e:
        print("Backend Error:", e)
        return jsonify({"error": str(e)}), 500

