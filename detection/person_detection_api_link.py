# input: json format
# imageUrl: str

import requests
from flask import Flask, request, jsonify
import cv2
import numpy as np
import os

app = Flask(__name__)

config_path = "model_info/yolov4.cfg"  # Path to YOLOv4 config file
weights_path = "model_info/yolov4.weights"  # Path to YOLOv4 weights file
names_path = "model_info/coco.names"  # Path to COCO class names

net = cv2.dnn.readNet(weights_path, config_path)

# Enable GPU acceleration if available (uncomment if necessary)
# net.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
# net.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)


with open(names_path, "r") as f:
    classes = f.read().strip().split("\n")

target_class_id = 0  # COCO class ID for "person"


def detect_person_in_image(image):
    """
    Detects if there is a person in the given image using YOLOv4.
    Returns 1 if a person is detected, otherwise returns 0.
    """
    height, width = image.shape[:2]

    # Preprocess the image for YOLO
    blob = cv2.dnn.blobFromImage(image, scalefactor=1 / 255.0, size=(320, 320), swapRB=True, crop=False)
    net.setInput(blob)
    layer_names = net.getUnconnectedOutLayersNames()
    layer_outputs = net.forward(layer_names)

    boxes = []
    confidences = []
    class_ids = []

    for output in layer_outputs:
        for detection in output:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]

            # Filter detections for the "person" class (ID 0) and confidence threshold
            if confidence > 0.6 and class_id == target_class_id:
                box = detection[0:4] * np.array([width, height, width, height])
                center_x, center_y, w, h = box.astype("int")
                x = int(center_x - w / 2)
                y = int(center_y - h / 2)

                boxes.append([x, y, int(w), int(h)])
                confidences.append(float(confidence))
                class_ids.append(class_id)

    indices = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)

    if len(indices) > 0:
        return True
    else:
        return False


@app.route('/detect-person', methods=['POST'])
def detect_person():
    """
    API endpoint to receive an image URL and check if a person is detected.
    Returns 1 if a person is detected, 0 if no person is detected.
    """
    data = request.get_json()

    if not data or 'imageUrl' not in data:
        return jsonify({"error": "No image URL provided"}), 400

    imageUrl = data['imageUrl']

    # Fetch image from the URL
    try:
        response = requests.get(imageUrl)
        response.raise_for_status()  # Will raise an exception for 4xx/5xx responses
        nparr = np.frombuffer(response.content, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            return jsonify({"error": "Invalid image file"}), 400

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to retrieve image from URL: {e}"}), 400

    result = detect_person_in_image(image)

    return jsonify({"person_detected": result})


if __name__ == '__main__':
    app.run(debug=True)