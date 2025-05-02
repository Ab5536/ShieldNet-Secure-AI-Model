import pickle
import torch
import numpy as np
from PIL import Image, UnidentifiedImageError
from torchvision import transforms

# Load the trained ViT model
model_path = '../machine_learning/model_1_Binary.pkl'

def load_model(path):
    """Load the model from the specified path and map it to the CPU."""
    try:
        with open(path, 'rb') as file:
            model = pickle.load(file)
        model.to(torch.device('cpu'))
        model.eval()
        return model
    except Exception as e:
        raise RuntimeError(f"Failed to load the model: {str(e)}")

# Initialize model 
model = load_model(model_path)
# and transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])

def predict_image(file):
    """Process the uploaded image and return prediction."""
    try:
        image = Image.open(file).convert('RGB')
        input_tensor = transform(image).unsqueeze(0)

        with torch.no_grad():
            output = model(input_tensor)
            if not isinstance(output, torch.Tensor):
                if hasattr(output, "logits"):
                    output = output.logits
                else:
                    raise TypeError("Model output is not a tensor and does not have 'logits' attribute.")
            prediction = torch.argmax(output, dim=1).item()

        return 'Active TB' if prediction == 1 else 'Not Active TB'

    except UnidentifiedImageError:
        raise ValueError("Invalid image file. Please upload a valid image.")
