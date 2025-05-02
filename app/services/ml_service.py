import torch
import pickle
import os
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

# Define image transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])

def predict_image(file):
    """Process image and return model prediction."""
    try:
        print("image predict tak puhanchi hai")
        image = Image.open(file).convert('RGB')
        input_tensor = transform(image).unsqueeze(0)

        with torch.no_grad():
            output = model(input_tensor)
            if hasattr(output, 'logits'):
                output = output.logits
            print("final stage hai")
            prediction = torch.argmax(output, dim=1).item()

        return 'Active TB' if prediction == 1 else 'Not Active TB'

    except UnidentifiedImageError:
        print("masla hogya")
        raise ValueError("Invalid image file. Please upload a valid image.")
