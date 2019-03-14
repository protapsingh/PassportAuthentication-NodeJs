
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bcrypt= require('bcryptjs');
var User= require('../model/User.js');

module.exports= function(passport)
{
   passport.use(new LocalStrategy( { usernameField: 'email'},function(email,password,done){
      
      User.findOne({email:email},function(err,user){

      	if (err) {return done(err);}
        
         if(!user)
         {
         	
         	return done(null,false,{message:'This email is not regisgterd!'});
         }
         //match password

         bcrypt.compare(password,user.password, function(err,isMatch){

         	if (err) throw err;

         	if(isMatch)
         	{
         		
              return done(null,user);
         	}
           else
           {
           	
           	 return done(null, false,{message:'Incorret password!'})
           }

         });


      });

   	})

   	);

    passport.serializeUser(function(user,done){
     
     done(null,user.id);


    });

    passport.deserializeUser(function(id,done){
     
     User.findById(id, function(err,user){

     	done(err,user);
     });
     

    });

}