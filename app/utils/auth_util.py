import bcrypt

def get_user_hashed(user_data):
    plain_password = user_data.get("password")
    if not plain_password:
        raise ValueError("Password is required in user_data")

    # Hash the password
    hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())

    # Update the dict with the hashed password
    user_data["password"] = hashed_password.decode('utf-8')  # store as string

    return user_data

def checkuserPassword(plainpassword, hashedpassword):
    """
    Verifies a plain text password against a hashed password.
    Returns True if they match, False otherwise.
    """
    if not plainpassword or not hashedpassword:
        return False

    return bcrypt.checkpw(plainpassword.encode('utf-8'), hashedpassword.encode('utf-8'))