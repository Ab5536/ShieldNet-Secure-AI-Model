from flask import Flask
from flask_mail import Mail, Message
from flask import current_app

app = Flask(__name__)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'abdullahgm5536@gmail.com'
app.config['MAIL_PASSWORD'] = 'hhwv xxio lrdc vijl'  
app.config['MAIL_DEFAULT_SENDER'] = 'abdullahgm5536@gmail.com'

mail = Mail(app)

@app.route("/send_test_email")
def send_test_email():
    msg = Message('Test Email', recipients=['zabdullah613@gmail.com'])
    msg.body = 'This is a test email sent from Flask'
    try:
        mail.send(msg)
        return "Test email sent!"
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    app.run(debug=True)
