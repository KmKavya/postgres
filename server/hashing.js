const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

var password='123abc!';

bcrypt.genSalt(10, (err,salt)=> {
  bcrypt.hash(password,salt,(err,hash)=> {
    console.log(hash);
  });
});
 var hashedPass='$2a$10$0fuw8rDKiqL5pRzXnoH0KOcpCVDAeAdzob784QdhvL4SMmO9hM1/O';

 bcrypt.compare(password,hashedPass,(err,res)=> {
   console.log(res);
 });
