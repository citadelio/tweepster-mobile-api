const router = require('express').Router();
const protectedRoute = require("../middleware/auth");
const isRequestFromMobile = require("../middleware/mobilecheck");


// Models
const UserModel = require('../models/User');
const { twitterConfig } = require('../middleware/helperFunctions');

router.get('/detail', protectedRoute, isRequestFromMobile,  async(req, res)=>{
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

router.get('/fetch-friends/:count',protectedRoute, isRequestFromMobile,  async(req, res)=>{
    try{
      let cursor = req.params.count;
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
      
      
      const client = twitterConfig(user.authtoken, user.authsecret)
      // const client = twitterConfig("586786732-K9o4MwJp8IyWA8GEqcOSBd75QTmRFrO1HPYs7pB4", "a5nLNe58c0bixr87EMI7x99AOIDGK67GpJs3LhnPX512c")
      // get user details from twitter
       const friends =  await client.get("friends/list",{cursor});
        return res.json(friends)
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