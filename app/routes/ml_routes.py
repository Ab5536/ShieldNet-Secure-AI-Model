from flask import Blueprint, request, jsonify
from app.services.ml_service import predict_image
from flask_cors import cross_origin
from app.routes.user_routes import upload_image
ml_bp = Blueprint('ml_routes', __name__)

@ml_bp.route('/api/predict', methods=['POST'])
@cross_origin()
def predict():
    if 'image' not in request.files:
        print("❌ Image not found in request")
        return jsonify({"error": "No image file uploaded."}), 400

    file = request.files['image']
    try:
        print("📩 Image received, starting prediction...")
        result = predict_image(file)
        print("✅ Prediction complete")
        print(f"🔍 Prediction result: {result}")
        upload_image(file,)
        return jsonify({"prediction": result}), 200

    except ValueError as ve:
        print("⚠️ ValueError during prediction")
        return jsonify({"error": str(ve)}), 400

    except Exception as e:
        print(f"❌ Unexpected error during processing: {str(e)}")
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500
