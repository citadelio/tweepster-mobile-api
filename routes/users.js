const router = require('express').Router();
const protectedRoute = require("../middleware/auth");
const isRequestFromMobile = require("../middleware/mobilecheck");


// Models
const UserModel = require('../models/User');
const { twitterConfig } = require('../middleware/helperFunctions');

router.get('/detail', protectedRoute, async(req, res)=>{
    try{
        const user = await UserModel.findOne({_id:req.userid})
        if(!user){
            return res.json({
                errors: [
                  {
                    msg: "User not found",
                  }
                ]
              });
        }
        //configure twitter client
        // const client = new Twitter({
        //   consumer_key: process.env.TAPP_IPHONE_KEY, 
        //   consumer_secret: process.env.TAPP_IPHONE_SECRET,
        //   access_token_key: user.authtoken, 
        //   access_token_secret: user.authsecret
        // })
        const client = twitterConfig(user.authtoken, user.authsecret)
        // get user details from twitter
       const twitterUser =  await client.get("account/verify_credentials");
        return res.json({user: twitterUser, status:true})
    }
    catch(err){
      return res.json({
        errors: [
          {
            msg: "An error occurred, try again",
            err
          }
        ]
      });
    }
});

module.exports = router;