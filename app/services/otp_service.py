# app/services/otp_service.py

import random
from datetime import datetime, timedelta
from flask_mail import Mail, Message
from flask import current_app

otp_storage = {}  # Store OTP data temporarily (you can replace this with a database)

# Generate OTP and store it with expiration time
def generate_otp(email):
    otp = random.randint(100000, 999999)
    otp_storage[email] = {'otp': otp, 'expires_at': datetime.now() + timedelta(minutes=5)}
    return otp

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
    stored = otp_storage.get(email)
    if not stored:
        return False
    
    # Check if OTP is expired
    if datetime.now() > stored['expires_at']:
        return False

    return stored['otp'] == int(otp)
