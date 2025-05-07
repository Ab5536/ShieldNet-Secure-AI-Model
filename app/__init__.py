from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from app.routes.user_routes import users  # Import the users blueprint
from app.routes.otp_routes import otp_bp  # OTP routes blueprint
#from app.routes.ml_routes import ml_bp  # Uncomment if you are using ML routes
from config import Config
from flask_mail import Mail

def create_app():
    app = Flask(__name__)
    # Load configuration from Config class
    app.config.from_object(Config)

    # Initialize Flask extensions
    mail=Mail(app)
    mongo = PyMongo(app)
    
    
    # Enable CORS for the app
    CORS(app, resources={r"/*": {"origins": app.config["FRONTEND_URL"]}}, supports_credentials=True)

    # Register blueprints
    app.register_blueprint(users)
    app.register_blueprint(otp_bp)
    #app.register_blueprint(ml_bp)  # Uncomment when ML routes are ready
    
    # Test MongoDB connection
    with app.app_context():
        
        try:
            mongo.db.command("ping")
            print("✅ Connected to MongoDB!")
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
    
    # Attach the mongo and mail objects to the app's global context (optional)
    app.mongo = mongo
    app.mail = mail
    
    return app
