from functools import wraps
from flask import request, jsonify, current_app
import jwt
from datetime import datetime, timedelta, timezone

ALGORITHM = "HS256"

def generate_token(user_id, name=None, email=None, expires_in=3600):
    SECRET_KEY = current_app.config.get("SECRET_KEY")
    payload = {
        "user_id": str(user_id),
        "name": name,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(seconds=expires_in)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token if isinstance(token, str) else token.decode('utf-8')



def decode_token(token):
    """
    Decode the JWT token and verify its validity.
    
    :param token: JWT token to decode
    :return: Decoded payload if valid, or None if invalid/expired
    """
    SECRET_KEY = current_app.config.get("SECRET_KEY")  # Access secret key from Flask config
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY is not configured in the app.")
    
    try:
        # Decode the JWT token and verify it using the SECRET_KEY and the HS256 algorithm
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded  # Return the decoded payload if the token is valid
    except jwt.ExpiredSignatureError:
        # Token has expired
        return None
    except jwt.InvalidTokenError:
        # Invalid token
        return None


def jwt_required(f):
    """
    Decorator to protect Flask routes that require JWT authentication.
    
    :param f: The view function to wrap
    :return: Wrapped function that checks for valid JWT token
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')  # Get the token from Authorization header
        
        if not token:
            return jsonify({"error": "Authorization token is missing"}), 401
        
        token = token.replace("Bearer ", "")  # Remove "Bearer " prefix from the token
        
        # Decode and validate the token
        decoded = decode_token(token)
        
        if not decoded:
            return jsonify({"error": "Invalid or expired token"}), 401
        
        request.user_id = decoded.get("user_id")  # Store the user_id in the request object
        return f(*args, **kwargs)

    return decorated_function
