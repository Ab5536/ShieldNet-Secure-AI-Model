from flask import Flask
from flask_pymongo import PyMongo
#from config import Config
mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    #print(f"Mongo URI from config: {app.config['MONGO_URI']}") 
    #name=app.config.from_object(Config)
    #print(name)
    
    app.config['MONGO_URI']="mongodb+srv://myuse:okay@cluster0.amzpn.mongodb.net/Virtual-Disease-Detection"
    mongo.init_app(app)
    with app.app_context():
        try:
            # 'ping' the MongoDB server
            mongo.db.command("ping")
            print("✅ Connected to MongoDB!")
        except Exception as e:
            print(f"❌ Failed to connect to MongoDB: {e}")
    return app
    # Register routes
    #from .routes.auth import auth_bp
    #from .routes.ml import ml_bp
    #app.register_blueprint(auth_bp)
    #app.register_blueprint(ml_bp)
   
