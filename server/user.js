// const mongoose=require('mongoose');
// const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const bcrypt=require('bcryptjs');
const sequelize=require('sequelize');

var pg = require('pg');
var conString = "postgres://localhost:5432/MyDatabase";

var client = new pg.Client(conString);
client.connect();
const query = client.query(
  'CREATE TABLE Users(_id SERIAL PRIMARY KEY, email VARCHAR(40) not null, password VARCHAR(12) not null)');
query.on('end', () => { client.end(); });


var User=sequelize.define('User',{
  email:{
    type: sequelize.STRING,
    allowNull: false
  },
  password:{
    type: sequelize.STRING,
    allowNull: false
  },
tokens:[{
  access:{
    type: sequelize.STRING,
    allowNull: false
  },
  token:{
    type: sequelize.STRING,
    allowNull: false
  }
}]
});
const query = client.query(
  'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
  query.on('end', () => { client.end(); });


User.methods.toJSON= function () {
  var user=this;
  var userObject=user.toObject();

   return _.pick(userObject,['_id','email']);
 }

User.methods.generateAuthToken= function () {
  var user=this;
  var access='auth';
  var token=jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
  user.tokens.push({access,token});
  return user.save().then(()=> {
    return token;
  });
};

User.methods.removeToken=function(token) {
  var user=this;
  return user.update({
    $pull:{
      tokens:{token}
    }
  });
};

User.statics.findByToken=function(token) {
  var User=this;
  var decoded;
  try {
    decoded=jwt.verify(token,'abc123');
  } catch(e) {
    // return new Promise((resolve,reject)=> {
    //   reject();
    // });
    return Promise.reject();
  }
  return User.findOne({
    _id:decoded._id,
    'tokens.token':token,
    'tokens.access':'auth'
  });

};

User.statics.findByCredentials=function(email,password) {
  var User=this;

    return User.findOne({email}).then((user)=> {
      if(!user) {
        return Promise.reject();
      }

      return new Promise((resolve,reject)=> {
        bcrypt.compare(password,user.password,(err,res)=> {
          if(res) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    });
};

User.pre('save',function(next) {
  var user=this;

  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err,salt)=> {
      bcrypt.hash(user.password,salt,(err,hash)=> {
        user.password=hash;
        next();
      });
    });

  } else {
    next();
  }
});

var User=mongoose.model('User',UserSchema);

module.exports={User};
