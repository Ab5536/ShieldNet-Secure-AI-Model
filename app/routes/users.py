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
