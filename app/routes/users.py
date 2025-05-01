from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
users = Blueprint('users', __name__)

@users.route("/api/signup", methods=["POST"])
@cross_origin()
def signup():
    from app import mongo  # Import mongo inside the function to avoid circular import
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    email = data.get("email")
    name = data.get("name")
    phone = data.get("phoneNumber")
    password = data.get("password")
    city = data.get("cityName")
    gender = data.get("gender")

    if not all([email, name, phone, password, city, gender]):
        return jsonify({"error": "Missing required fields"}), 400

    existing_user = mongo.db.users.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    mongo.db.users.insert_one({
        "email": email,
        "name": name,
        "phone": phone,
        "password": password,
        "city": city,
        "gender": gender
    })

    return jsonify({"message": "User created successfully"}), 200
