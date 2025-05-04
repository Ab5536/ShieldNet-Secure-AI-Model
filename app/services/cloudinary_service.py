import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_image_to_cloudinary(image_file):
    result = cloudinary.uploader.upload(image_file)
    return result['secure_url']  # or 'url' if you want non-HTTPS

def save_image_for_user(mongo, email, image_file):
    print("🚀 Starting image save process...")

    if not email:
        print("❌ Email not provided.")
        return False, "Email is required."

    if not image_file or image_file.filename == '':
        print("❌ Invalid or empty image file.")
        return False, "Invalid image file."

    # Check if the image file has content (before uploading)
    image_file.seek(0)  # Reset the file pointer
    if len(image_file.read()) == 0:
        print("❌ The file is empty.")
        return False, "Empty file."
    
    # Reset file pointer after reading the file
    image_file.seek(0)

    try:
        print("📤 Uploading image to Cloudinary...")
        image_url = upload_image_to_cloudinary(image_file)
        print(f"✅ Image uploaded successfully: {image_url}")
    except Exception as e:
        print(f"❌ Cloudinary upload failed: {str(e)}")
        return False, f"Cloudinary upload error: {str(e)}"

    try:
        print("🧾 Attempting to update user record in MongoDB...")
        result = mongo.db.users.update_one(
            {"email": email},
            {"$push": {"images": image_url}}
        )

        if result.matched_count == 0:
            print("❌ No user found with that email.")
            return False, "User not found in database."

        print("✅ User document updated successfully.")
        return True, image_url

    except Exception as e:
        print(f"❌ MongoDB update failed: {str(e)}")
        return False, f"MongoDB update error: {str(e)}"
