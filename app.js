
var express= require('express');
var expresslayouts=require('express-ejs-layouts');
var RegisterController= require('./controllers/RegisterController');
var flash = require('connect-flash');
var session = require('express-session');
var passport=require('passport');

var app = express();

//passport config

require('./config/passport')(passport);


//set up template engine
app.set('view engine','ejs');

//set to use static file
app.use(express.static('./public'));

//session
app.use(session({
	secret:'secret',
	resave:true,
	saveUninitialized: true
}));

//passport middleware for login
app.use(passport.initialize());
app.use(passport.session());

//conncet flash

app.use(flash());

//global variable
app.use(function(req,res,next){

	res.locals.success_msg=req.flash('success_msg');
	res.locals.error_msg=req.flash('error_msg');
	res.locals.error=req.flash('error');
	next();
});

//fire todoController


RegisterController(app);




//listen to a port
app.listen(8080);

console.log('you are listening');