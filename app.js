var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var config = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
var passport = require('passport');

//Inicjializacja aplikacji
var app = express();


//Baza danych
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',function(){
    //console.log('Polaczono');
});

//Widoki 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//Public
app.use(express.static(path.join(__dirname, 'public')));

//Global error
app.locals.errors = null;

var Page = require('./models/page');
Page.find({}).sort({sorting: 1}).exec(function (err, pages) {
    if (err) {
        console.log(err);
    } else {
        app.locals.pages = pages;
    }
});

var Category = require('./models/category');
Category.find(function (err, categories) {
    if (err) {
        console.log(err);
    } else {
        app.locals.categories = categories;
    }
});

// Express fileUpload middleware
app.use(fileUpload());

//Body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

// Express Session middleware
app.set('trust proxy', 1);
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
}));


// Express Validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
                , root = namespace.shift()
                , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isImage: function(value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                     return '.jpg';
                case 'png':
                     return '.png';
                case '':
                     return '.png';
                default:
                    return false;
            }
        }
    }
}));

// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


app.get('*', function(req,res,next){
    res.locals.set = req.session.set;
    res.locals.user = req.session.user;
    next();
});


//Routes
var pages = require('./routes/pages.js')
var products = require('./routes/products.js')
var set = require('./routes/set.js')
var users = require('./routes/users.js')
var adminPages = require('./routes/admin_pages.js')
var adminCategories = require('./routes/admin_categories.js')
var adminProducts = require('./routes/admin_products.js')

app.use('/admin/pages', adminPages)
app.use('/admin/categories', adminCategories)
app.use('/admin/products', adminProducts)
app.use('/products', products)
app.use('/set',set)
app.use('/users',users)
app.use('/',pages)


//Serwer
var port = 3000;

app.listen(port, function() {
    //console.log('Serwer wystartowal');
});

