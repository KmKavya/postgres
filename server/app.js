// get dependencies
var express=require('express');
var app = express();
var bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const path=require('path');
const models=path.join(__dirname,'../models');
app.use(express.static(models));

// handle request and response
var pg = require('pg');
const sequelize=require('sequelize');

const {User}=require('./userr.js');


// sequelize initialization
var client = new pg.Client("postgres://root1:root1@192.168.1.115:5000/root1");

client.connect().then((err) => {
  if(err){
    console.log(err);
  }
  console.log('Connection has been established successfully.');

  app.post('/register', (req,res)=> {
    console.log(req);
    var user= db.User.create({
      email:req.body.email,
      password:req.body.password
    });
    user.save().then((err,res)=> {
      if(err) {
        console.log(err);
      }
      console.log(res);
    });
    res.send(user);
  });
//  client.query("CREATE TABLE IF NOT EXISTS kavya (email VARCHAR(40),password VARCHAR(40)");
  //  client.query("INSERT INTO kavya VALUES ($1,$2)",[req.body.email,req.body.password]
  // ,(err,result)=> {
  //   if(err) {
  //     console.log(err);
  //     res.status(400).send();
  //   }
  //   res.status(200).send();
  //   });
});

app.listen('3000',()=> {
  console.log('server is up on port 3000');
});
