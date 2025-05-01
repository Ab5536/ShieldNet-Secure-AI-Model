import requests

url = "http://127.0.0.1:5000/"
message = {"message": "What is fever?"}
response = requests.post(url, json=message)
print(response.json())  
