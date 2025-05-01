from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

openai.api_key = "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"

# Predefined responses for general healthcare queries
healthcare_responses = {
    "What is fever?": "Fever is a temporary increase in your body temperature, often due to an illness.",
    "What are the symptoms of flu?": "Symptoms of the flu include fever, chills, muscle aches, cough, congestion, runny nose, headaches, and fatigue.",
    "How to prevent diabetes?": "To prevent diabetes, maintain a healthy weight, follow a balanced diet, stay active, and avoid excessive sugar intake.",
}

@app.route("/")
def home():
    return "Chatbot is running! Use the `/chat` endpoint to interact with the bot."
@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "").strip()

    # Check for predefined healthcare queries
    if user_message in healthcare_responses:
        response = healthcare_responses[user_message]
    else:
        # Use OpenAI GPT model for general or advanced responses
        try:
            completion = openai.Completion.create(
                engine="text-davinci-003",
                prompt=f"You are a healthcare and general-purpose chatbot. Respond concisely to: {user_message}",
                max_tokens=150,
                temperature=0.7,
            )
            response = completion.choices[0].text.strip()
        except Exception as e:
            response = f"An error occurred: {str(e)}"

    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
