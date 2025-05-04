from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
from bson import ObjectId
from app.services.otp_service import generate_otp, send_otp_email, verify_otp
from app.services.cloudinary_service import save_image_for_user, upload_image_to_cloudinary

users = Blueprint('user_routes', __name__)

# SIGNUP ROUTE
@users.route("/api/signup", methods=["POST"])
def signup():
    mongo = current_app.mongo
    email = request.form.get("email")
    name = request.form.get("name")
    password = request.form.get("password")
    gender = request.form.get("gender")
    otp=request.form.get("otp")	
    if not all([email, name, password, gender,otp]):
        return jsonify({
            
            "success": False,
            "message": "Email and OTP are required."
        }), 400

    # Step 1: Verify OTP
    verification_result, status_code = verify_otp(email, otp)

    if not verification_result.get("success"):
        return jsonify(verification_result), status_code

    user_data = verification_result.get("user_data")

    # Step 2: Save verified user to permanent collection
    try:
        mongo.db.users.insert_one(user_data)
        mongo.db.pending_users.delete_one({"email": email})
        return jsonify({
            "success": True,
            "message": "User successfully registered.",
            "user": {
                "name": user_data["name"],
                "email": user_data["email"]
            }
        }), 201
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Error saving user to database.",
            "error": str(e)
        }), 500


# SIGNIN ROUTE
@users.route("/api/signin", methods=["POST"])
def signin():
    try:
        mongo = current_app.mongo

        email = request.form.get("email")
        password = request.form.get("password")

        # Check if email and password are provided
        if not all([email, password]):
            return jsonify({"success": False, "error": "Missing email or password."}), 400

        # Find the user by email
        user = mongo.db.users.find_one({"email": email})
        if not user:
            return jsonify({"success": False, "error": "User not found."}), 404

        # Check if the password matches
        if user.get("password") != password:
            return jsonify({"success": False, "error": "Incorrect password."}), 401

        # Successful sign in
        return jsonify({
            "success": True,
            "message": "User signed in successfully.",
            "user": {
                "name": user["name"],
                "email": user["email"],
                "user_id": str(user["_id"])
            }
        }), 200

    except Exception as e:
        # Catch any unexpected errors
        return jsonify({"success": False, "error": f"Internal Server Error: {str(e)}"}), 500
    
@users.route('/upload-image', methods=['POST'])
def upload_image():
    mongo = current_app.mongo
    email = request.form.get('email')
    image_file = request.files.get('image')

    try:
        image_url = save_image_for_user(mongo, email, image_file)
        return jsonify({"message": "Image uploaded successfully", "url": image_url}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except LookupError:
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
    
@users.route('/test-upload', methods=['POST'])
def test_upload_to_cloudinary():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    
    if image_file.filename == '':
        return jsonify({"error": "Invalid image file"}), 400

    try:
        print("📤 Uploading image to Cloudinary...")
        url = upload_image_to_cloudinary(image_file)
        print(f"✅ Uploaded successfully: {url}")
        return jsonify({"message": "Upload successful", "url": url}), 200

    except Exception as e:
        print(f"❌ Error uploading to Cloudinary: {str(e)}")
        return jsonify({"error": str(e)}), 500