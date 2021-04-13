var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var resizeImg = require('resize-img');

var Product = require('../models/product');
var Category = require('../models/category');
const { connection } = require('mongoose');


// GET index
router.get('/',  function(req, res){
    var count;

    Product.count(function(err, i){
        count = i;
    });

    Product.find(function(err, products) {
        if(err) return console.log(err);
        res.render('admin/products' , {
            products: products,
            count: count
        });
    });
});


// GET add product
router.get('/add-product',  function(req, res){
    
    var title = "";
    var description = "";
    var price = "";

    Category.find(function(err, categories) {
        res.render('admin/add_product', {
            title: title,
            description: description,
            categories: categories,
            price: price
        });
    });
});

//Post add product
router.post('/add-product',  function (req, res) {
    if(!req.files) {imageFile = "";}
    if(req.files){
        var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
    }

    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('description', 'Description must have a value.').notEmpty();
    req.checkBody('price', 'Price must have a value.').isDecimal();
    req.checkBody('image', 'You must upload an image').isImage(imageFile);

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var description = req.body.description;
    var price = req.body.price;
    price = parseFloat(price).toFixed(2);
    var category = req.body.category;

    var errors = req.validationErrors();

    if (errors) {
        Category.find(function (err, categories) {
            res.render('admin/add_product', {
                errors: errors,
                title: title,
                description: description,
                categories: categories,
                price: price
            });
        });
    } else {
        Product.findOne({slug: slug}, function (err, product) {
            if (product) {
                Category.find(function (err, categories) {
                    res.render('admin/add_product', {
                        title: title,
                        description: description,
                        categories: categories,
                        price: price
                    });
                });
            } else {

                var product = new Product({
                    title: title,
                    slug: slug,
                    description: description,
                    price: price,
                    category: category,
                    image: imageFile
                });

                
                product.save(function (err) {
                    if (err)
                        return console.log(err);

                    if (imageFile != "") {
                        var productImage = req.files.image;
                        var path = 'public/product_images/' + '/' + imageFile;

                        productImage.mv(path, function (err) {
                            return console.log(err);
                        });
                    }
                });
                
                res.redirect('/admin/products');
            }
        });
    }

});

// GET edit product
router.get('/edit-product/:id',  function(req, res){
    
    Category.find(function (err, categories) {        
    Product.findById(req.params.id, function(err, product) {
        if (err) 
            return console.log(err);
        
        res.render('admin/edit_product', {
            title: product.title,
            description: product.description,
            categories: categories,
            category: product.category.replace(/\s+/g, '-').toLowerCase(),
            price: parseFloat(product.price).toFixed(2),
            image: product.image,
            id: product._id
        });
    
    });
    
});

});

// POST edit product
router.post('/edit-product/:id',  function(req, res){


    if(!req.files) {imageFile = "";}
    if(req.files){
        var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
    }


    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('description', 'Description must have a value.').notEmpty();
    req.checkBody('price', 'Price must have a value.').isDecimal();
    req.checkBody('image', 'You must upload an image').isImage(imageFile);

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var description = req.body.description;
    var price = req.body.price;
    price = parseFloat(price).toFixed(2);
    var category = req.body.category;
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        Category.find(function (err, categories) {
            res.render('admin/edit_product', {
                errors: errors,
                title: title,
                description: description,
                categories: categories,
                price: price
            });
        });


    } else {
        Product.findOne({slug: slug, _id: {'$ne': id}}, function (err, product) {
            if (product) {
                Category.find(function (err, categories) {
                    res.render('admin/edit_product', {
                        title: title,
                        description: description,
                        categories: categories,
                        price: price
                    });
                });
            } else {

                Product.findById(id, function (err, product) {
                    if (err)
                        return console.log(err);

                        product.title = title;
                        product.slug = slug;
                        product.desc = description;
                        product.price = parseFloat(price).toFixed(2);
                        product.category = category;
                        if (imageFile != "") {
                            product.image = imageFile;
                        }
    
                    product.save(function (err) {
                        if (err)
                            return console.log(err);
                            
                            
                        if (imageFile != "") {
                                var productImage = req.files.image;
                                var path = 'public/product_images/' + '/' + imageFile;
        
                                productImage.mv(path, function (err) {
                                    return console.log(err);
                                });
                            }

                    });
                    res.redirect('/admin/products');
                });
            }
        });
    }

});

// GET delete product
router.get('/delete-product/:id',  function(req, res){
    Product.findByIdAndRemove(req.params.id, function(err) {
        if(err) return console.log(err);

        res.redirect('/admin/products');
    });
});





module.exports = router;