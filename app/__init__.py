from flask import Flask
from flask_pymongo import PyMongo
from app.routes.users import users  # Import users blueprint

def create_app():
    app = Flask(__name__)
    app.config['MONGO_URI'] = "mongodb+srv://myuse:okay@cluster0.amzpn.mongodb.net/Virtual-Disease-Detection"
    
    # Initialize MongoDB here
    mongo = PyMongo(app)  # Initialize within create_app to avoid circular import
    
    # Register blueprints
    app.register_blueprint(users)
   

    # Test MongoDB connection
    with app.app_context():
        try:
            mongo.db.command("ping")
            print("✅ Connected to MongoDB!")
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")


    return app