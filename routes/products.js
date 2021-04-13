var express = require('express');
var router = express.Router();

var Product = require('../models/product');
var Category = require('../models/category');

//GET index
router.get('/', function(req, res){
    Product.find(function(err, products) {
        if (err) console.log(err);

        res.render('all_products', {
            title: "All products",
            products: products
        });
    });
});

//GET product by category
router.get('/:category', function(req, res){

    var cslug = req.params.category;
    Category.findOne({slug:cslug}, function(err,cat){
        Product.find({category: cslug},function(err, products) {
            if (err) console.log(err);
    
            res.render('all_products', {
                title: cat.title,
                products: products
            });
        });
    });
});

//GET product details
router.get('/:category/:product', function(req, res){

    Product.findOne({slug: req.params.product}, function(err, product) {
        if(err) return console.log(err);
        else{
            res.render('product', {
                title: product.title,
                product: product
            });
        }

    });

    
});

module.exports = router;

