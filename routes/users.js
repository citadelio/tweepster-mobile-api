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
// router.get('/fetch-friends/:count',  async(req, res)=>{
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
       const friendIds =  await client.get("friends/ids",{cursor, count:20});
        
       const friendList =  await client.get("friendships/lookup",{user_id:friendIds.ids.join()});
       return res.json({
         friends:friendList,
         previous : friendIds.previous_cursor_str,
         next : friendIds.next_cursor_str
       })
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