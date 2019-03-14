var bodyParser=require('body-parser');

var mongoose  =require('mongoose');
var bcrypt= require('bcryptjs');
var passport= require('passport');
var {ensureAuthenticated}= require('../config/Auth');

mongoose.connect('mongodb://protap:protap1@ds129085.mlab.com:29085/authentication', 
    {useNewUrlParser: true },function(err){
    {
        if(err) {
            console.log('Some problem with the connection ' +err);
        } else {
            console.log('The Mongoose connection is ready');
        }
    }});
//mongoose.connect('mongodb://jacky:Jacky1@1297>@ds213705.mlab.com:13705/todo') 
var User= require('../model/User.js');

var urlencodedParser = bodyParser.urlencoded({ extended: false });







module.exports= function(app)
{

  app.get('/', function(req,res)
	{
      
        res.render('registration');
      
	});

  app.get('/registration', function(req,res)
	{
      
        res.render('registration');
      
	});

	/*  app.post('/registration',urlencodedParser, function(req,res)
	{
      
       var newUser= User(req.body).save(function(err,data){

       	if (err) throw err;
       	console.log('data saved!');
       	res.render('registration');

       });
      
	});
	*/

	 app.post('/registration',urlencodedParser, function(req,res)
	{
      
       var {name,email,country,password,password2} =req.body;

       var errors=[];

       if(!name || !email || !country || !password || !password2)
       {
       	 errors.push({msg:"Please fill in all fields!"});
       }

       if(password!==password2)
       {
       	 errors.push({msg:'Password does not match!'});
       }

       if(password.length<6)
       {
         errors.push({msg:'Password should be at least 6 characters!'});	
       }
       

       if(errors.length>0)
       {

       	 res.render('registration',{errors});
       }

       else
       {

         User.findOne({email:email},function(err,user){
        if(user)
        {
          errors.push({msg:'Email already exists!'});
          res.render('registration',{errors})
        }

        else
        {

            var newUser= User({name,email,country,password});

       //hash password
       bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.password,salt,function(err,hash)
        {
           if (err) throw err;
           //set password hash
           newUser.password=hash;
           newUser.save(function(err,data){

            if (err) throw err;
           req.flash('success_msg','you are now registered! log in now!');
           res.redirect('login');
           });

        });


       });

        }
        
       });
        
        }
       	/*var newUser= User({name,email,country,password}).save(function(err,data){

       	if (err) throw err;
           req.flash('success_msg','you are now registered! log in now!');
           res.redirect('login');
           
       });*/   
	});



  app.get('/login',function(req,res)
   {
    res.render('login');
   });


	app.post('/login',urlencodedParser, function(req,res,next)
	{
      
        passport.authenticate('local',{

          successRedirect: '/dasboard',
           failureRedirect: '/login',
           badRequestMessage: 'Fields can not be empty',
           failureFlash: true
        })(req,res,next);
      
	});
  
   app.get('/dasboard', ensureAuthenticated, function(req,res){

      res.render('dasboard',{user:req.user});
   });


  app.get('/logout', function(req,res){
    
    req.logout();
    req.flash('success_msg','You are now logged out');
    res.redirect('login');
  });

   
}