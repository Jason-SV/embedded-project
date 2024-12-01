// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// const axios = require('axios');  // To make API requests

// admin.initializeApp();

// // Trigger when new data is added to the path: /UsersData/{userId}/readings/{readingId}/data
// exports.onNewImageAdded = functions.database
//     .ref('/UsersData/{userId}/readings/{readingId}/data')  // Path to listen to
//     .onCreate(async (snapshot, context) => {
//         const base64Image = snapshot.val();  // Get the base64 data from Firebase

//         console.log('New image added:', base64Image.substring(0, 10));  // Log the base64 image string

//         // If there's a valid image (base64 string), send it to your backend
//         // if (base64Image) {
//         //     try {
//         //         // Make an API request to your backend (replace with your actual backend URL)
//         //         const backendApiUrl = 'http://your-backend-api-url/endpoint';  // Update this URL
//         //         const response = await axios.post(backendApiUrl, {
//         //             image: base64Image,
//         //         });

//         //         console.log('Image sent to backend:', response.data);
//         //     } catch (error) {
//         //         console.error('Error sending image to backend:', error);
//         //     }
//         // } else {
//         //     console.log('No image data found.');
//         // }
//     });

// Import necessary Firebase and Cloud Functions modules
const { initializeApp } = require("firebase-admin/app");
const { getDatabase } = require("firebase-admin/database");
const { onValueCreated } = require("firebase-functions/v2/database");
const axios = require("axios");  // To make HTTP requests
const { logger } = require("firebase-functions");

const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

initializeApp();  // Initialize Firebase Admin SDK

// Define the function that listens to new data added to the path "/UsersData/{userId}/readings/{readingId}/data"
exports.onNewImageAdded = onValueCreated("/UsersData/{userId}/readings/{readingId}/data", async (event) => {
  // Get the base64 image data from the event
  const base64Image = event.data.val();  // event.data.val() retrieves the new data
  const userId = event.params.userId;
  const readingId = event.params.readingId;

  // Log the first 10 characters of the base64 string for debugging purposes
  logger.log('New image added:', base64Image.substring(0, 10));

  // If a valid base64 image is found, send it to your backend API
//   if (base64Image) {
//     try {
//       const backendApiUrl = 'http://your-backend-api-url/endpoint';  // Replace with your backend URL

//       const response = await axios.post(backendApiUrl, {
//         image: base64Image,  // Send the base64 image data
//         userId: userId,
//         readingId: readingId,
//       });

//       logger.log('Image sent to backend:', response.data);
//     } catch (error) {
//       logger.error('Error sending image to backend:', error);
//     }
//   } else {
//     logger.log('No image data found.');
//   }

  // Return a promise to indicate the function is complete
  return null;
});