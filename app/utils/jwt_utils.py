from functools import wraps
from bson import decode_all
from flask import request, jsonify

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = auth_header.split(" ")[1]
        payload, error = decode_all(token)
        if error:
            return jsonify({"error": error}), 401

        # Attach user data to request context if needed
        request.user = payload
        return f(*args, **kwargs)
    return decorated_function
