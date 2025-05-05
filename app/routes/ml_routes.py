from flask import Blueprint, request, jsonify,current_app
from app.services.ml_service import predict_image, validFiletype
from flask_cors import cross_origin
from app.services.cloudinary_service import save_image_for_user
from app.routes.user_routes import upload_image
ml_bp = Blueprint('ml_routes', __name__)

@ml_bp.route('/api/predict', methods=['POST'])
def predict():
    mongo = current_app.mongo
    print("📩 Received request for prediction...")

    # Step 1: Validate image upload
    if 'image' not in request.files:
        print(" No image file provided.")
        return jsonify({"error": "No image file uploaded."}), 400

    file = request.files['image']
    if(not validFiletype(file)):
        return jsonify({"Error": "Image is not Valid"}),400
    email = request.form.get('email')

    if not email:
        print(" Email is missing in request.")
        return jsonify({"error": "Email is required."}), 400

    if file.filename == '':
        print(" Empty image filename.")
        return jsonify({"error": "Invalid image file."}), 400

    # Step 2: Check if user exists in DB
    user = mongo.db.users.find_one({"email": email})
    if not user:
        print(" No user found with this email.")
        return jsonify({"error": "User not found"}), 404

    try:
        # Step 3: Run prediction
        print("🔍 Running prediction...")
        result = predict_image(file)
        print(f"✅ Prediction complete: {result}")

        # Step 4: Save image for user in MongoDB after prediction
        success, save_response = save_image_for_user(mongo, email, file)
        if not success:
            print(f"⚠️ Image saving failed: {save_response}")
            # Still return prediction even if image save fails, but include a warning
            return jsonify({
                "prediction": result,
                "warning": save_response
            }), 200  # Return 200 OK with a warning message

        # Step 5: Successfully saved image, return prediction with image URL
        return jsonify({
            "prediction": result,
            "image_url": save_response
        }), 200

    except ValueError as ve:
        # Step 6: Handling known exceptions like bad input
        print(f"⚠️ ValueError during prediction: {str(ve)}")
        return jsonify({"error": str(ve)}), 400  # 400 Bad Request for validation errors

    except Exception as e:
        # Step 7: Catch all other exceptions
        print(f"❌ Unexpected error: {str(e)}")
        return jsonify({"error": f"Error processing image: {str(e)}"}), 500  # Internal server error

