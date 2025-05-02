from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin

users = Blueprint('users', __name__)

@users.route("/api/signup", methods=["POST"])
@cross_origin()
def signup():
    mongo = current_app.mongo

    # Get form data
    email = request.form.get("email")
    name = request.form.get("name")
    phone = request.form.get("phoneNumber")
    password = request.form.get("password")
    city = request.form.get("cityName")
    gender = request.form.get("gender")

    if not all([email, name, phone, password, city, gender]):
        return jsonify({"error": "Missing required fields"}), 400

    if mongo.db.users.find_one({"email": email}):
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



#Signin Routes
@users.route("/api/signin", methods=["POST"])
@cross_origin()
def signin():
    mongo = current_app.mongo

    email = request.form.get("email")
    password = request.form.get("password")

    if not all([email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    user = mongo.db.users.find_one({"email": email})

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.get("password") != password:
        return jsonify({"error": "Incorrect password"}), 401

    return jsonify({"message": "User signed in successfully", "user_id": str(user["_id"])}), 200
