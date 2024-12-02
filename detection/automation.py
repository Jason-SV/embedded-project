# auto person detection push data to mongodb from firebase
# don't forget login firebase and get auth_token
# don't forget run person_detection_api_link.py

import base64
import datetime
import requests
import cloudinary
from cloudinary.uploader import upload
from pymongo import MongoClient
import uuid
import os

auth_token = ""

# Cloudinary configuration
cloudinary.config(
    cloud_name="db4uwfswo",
    api_key="871311856815196",
    api_secret="mGDWSL69JlXQ-y_jxdVAKWyh8hs"
)

# MongoDB connection
client = MongoClient("mongodb+srv://mozart1892:0000@cluster0.lmja0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
collection = client['test']['items']

# Upload image to Cloudinary
def upload_image(file_path):
    try:
        upload_result = cloudinary.uploader.upload(file_path,
                                                   folder="your_project_folder",
                                                   transformation=[
                                                       {'width': 800, 'crop': 'limit'},
                                                       {'quality': 'auto'}
                                                   ])
        return {
            'fileUrl': upload_result['secure_url'],
            'publicId': upload_result['public_id'],
            'message': 'File uploaded successfully'
        }
    except Exception as e:
        print(f"Upload error: {e}")
        return {'error': str(e)}

# Send image URL to detection API
def send_image_url(image_url):
    detection_api_url = 'http://127.0.0.1:5000/detect-person'
    if not image_url:
        return {'message': 'Image URL is required'}
    try:
        response = requests.post(detection_api_url, json={'imageUrl': image_url})
        if response.status_code == 200:
            return response.json()
        else:
            return {'error': f'Failed to get a valid response. Status code: {response.status_code}'}
    except Exception as e:
        return {'error': f'Error: {str(e)}'}

# Fetch latest document from MongoDB and compare timestamps
latest_document = collection.find().sort("Datetime", -1).limit(1)
last_document = latest_document[0]
current_time = int(last_document['Datetime'].timestamp())

# Fetch data from Firebase
uid = "VwaybRYD1oYRmhUpbPY90Gs80zH2"
url = f'https://farm-d17a8-default-rtdb.asia-southeast1.firebasedatabase.app/UsersData/{uid}/readings.json?auth={auth_token}'

response = requests.get(url)
if response.status_code == 200:
    data = response.json()

use_list = []
for key, value in data.items():
    if int(value['timestamp']) >= current_time:
        use_list.append(value)

# Process and insert data into MongoDB
doc = []
for item in use_list:
    item['timestamp'] = datetime.datetime.fromtimestamp(int(item['timestamp']))  # Ensure correct datetime
    image_data = base64.b64decode(item['data'])
    
    # Create a unique file name for each image
    unique_filename = f"output_image_{uuid.uuid4()}.jpg"
    with open(unique_filename, "wb") as image_file:
        image_file.write(image_data)

    # Upload the image to Cloudinary
    upload_result = upload_image(unique_filename)
    
    # Send the image URL to the detection API
    result = send_image_url(upload_result['fileUrl'])
    
    # Prepare document for insertion into MongoDB
    doc.append({
        "Person": result.get('person_detected', False),
        "ImageUrl": upload_result['fileUrl'],
        "Datetime": item['timestamp']
    })

    # Clean up the locally saved image file after uploading
    os.remove(unique_filename)

# Insert the documents into MongoDB
if doc:
    collection.insert_many(doc)
    print("Documents inserted into MongoDB")
    print(doc)