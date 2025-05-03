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

    # Find the pending user
    pending_user = mongo.db.pending_users.find_one({"email": email})
    
    if not pending_user:
        return {"success": False, "message": "No pending verification for this email"}

    # Check if OTP is expired
    if datetime.now() > pending_user.get("otp_expires_at"):
        mongo.db.pending_users.delete_one({"email": email})
        return {"success": False, "message": "OTP has expired. Please sign up again."}

    # Check if OTP matches
    if pending_user.get("otp") == int(otp):
        # Remove fields we don't want to store in the final users collection
        user_data = pending_user.copy()
        user_data.pop("_id", None)
        user_data.pop("otp", None)
        user_data.pop("otp_expires_at", None)

        # Insert into main users collection
        mongo.db.users.insert_one(user_data)

        # Remove from pending_users
        mongo.db.pending_users.delete_one({"email": email})

        return {"success": True, "message": "OTP verified. User registration completed."}
    else:
        return {"success": False, "message": "Invalid OTP"}