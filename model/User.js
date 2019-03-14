var mongoose = require('mongoose');
 

 	var userSchema= new mongoose.Schema({

 		name:{

 			type: String
 		},
 		email:{

 			type: String
 		},

 		country:{

 			type: String
 		},
 		password:{

 			type: String
 		}

 	});

 	var User=mongoose.model('user',userSchema);
 	module.exports=User;