from flask import Blueprint, request, jsonify
from app.services.ml_service import predict_image
from flask_cors import cross_origin

ml_bp = Blueprint('ml_routes', __name__)

@ml_bp.route('/api/predict', methods=['POST'])
@cross_origin()
def predict():
    if 'image' not in request.files:
        print("Image not found")
        return jsonify({"error": "No image file uploaded."}), 400

    file = request.files['image']
    try:
        print("predict tak puhancha hai")
        result = predict_image(file)
        return jsonify({"prediction": result}), 200
    except ValueError as ve:
        print("predict karne ke doran masla aaya hai")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        print("processing nhi howi bhai")
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500
