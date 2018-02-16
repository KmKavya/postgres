var pg = require('pg');
const Sequelize=require('sequelize');
const sequelize = new Sequelize('postgres://root1:root1@192.168.1.115:5000/root1');
const validator=require('validator');

const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

  const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
    required:true,
    validate:{
    isEmail:{
      msg:'email invalid'
    }
   }
},
  password: {
    type: Sequelize.STRING,
    required:true
  }
});

const Token=sequelize.define('token', {
  userId: {
    type:Sequelize.STRING,
  },
  access: {
type: Sequelize.STRING,
    required:true
  },
  token: {
    type: Sequelize.STRING,
    required:true
  }
});
Token.belongsTo(User, {foreignKey: 'id'});
User.sync();



User.generateAuthToken= (id)=> {
  var result=User.findOne({
    where:{ id:id  }
  });
  console.log(result);


  access='auth';
  var token=jwt.sign({id,access},'abc123').toString();
  return User.create(user).then(()=> {
    return token;
  }).catch((err)=> {
    return err;
  });
};



module.exports={User};
