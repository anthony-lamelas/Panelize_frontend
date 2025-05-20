from flask import Blueprint, request, jsonify
from ..services.openai_service import generate_panels

panel_bp = Blueprint("panel_bp", __name__)

@panel_bp.route('/generate-panels', methods=['POST', 'GET'])
def generate_panels_route():
    print("HEADERS:", request.headers)

    try:
        data = request.get_json()
        print("Received data:\n", data)

        story_description = data.get('story_description', "")
        num_panels = data.get('num_panels', 1)
        theme = data.get('style', 'manga')
    except Exception as e: 
        print("[ERROR] Invalid request data:", e)
        return jsonify({"error": str(e), "details": "Invalid request data"}), 400

    # Validate inputs, if invalid return error
    if not story_description or num_panels < 1:
        print("[ERROR] Invalid input: story_description or num_panels")
        return jsonify({"error": "Invalid input", "details": "story_description or num_panels missing/invalid"}), 400
    
    try:
        # Call service function (openai_service.py) to generate panels
        results = generate_panels(story_description, num_panels, theme)
        print("Generated panels:\n", results)
        # Ensure results is serializable
        if not isinstance(results, list):
            print("[ERROR] Results is not a list")
            return jsonify({"error": "Internal error", "details": "Results is not a list"}), 500
        for r in results:
            if not isinstance(r, dict):
                print("[ERROR] Panel result is not a dict:", r)
                return jsonify({"error": "Internal error", "details": "Panel result is not a dict"}), 500
        return jsonify({"panels": results}), 200
    
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        print("[ERROR] Backend Exception:", e)
        print(tb)
        return jsonify({"error": str(e), "trace": tb}), 500

@panel_bp.route('/test-cors', methods=['GET'])
def test_cors():
    return jsonify({"message": "CORS is working!"}), 200

