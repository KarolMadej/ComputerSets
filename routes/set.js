var express = require('express');
var router = express.Router();

var Product = require('../models/product');

//GET add product to set
router.get('/add/:product',  function(req, res){

    var slug = req.params.product;

    Product.findOne({slug:slug}, function(err, product) {
        if (err) console.log(err);

       if(typeof req.session.set == "undefined") {
           req.session.set = [];
           req.session.set.push({
            "title": slug,
            "qty": 1,
            "price": parseFloat(product.price).toFixed(2),
            "image": '/product_images/' + product.image
       }); 
       } else {
           var set = req.session.set;
           var exist = true;
            
           for (var i = 0; i < set.length; i++) {
            if (set[i].title == slug) {
                set[i].qty++;
                exist = false;
                break;
            }
        }
            if(exist)
            {
                set.push({
                    "title": slug,
                    "qty": 1,
                    "price": parseFloat(product.price).toFixed(2),
                    "image": '/product_images/' + product.image
               });  
            }
        

       }
       res.redirect('back');
    });
});


//GET makeset
router.get('/makeset',  function(req, res){
    res.render('makeset', {
        cart: req.session.cart
    });

});

//GET update
router.get('/update/:product',  function(req, res){
      
    var slug = req.params.product;
    var set = req.session.set;
    var action = req.query.action;

    for (var i = 0; i < set.length; i++) {
        if (set[i].title == slug) {
            switch (action) {
                case "add":
                    set[i].qty++;
                    break;
                case "remove":
                    set[i].qty--;
                    if (set[i].qty < 1)
                        set.splice(i, 1);
                        if (set.length == 0)
                        delete req.session.set;
                    break;
                case "delete":
                         set.splice(i, 1);
                    if (set.length == 0)
                        delete req.session.set;
                    break;
                default:
                    break;
            }
            break;
        }
    }

    res.redirect('/set/makeset');

});



router.get('/clear', function (req, res) {
    delete req.session.set;  
    res.redirect('/set/makeset');
});

module.exports = router;

