const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productname: { type: String },
  price: { type: String,  },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;