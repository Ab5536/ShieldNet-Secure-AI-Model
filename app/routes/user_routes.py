from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
from bson import ObjectId
from app.services.otp_service import generate_otp, send_otp_email, verify_otp

users = Blueprint('user_routes', __name__)

# SIGNUP ROUTE
@users.route("/api/signup", methods=["POST"])
@cross_origin()
def signup():
    mongo = current_app.mongo
    email = request.form.get("email")
    name = request.form.get("name")
    password = request.form.get("password")
    gender = request.form.get("gender")
    otp=request.form.get("otp")	
    if not all([email, name, password, gender,otp]):
        return jsonify({
            "success": False,
            "message": "Email and OTP are required."
        }), 400

    # Step 1: Verify OTP
    verification_result, status_code = verify_otp(email, otp)

    if not verification_result.get("success"):
        return jsonify(verification_result), status_code

    user_data = verification_result.get("user_data")

    # Step 2: Save verified user to permanent collection
    try:
        mongo.db.users.insert_one(user_data)
        mongo.db.pending_users.delete_one({"email": email})
        return jsonify({
            "success": True,
            "message": "User successfully registered.",
            "user": {
                "name": user_data["name"],
                "email": user_data["email"]
            }
        }), 201
    except Exception as e:
        return jsonify({
            "success": False,
            "message": "Error saving user to database.",
            "error": str(e)
        }), 500


# SIGNIN ROUTE
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

    return jsonify({
        "message": "User Signed In",
        "user": {
            "name": user["name"],
            "email": user["email"],
            "user_id": str(user["_id"])
        }
    }), 200
