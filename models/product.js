var mongoose = require('mongoose');
const Category = require('./category');

var ProductSchema = mongoose.Schema({
   
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
    }
    
});

var Product = mongoose.model('product', ProductSchema);
module.exports = Product;


