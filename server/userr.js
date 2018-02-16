 const sequelize=require('sequelize');
 var User;
function createDB(){
  User=sequelize.define('user', {
   email:{
     type:sequelize.STRING,
     required:true
   },
   password:{
     type:sequelize.STRING,
     required:true
   }
 });
 return User;
}

 module.exports={User};
