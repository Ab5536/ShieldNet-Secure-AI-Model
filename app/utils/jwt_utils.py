from functools import wraps
from flask import request, jsonify, current_app
import jwt
from datetime import datetime, timedelta, timezone

ALGORITHM = "HS256"

def generate_token(user_id, expires_in=3600):
    SECRET_KEY = current_app.config.get("SECRET_KEY")  # access within context
    payload = {
        "user_id": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(seconds=expires_in)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token

def decode_token(token):
    SECRET_KEY = current_app.config.get("SECRET_KEY")  # access within context
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Authorization token is missing"}), 401

        token = token.replace("Bearer ", "")
        decoded = decode_token(token)
        if not decoded:
            return jsonify({"error": "Invalid or expired token"}), 401

        request.user_id = decoded.get("user_id")
        return f(*args, **kwargs)

    return decorated_function
