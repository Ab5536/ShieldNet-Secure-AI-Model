import torch
import pickle
import os
import numpy as np
from torchvision import transforms
from PIL import Image, UnidentifiedImageError
from io import BytesIO

model_path = 'app/machine_learning/model_1_Binary.pkl'
def load_model(path):
    # if not os.path.exists(path):
    #     raise FileNotFoundError(f"Model file not found at {path}")
    try:
        with open(path, 'rb') as f:
            model = pickle.load(f)
        print("✅ Model loaded successfully!")
        print(f"Model type: {type(model)}")
        return model
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
        
        image = Image.open(file).convert('RGB')
        image = image.resize((224, 224))
        image_array = np.array(image) / 255.0
        input_tensor = torch.tensor(image_array).permute(2, 0, 1).unsqueeze(0).float()

        with torch.no_grad():
            outputs = model(input_tensor)

            if hasattr(outputs, 'logits'):
                logits = outputs.logits
                probabilities = torch.softmax(logits, dim=1)
                tb_prob = probabilities[0][1].item()
                prediction = "TB Detected" if tb_prob > 0.5 else "No TB"
                print("✅ Prediction successful")
                return f"Prediction: {prediction} (Confidence: {tb_prob:.2%})"
            else:
                print("❌ Model output format not recognized")
                return "Model output format not recognized."

    except UnidentifiedImageError:
        print("❌ Invalid image file")
        raise ValueError("Invalid image file. Please upload a valid image.")

    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return f"Unexpected error occurred: {str(e)}"


def validFiletype(image_file):
    try:
        ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'bmp', 'tiff', 'webp','heic'}
        MAX_FILE_SIZE_MB = 5  # reasonable size limit
        # Check filename extension
        filename = image_file.filename.lower()
        if '.' not in filename or filename.rsplit('.', 1)[1] not in ALLOWED_EXTENSIONS:
            print("❌ Unsupported file extension.")
            return False

        # Check file size
        image_file.seek(0, 2)  # Move to end of file
        file_size = image_file.tell() / (1024 * 1024)  # size in MB
        if file_size > MAX_FILE_SIZE_MB:
            print(f"❌ File too large: {file_size:.2f} MB")
            return False
        image_file.seek(0)  # Reset pointer

        # Check if it's a valid image
        Image.open(image_file).verify()
        image_file.seek(0)
        return True

    except Exception as e:
        print(f"❌ Image verification failed: {e}")
        return False