const multer = require('multer');

// Set Multer storage engine to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });  // Middleware for handling file uploads

module.exports = upload;