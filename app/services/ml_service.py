import torch
import pickle
import os
import numpy as np
from torchvision import transforms
from PIL import Image, UnidentifiedImageError

model_path = 'app/machine_learning/model_1_Binary.pkl'
def load_model(path):
    # if not os.path.exists(path):
    #     raise FileNotFoundError(f"Model file not found at {path}")
    try:
        with open(path, 'rb') as f:
            model = pickle.load(f)
        print("✅ Model loaded successfully!")
        print(f"Model type: {type(model)}")
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
    

# Load model once when app starts
model = load_model(model_path)

# # Define image transform
# transform = transforms.Compose([
#     transforms.Resize((224, 224)),
#     transforms.ToTensor(),
#     transforms.Normalize([0.5], [0.5])
# ])

def predict_image(file):
    """Process image and return model prediction."""
    try:
        print("image predict tak puhanchi hai")
        image = Image.open(file).convert('RGB')
        image = image.resize((224, 224))
        image_array = np.array(image) / 255.0
        input_tensor = torch.tensor(image_array).permute(2, 0, 1).unsqueeze(0).float()

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
    except UnidentifiedImageError:
        print("masla hogya")
        raise ValueError("Invalid image file. Please upload a valid image.")
