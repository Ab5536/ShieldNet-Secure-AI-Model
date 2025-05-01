from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from app.routes.users import users  # Import the users blueprint

def create_app():
    app = Flask(__name__)
    
    # Configuring MongoDB URI
    app.config['MONGO_URI'] = "mongodb+srv://myuse:okay@cluster0.amzpn.mongodb.net/Virtual-Disease-Detection"
    
    # Initialize MongoDB
    mongo = PyMongo(app)
    
    # Enable CORS for the app
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(users)
    
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
