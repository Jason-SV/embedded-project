
# Smart Farm Project

## Preparing materials

Download YOLOv4 model

https://github.com/AlexeyAB/darknet/releases/download/darknet_yolo_v3_optimal/yolov4.weights

```
pip install opencv-python numpy Flask requests
```


## Run Web
- frontend
```
port: 3000
npm run dev
```

- backend
```
port: 4000
node src/server.js
```

- flask
```
port: 5000
cd detection
python3 -u "/embedded-project/detection/person_detection_api_link.py"
```

## Set Environment

`.env.local`

```

```

`config/config.env`
```
PORT=4000

MONGO_URL=mongodb+srv://mozart1892:<password>@cluster0.lmja0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## Sensors

Soil moister v1

Humidity v2

Temperature v3

Light Intensity V4

Air Quality V5

Motion V6
