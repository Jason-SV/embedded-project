const axios = require('axios');
const fs = require('fs');
const Item = require('.../models/itemModel');  // Adjust path as necessary
const mongoose = require('mongoose');
const fetch = require('node-fetch');  // Ensure 'node-fetch' is installed
const FormData = require('form-data'); // Import FormData for sending multipart/form-data
const cloudinary = require('cloudinary').v2; // Cloudinary SDK

// Function to convert ISO 8601 datetime to Unix timestamp (seconds)
function datetimeToTimestamp(datetimeString) {
  const datetime = new Date(datetimeString);
  return Math.floor(datetime.getTime() / 1000);
}

// Function to convert base64 to image and save it
function saveBase64Image(base64String, filePath) {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");  // Strip the data URL prefix
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filePath, buffer);
}

// Function to retrieve data from Firebase
async function getFirebaseData() {
  const authToken = 'YOUR_FIREBASE_AUTH_TOKEN';  // Replace with your actual Firebase auth token
  const uid = 'VwaybRYD1oYRmhUpbPY90Gs80zH2'; // Replace with actual user ID

  const url = `https://farm-d17a8-default-rtdb.asia-southeast1.firebasedatabase.app/UsersData/${uid}.json?auth=${authToken}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from Firebase. Status: ${response.status}`);
    }
    return await response.json();  // This will be an object with 'readings' and other data
  } catch (error) {
    console.error('Error fetching Firebase data:', error);
    throw error;
  }
}

// Function to automate sending API data
const triggerFirebaseToMongo = async () => {
  try {
    // Step 1: Retrieve the last item from MongoDB collection (sorted by datetime)
    const latestItem = await Item.findOne().sort({ datetime: -1 });

    if (!latestItem) {
      console.log('No data found in MongoDB.');
      return;
    }

    // Step 2: Convert datetime to timestamp (Mongo timestamp)
    const mongoTimestamp = datetimeToTimestamp(latestItem.Datetime);
    console.log(`MongoDB Timestamp: ${mongoTimestamp}`);

    // Step 3: Retrieve data from Firebase
    const firebaseData = await getFirebaseData();
    const readings = firebaseData.readings;  // Access the readings object

    // Step 4: Loop through the readings and process if the timestamp is newer than Mongo timestamp
    for (let key in readings) {
      const reading = readings[key];  // Access each reading

      const firebaseTimestamp = reading.timestamp;
      const base64Image = reading.data;

      console.log(`Firebase Timestamp: ${firebaseTimestamp}`);

      // Step 5: Compare Firebase timestamp with MongoDB timestamp
      if (firebaseTimestamp > mongoTimestamp) {
        console.log('Firebase data is newer. Processing image...');

        if (!base64Image) {
          console.log('No base64 image data found in Firebase.');
          continue;
        }

        // Step 6: Convert base64 to image and save it
        const imageFilePath = './images/newImage.png';  // Path to save the image
        saveBase64Image(base64Image, imageFilePath);

        console.log('Image saved successfully.');

        // Step 7: Prepare the image for sending via API (form-data)
        const formData = new FormData();
        formData.append('image', fs.createReadStream(imageFilePath));

        // Replace with your actual backend API URL
        const backendApiUrl = 'http://localhost:4000/api/items/isad'; 

        // Step 8: Send the image to the backend API
        const response = await axios.post(backendApiUrl, formData, {
          headers: formData.getHeaders(),
        });

        console.log('Data sent to backend:', response.data);
      } else {
        console.log('No new Firebase data to process.');
      }
    }
  } catch (error) {
    console.error('Error processing data:', error);
  }
};

// Call the function manually (without interval) for testing
triggerFirebaseToMongo();
