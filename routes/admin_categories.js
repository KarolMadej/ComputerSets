var express = require('express');
var router = express.Router();
var Category = require('../models/category');



//GET index
router.get('/', function(req, res){
    Category.find(function(err, categories) {
        if(err) return console.log(err);
        res.render('admin/categories' , {categories: categories 
        });
    });
});


// GET add category
router.get('/add-category',  function(req, res){
    
    var title = "";
    var slug = "";

    res.render('admin/add_category', {
        title: title,
        slug: slug,
    });

});


// POST add category
router.post('/add-category',  function(req, res){

    req.checkBody('title', 'Title must have a value.').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/add_category', {
            errors: errors,
            title: title,
        });
    } else {
        Category.findOne({slug: slug}, function (err, category) {
            if (category) {
                res.render('admin/add_category', {
                    title: title,
                });
            } else {
                var category = new Category({
                    title: title,
                    slug: slug
                });

                category.save(function (err) {
                    if (err)
                        return console.log(err);

                Category.find(function (err, categories) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.categories = categories;
                            }
                        });

                    res.redirect('/admin/categories');
                });
            }
        });
    }

});

// GET edit category
router.get('/edit-category/:id',  function(req, res){
    
    Category.findById(req.params.id, function(err, category) {
        if (err) 
            return console.log(err);
        
        res.render('admin/edit_category', {
            title: category.title,
            id: category._id
        });

    });

});

// POST edit category
router.post('/edit-category/:id', function(req, res){

    req.checkBody('title', 'Title must have a value.').notEmpty();

    var title = req.body.title;
    var slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.params.id;

    var errors = req.validationErrors();

    if (errors) {
        res.render('admin/edit_category', {
            errors: errors,
            title: title,
            id: id
        });


    } else {
        Category.findOne({slug: slug, _id: {'$ne': id}}, function (err, category) {
            if (category) {
                res.render('admin/edit_category', {
                    title: title,
                    id: id
                });
            } else {

                Category.findById(id, function (err, category) {
                    if (err)
                        return console.log(err);
                    category.title = title;
                    category.slug = slug;

                    category.save(function (err) {
                        if (err)
                            return console.log(err);

                     Category.find(function (err, categories) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    req.app.locals.categories = categories;
                                }
                            });


                        res.redirect('/admin/categories');

                    });
                });
            }
        });
    }

});

//GET delete category
router.get('/delete-category/:id',  function(req, res){
    Category.findByIdAndRemove(req.params.id, function(err) {
        if(err) return console.log(err);

    Category.find(function (err, categories) {
            if (err) {
                console.log(err);
            } else {
                req.app.locals.categories = categories;
            }
        });

        res.redirect('/admin/categories');
    });
});


module.exports = router;