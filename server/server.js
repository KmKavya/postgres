
const _=require('lodash');
const express=require('express');
var app=express();

const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//var {User}=require('./user');
// const {SHA256}=require('crypto-js');
// const jwt=require('jsonwebtoken');
//
// var {authenticate}=require('./middleware/authenticate');
// var {loginauth}=require('./middleware/loginauth');

var pg = require('pg');
var conString = "postgres://localhost:3000/MyDatabase";
var client = new pg.Client(conString);

app.get('/', function (req, res, next) {
  client.connect();
  var query = client.query(
    'CREATE TABLE Users(_id SERIAL PRIMARY KEY, email VARCHAR(40) not null, password VARCHAR(12) not null)');
  query.on('end', () => { client.end(); });

});

mongoose.connect('mongodb://localhost:27017/Users',(err,db)=> {
  if(err){
    console.log('Failed to connect');
  }
  console.log('connected to mongodb');
  //db.close();
});


app.get('/users',(req,res)=> {
  res.sendFile('/home/kavyak/Documents/BaseConsole/User/login.html');
});

app.post('/register',(req,res)=> {
  var body=_.pick(req.body,['email','password']);
  var user=new User(body);
  user.save().then(()=> {
   return user.generateAuthToken()
  }).then((token)=> {
    res.header('x-auth',token).send(user);

  }).catch((e)=> {
    res.status(400).send(e);
  });
});

app.post('/login', (req,res) => {
  var body=_.pick(req.body,['email','password']);
  User.findByCredentials(body.email,body.password).then((user)=> {
  return user.generateAuthToken().then((token)=> {
  res.header('x-auth',token).send(user);
});
  }).catch((e)=> {
    res.status(400).send();
  });
});

app.get('/getUsers',loginauth,(req,res)=> {
  User.find().then((docs)=> {
    var mailarray=[];
    var myArray=docs;
    myArray.forEach(function(value){
      mailarray.push(value.email);
});
res.send(mailarray);
},()=> {
  res.status(401).send();
});

});

app.delete('/logout',authenticate,(req,res)=> {
  req.user.removeToken(req.token).then(()=> {
    res.status(200).send();
  },()=> {
    res.status(400).send();
  });
});

app.listen('3000',()=> {
  console.log('server is up on port 3000');
});
