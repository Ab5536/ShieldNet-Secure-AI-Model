from app import create_app  # Import the create_app function from the app package

app = create_app()  # Create the Flask app by calling the create_app function

if __name__ == '__main__':  # Check if this script is being run directly (as opposed to being imported)
    app.run(debug=True)  # Run the Flask app locally
