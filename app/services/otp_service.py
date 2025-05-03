# app/services/otp_service.py

import random
from datetime import datetime, timedelta
from flask_mail import Mail, Message
from flask import current_app


otp_storage = {}  # Store OTP data temporarily (you can replace this with a database)

# Generate OTP and store it with expiration time
def generate_otp():
    otp = random.randint(100000, 999999)
    expires_at = datetime.now() + timedelta(minutes=5)
    return otp, expires_at
# Send OTP via email
def send_otp_email(email, otp):
    try:
        # Create Mail instance only when needed
        mail = current_app.mail  # Initialize mail object using current_app
        msg = Message('Your OTP Code', recipients=[email])
        msg.body = f"Your OTP code is: {otp}"
        # Send email using the created mail object
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending OTP email: {str(e)}")
        return False

# Verify OTP
def verify_otp(email, otp):
    mongo = current_app.mongo

    pending_user = mongo.db.pending_users.find_one({"email": email})

    if not pending_user:
        return {
            "success": False,
            "reason": "no_otp_found",
            "message": "No OTP verification request found for this email. Please sign up first."
        }, 404

    if datetime.now() > pending_user.get("otp_expires_at"):
        mongo.db.pending_users.delete_one({"email": email})
        return {
            "success": False,
            "reason": "otp_expired",
            "message": "OTP has expired. Please start the signup process again."
        }, 410

    try:
        otp = int(otp)
    except ValueError:
        return {
            "success": False,
            "reason": "invalid_format",
            "message": "OTP must be a numeric value."
        }, 400

    if pending_user.get("otp") == otp:
        return {
            "success": True,
            "reason": "otp_verified",
            "message": "OTP is valid.",
            "user_data": {
                "name": pending_user.get("name"),
                "email": pending_user.get("email"),
                "password": pending_user.get("password"),  # assuming it's hashed already
                "gender": pending_user.get("gender")
            }
        }, 200

    return {
        "success": False,
        "reason": "invalid_otp",
        "message": "The OTP you entered is incorrect."
    }, 401