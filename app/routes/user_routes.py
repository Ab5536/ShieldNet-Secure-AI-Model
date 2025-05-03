from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
from bson import ObjectId
from app.services.otp_service import generate_otp, send_otp_email

users = Blueprint('user_routes', __name__)

# SIGNUP ROUTE
@users.route("/api/signup", methods=["POST"])
@cross_origin()
def signup():
    mongo = current_app.mongo

    # Get form data
    email = request.form.get("email")
    name = request.form.get("name")
    phone = request.form.get("phoneNumber")
    password = request.form.get("password")
    city = request.form.get("cityName")
    gender = request.form.get("gender")

    if not all([email, name, phone, password, city, gender]):
        return jsonify({"error": "Missing required fields"}), 400

    if mongo.db.users.find_one({"email": email}) or mongo.db.pending_users.find_one({"email": email}):
        return jsonify({"error": "User already exists or pending verification"}), 409

    otp, expires_at = generate_otp()
    print("Generated OTP:", otp)

    if send_otp_email(email, otp):
        # Store user data and OTP with expiration time in pending_users
        mongo.db.pending_users.insert_one({
            "email": email,
            "name": name,
            "phone": phone,
            "password": password,
            "city": city,
            "gender": gender,
            "otp": otp,
            "otp_expires_at": expires_at
        })
        return jsonify({"message": "OTP sent to email. Please verify to complete registration."}), 200
    else:
        return jsonify({"error": "Error sending OTP"}), 500


# SIGNIN ROUTE
@users.route("/api/signin", methods=["POST"])
@cross_origin()
def signin():
    mongo = current_app.mongo

    email = request.form.get("email")
    password = request.form.get("password")

    if not all([email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    user = mongo.db.users.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.get("password") != password:
        return jsonify({"error": "Incorrect password"}), 401

    return jsonify({
        "message": "User Signed In",
        "user": {
            "name": user["name"],
            "email": user["email"],
            "user_id": str(user["_id"])
        }
    }), 200
