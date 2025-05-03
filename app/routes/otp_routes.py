from flask import Blueprint, request, jsonify
from app.services.otp_service import generate_otp, send_otp_email, verify_otp

otp_bp = Blueprint('otp_routes', __name__)

@otp_bp.route('/send-otp', methods=['POST'])
def send_otp_route():
    user_email = request.json.get('email')
    if not user_email:
        return jsonify({"error": "Email is required"}), 400
    
    otp = generate_otp(user_email)  # Generate OTP and store it temporarily (in-memory or DB)
    if send_otp_email(user_email, otp):  # Send OTP via email
        return jsonify({"message": "OTP sent successfully"}), 200
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
        # Optionally move user to `users` collection here
        return jsonify({"message": result["message"]}), 200
    else:
        return jsonify({"error": result["message"]}), 400
