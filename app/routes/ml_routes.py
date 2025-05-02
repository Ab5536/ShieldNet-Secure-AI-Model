from flask import Blueprint, request, jsonify
from app.services.ml_service import predict_image

ml_bp = Blueprint('ml', __name__)

@ml_bp.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image file uploaded."}), 400

    file = request.files['image']
    try:
        result = predict_image(file)
        return jsonify({"prediction": result}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500
