import pyotp
import random
from flask_mail import Message
from app import mail
from datetime import datetime, timedelta

otp_storage = {}  # Use this temporarily, or replace with database

# Generate OTP and store it with expiration time
def generate_otp(email):
    otp = random.randint(100000, 999999)
    otp_storage[email] = {'otp': otp, 'expires_at': datetime.now() + timedelta(minutes=5)}
    return otp

# Send OTP via email
def send_otp_email(email, otp):
    try:
        msg = Message('Your OTP Code', recipients=[email])
        msg.body = f"Your OTP code is: {otp}"
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
