import pickle
import torch
from PIL import Image
import numpy as np
from transformers import ViTForImageClassification

# Load the model
try:
    with open('model_1_Binary_Updated.pkl', 'rb') as f:
        model = pickle.load(f)
    print("✅ Model loaded successfully!")
    print(f"Model type: {type(model)}")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    exit()

# Load and preprocess image
image = Image.open("Normal-2624.png").convert("RGB")
image = image.resize((224, 224))
image_array = np.array(image) / 255.0
input_tensor = torch.tensor(image_array).permute(2, 0, 1).unsqueeze(0).float()

# Predict
with torch.no_grad():
    outputs = model(input_tensor)
    
    # Handle Hugging Face model output
    if hasattr(outputs, 'logits'):
        logits = outputs.logits
        probabilities = torch.softmax(logits, dim=1)
        tb_prob = probabilities[0][1].item()  # Probability for class 1 (TB)
        prediction = "TB Detected" if tb_prob > 0.5 else "No TB"
        print(f"🔍 Prediction: {prediction} (Confidence: {tb_prob:.2%})")
    else:
        print("❌ Model output format not recognized")