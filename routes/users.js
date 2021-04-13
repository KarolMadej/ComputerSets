const { request } = require('express');
var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');

//GET register
router.get('/register', function(req, res){
  
        res.render('register');
});


//POST register
router.post('/register', function(req, res){
  
    req.checkBody('name', 'Name must have a value.').notEmpty();
    req.checkBody('email', 'Email must have a value.').notEmpty();
    req.checkBody('login', 'Username must have a value.').notEmpty();
    req.checkBody('password', 'Password must have a value.').notEmpty();

    var name = req.body.name;
    var email = req.body.email;
    var login = req.body.login;
    var password= req.body.password;

    var errors = req.validationErrors();

    if (errors)
    {
        res.render('register', {
            errors:errors
        });
    } else {
        User.findOne({login:login,}, function(err, user) {
            if(user) {
                res.redirect('/users/register');
            } else{
                var user = new User({
                    name: name,
                    email: email,
                    login: login,
                    password: password,
                    admin: 0
                });

                user.save(function(err) {
                    if(err) console.log(err);
                    else {
                    res.redirect('/users/login');
                    }
                });
            }
        });
    }
});


//GET login
router.get('/login', function(req, res){
  
    res.render('login');
    
});

//POST login
router.post('/login', function(req, res){

    var login = req.body.login;
    var password = req.body.password;

    User.findOne({login:login}, function(err, user) {
        if(err) return console.log(err);

        if(user.password !== password)
        {
            res.redirect('/users/login');

        }else {
            req.session.user = user;
            res.redirect('/');
        }

    });
    
});

//GET logout
router.get('/logout', function(req, res){  
    delete req.session.user; 
    res.redirect('/');  
});






module.exports = router;

