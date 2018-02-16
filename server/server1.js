var express=require('express');
var app=express();
var bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var {User}=require('./app1.js');
const bcrypt=require('bcryptjs');



app.post('/register',(req,res)=> {
  User.sync({force:true}).then(() => {
  var email= req.body.email;
  var password=req.body.password;
    bcrypt.genSalt(10, (err,salt)=> {
      bcrypt.hash(password,salt,(err,hash)=> {
        password=hash;
        console.log('password is' ,password);

  var user=({
          email:email,
          password:password
        });
  User.create(user).then((user)=> {
      res.send(user);
      //return User.generateAuthToken(user.id).then((token)=> {
        //res.header('x-auth',token).send(user);
  }).catch((err)=> {
      res.status(400).send();
    });
  });

});
});
});
app.listen('3000',()=> {
  console.log('server is up on port 3000');
});
