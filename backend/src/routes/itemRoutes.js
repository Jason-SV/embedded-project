const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const Item = require('../models/itemModel');  // Adjust path to your model if needed
const upload_muter = require('../upload/upload');  // Ensure you have a proper file upload configuration
const router = express.Router();

const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Get the UploadThing API key from the environment variable
const uploadThingApiKey = process.env.UPLOADTHING_KEY;
const uploadThingSecretKey = process.env.UPLOADTHING_SECRET_KEY;

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

// GET /api/items - Get all items from MongoDB
router.get('/', async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items from MongoDB
    res.status(200).json(items); // Return all items
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/items/:id - Get a single item by ID from MongoDB
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id); // Find item by ID from MongoDB
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(item); // Return the item
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// // POST /api/items - Upload image to UploadThing and store in MongoDB
// router.post('/', upload.single('image'), async (req, res) => {
//   try {
//     // Check if image is provided
//     if (!req.file) {
//       return res.status(400).json({ message: 'Image is required' });
//     }

//     // Create a FormData object for UploadThing
//     const formData = new FormData();
//     formData.append('file', req.file.buffer, req.file.originalname);

//     // Upload the image to UploadThing
//     const uploadThingApiUrl = 'https://uploadthing.com/api/upload';  // Replace with actual UploadThing URL
//     const response = await axios.post(uploadThingApiUrl, formData, {
//       headers: {
//         'Authorization': `Bearer ${uploadThingApiKey}:${uploadThingSecretKey}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     // Check if UploadThing returned a valid URL
//     if (!response.data || !response.data.url) {
//       return res.status(400).json({ message: 'Failed to upload image to UploadThing' });
//     }

//     const imageUrl = response.data.url;
//     const { Person } = req.body;  // Assume the `Person` field is sent in the body

//     // Create a new Item and save to MongoDB
//     const newItem = new Item({
//       Person,
//       ImageUrl: imageUrl,
//     });

//     await newItem.save();

//     // Send success response
//     res.status(201).json({ message: 'Item created successfully', item: newItem });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });


// POST /api/items - Create a new item in MongoDB
router.post('/', async (req, res) => {
  try {
    const { Person, ImageUrl } = req.body;
    if (Person === undefined || !ImageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Person and ImageUrl are required fields',
      });
    }

    // Create a new item based on the schema
    const newItem = new Item({
      Person,
      ImageUrl,
    });

    await newItem.save();

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      item: newItem,
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating item',
      error: error.message,
    });
  }
});

// PUT /api/items/:id - Update an item in MongoDB
router.put('/:id', async (req, res) => {
  try {
    const { Person, ImageUrl } = req.body;
    const { id } = req.params;

    // Find the item by ID
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating item',
      error: error.message,
    });
  }
});

// DELETE /api/items/:id - Delete an item from MongoDB
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Find the item by ID
//     const item = await Item
//       .findById(id)
//       .populate('Person')
//       .exec(); // Populate the 'Person' field if needed
//   } catch (error) {
//     console.error('Error deleting item:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while deleting item',
//       error: error.message,
//     });
//   }
// });



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// POST /upload - Upload file to Cloudinary
router.post('/upload', upload_muter.single('image'), async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    // Get the uploaded file from the request
    const file = req.file;

    // Upload the file to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: 'your_project_folder', 
          // Optional transformations
          transformation: [
            { width: 800, crop: 'limit' },
            { quality: 'auto' }
          ]
        }, 
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);  // Use `file.buffer` for Multer memory storage
    });

    // Respond with uploaded image details
    res.status(200).json({
      success: true,
      fileUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during upload',
      error: error.message
    });
  }
});

// Optional: Delete image route
router.delete('/delete/:publicId', async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const deleteResponse = await cloudinary.uploader.destroy(publicId);
    
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      result: deleteResponse
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
});



module.exports = router;