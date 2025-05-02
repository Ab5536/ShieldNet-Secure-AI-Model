from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from app.routes.users import users  # Import the users blueprint
from app.routes.ml_routes import ml_bp
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Print the MONGO_URI to verify it's being loaded correctly
    # print(str(app.config.get("MONGO_URI")))
    # for key, value in app.config.items():
    #     print(f"{key}: {value}")
    # Configuring MongoDB URI
    # app.config['MONGO_URI'] = "mongodb+srv://myuse:okay@cluster0.amzpn.mongodb.net/Virtual-Disease-Detection"
    
    # Initialize MongoDB
    mongo = PyMongo(app)
    
    # Enable CORS for the app
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(users)
    app.register_blueprint(ml_bp)
    
    # Test MongoDB connection
    with app.app_context():
        try:
            mongo.db.command("ping")
            print("✅ Connected to MongoDB!")
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
    
    # Attach the mongo object to the app's global context
    app.mongo = mongo
    
    return app
