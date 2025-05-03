from flask import Blueprint, request, jsonify
from app.services.otp_service import generate_otp, send_otp_email, verify_otp
from flask import current_app
otp_bp = Blueprint('otp_routes', __name__)

@otp_bp.route('/api/send-otp', methods=['POST'])
def send_otp_route():
    mongo = current_app.mongo
    # Get form data
    email = request.form.get("email")
    name = request.form.get("name")
    password = request.form.get("password")
    gender = request.form.get("gender")
    if not all([email, name, password, gender]):
        return jsonify({"error": "Missing required fields"}), 400
    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 409
    if mongo.db.pending_users.find_one({"email": email}):
        return jsonify({"error": "Previous Data Applicable"}), 304
    otp, expires_at = generate_otp()  
    if send_otp_email(email, otp):
        # Store user data and OTP with expiration time in pending_users
        mongo.db.pending_users.insert_one({
            "email": email,
            "name": name,
            "password": password,
            "gender": gender,
            "otp": otp,
            "otp_expires_at": expires_at
        })
        return jsonify({"message": "OTP sent to email. Please verify to complete registration."}), 200
    else:
        return jsonify({"error": "Error sending OTP"}), 500

@otp_bp.route('/api/verify-otp', methods=['POST'])
def verify_otp_route():
    email = request.form.get("email")
    otp = request.form.get("otp")

    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400

    result = verify_otp(email, otp)
    if result["success"]:
        return jsonify({
            "message": result["message"],
            "user": result["user"]
        }), 200
    else:
        return jsonify({"error": result["message"]}), 400
