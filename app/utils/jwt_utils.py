from functools import wraps
from bson import decode_all
from flask import request, jsonify

from functools import wraps
from flask import request, jsonify
from app.utils.jwt_utils import decode_token
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your-secret-key"  # Replace this with env variable in production
ALGORITHM = "HS256"

def generate_token(user_id, expires_in=3600):
    payload = {
        "user_id": str(user_id),
        "exp": datetime.utcnow() + timedelta(seconds=expires_in)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def decode_token(token):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded  # contains user_id, exp, etc.
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Token invalid

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Authorization token is missing"}), 401
        
        token = token.replace("Bearer ", "")  # In case token is sent as Bearer token
        decoded = decode_token(token)
        if not decoded:
            return jsonify({"error": "Invalid or expired token"}), 401

        # Optionally pass user_id to route
        request.user_id = decoded.get("user_id")
        return f(*args, **kwargs)
    
    return decorated_function
