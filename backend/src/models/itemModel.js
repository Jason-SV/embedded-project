const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  Datetime: { 
    type: Date, 
    default: Date.now }, 
  Person: { 
    type: Boolean, 
    required: true },  
  ImageUrl: { 
    type: String, 
    required: true }, 
});

module.exports = mongoose.model('Item', itemSchema);