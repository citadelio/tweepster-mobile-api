const router = require('express').Router();
const jwt = require('jsonwebtoken');
const isRequestFromMobile = require("../middleware/mobilecheck");

// Models
const UserModel = require('../models/User')
/* MOBILE APP AUTH */
router.post('/mobile', isRequestFromMobile, async (req, res) => {
  try{
    const colorsArray = ['1da1f2','673AB7','009688','8BC34A','795548','FF9800','ad04bf']
    const randonumber = Math.floor(Math.random() * colorsArray.length)
    let randomColor = colorsArray[randonumber]
      const {name, email,userID, userName, authToken, authTokenSecret} = req.body
     
      //check if id exist
      let user = await UserModel.findOne({userid:userID});
      if(!user){
          //create a new user record
          user = new UserModel({
              name,
              email,
              userid:userID,
              authtoken: authToken,
                authsecret: authTokenSecret
          }) 
          console.log(user)
          await user.save();
      }
      //generate token using jwt
      const token = jwt.sign({userid: user.id}, process.env.jwtSecret, {
        expiresIn : 42000
      })
       return res
       .status(200)
       .json({ token, statuscode: "S1" });
  }catch(err){
      return res.status(401).json({
        errors: [{ msg: "invalid token" }]
      });
  }
})


module.exports = router;