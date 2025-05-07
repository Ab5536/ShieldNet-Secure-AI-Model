from flask import Blueprint, request, jsonify
from app.services.otp_service import generate_otp, is_valid_gmail, send_otp_email, verify_otp, check_email_exists
from flask import current_app

otp_bp = Blueprint('otp_routes', __name__)

# New function to check if the email exists


@otp_bp.route('/api/send-otp', methods=['POST', 'OPTIONS'])
def send_otp_route():
    mongo = current_app.mongo
    # Get form data
    email = request.form.get("email")
    name = request.form.get("name")
    password = request.form.get("password")
    gender = request.form.get("gender")
    
    if not all([email, name, password, gender]):
        return jsonify({"error": "Missing required fields"}), 400

    # Validate email format and check if it exists on Gmail
    if not is_valid_gmail(email):
        return jsonify({"error": "Invalid Gmail address or email does not exist"}), 400
    
    # Check if the email is already in the database (in both users and pending_users collections)
    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 409
    if mongo.db.pending_users.find_one({"email": email}):
        return jsonify({"error": "Previous Data Applicable"}), 304
    
    otp, expires_at = generate_otp()  
    
    # Send OTP email
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

@otp_bp.route('/api/verify-otp', methods=['POST', 'OPTIONS'])
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
