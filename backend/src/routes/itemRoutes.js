const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const Item = require('../models/itemModel'); // Adjust path to your model if needed
const upload = require('../upload/upload'); // Ensure you have a proper file upload configuration

const router = express.Router();

// Get the UploadThing API key from the environment variable
const uploadThingApiKey = process.env.UPLOADTHING_KEY;

router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Check if UploadThing API key is defined
    if (!uploadThingApiKey) {
      return res.status(500).json({ message: 'UploadThing API key is missing' });
    }

    // Upload the image to UploadThing using the API key from .env
    const uploadThingApiUrl = 'https://uploadthing.com/api/upload'; // Replace with actual UploadThing API URL

    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);

    // Send the file to UploadThing API
    const response = await axios.post(uploadThingApiUrl, formData, {
      headers: {
        'Authorization': `Bearer ${uploadThingApiKey}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    // Check if the response contains the expected 'url' field
    if (!response.data || !response.data.url) {
      return res.status(400).json({ message: 'Failed to upload image, no URL returned' });
    }

    const imageUrl = response.data.url; // Extract image URL from UploadThing API response

    // Save the item to the database
    const { Person } = req.body;
    const newItem = new Item({
      Person,
      ImageUrl: imageUrl,  // Store the uploaded image URL in the database
    });

    await newItem.save();  // Save the new item

    // Return a success response
    res.status(201).json({ message: 'Item created successfully', item: newItem });
  } catch (err) {
    console.error(err);
    // Catch and return any errors that occur
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;