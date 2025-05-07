from dotenv import load_dotenv
import os

load_dotenv()  # Load .env into environment variables

class Config:
    MONGO_URI = os.getenv("MONGO_URI")
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'True') == 'True'
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER')
    SECRET_KEY = os.getenv('SECRET_KEY', 'ed6e144f7b658baec37e0b96b59835800a75f5ea898ed5016923da6454458a05')
    FRONTEND_URL = os.getenv("FRONTEND_URL").split(",")
