import pickle
import torch
from torchvision import transforms
from PIL import Image, UnidentifiedImageError

model_path = 'app/machine_learning/model_1_Binary.pkl'

def load_model(path):
    """Load a HuggingFace ViT model using pickle."""
    try:
        with open(path, 'rb') as f:
            model = pickle.load(f)
        model.eval()
        print("✅ Model loaded successfully!")
        print(f"Model type: {type(model)}")
        return model
    except Exception as e:
        raise RuntimeError(f"❌ Failed to load model: {e}")

# Load model once at app start
model = load_model(model_path)

# Define image transformation
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.5], [0.5])
])

def predict_image(file):
    """Process image and return model prediction."""
    try:
        image = Image.open(file).convert('RGB')
        input_tensor = transform(image).unsqueeze(0)

        with torch.no_grad():
            output = model(input_tensor)

            # Handle HuggingFace ViT output
            if hasattr(output, 'logits'):
                logits = output.logits
                probs = torch.softmax(logits, dim=1)
                tb_prob = probs[0][1].item()
                return f'TB Detected (Confidence: {tb_prob:.2%})' if tb_prob > 0.5 else 'No TB'
            else:
                prediction = torch.argmax(output, dim=1).item()
                return 'Active TB' if prediction == 1 else 'Not Active TB'

    except UnidentifiedImageError:
        raise ValueError("Invalid image file. Please upload a valid image.")
