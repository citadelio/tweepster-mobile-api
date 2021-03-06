const router = require('express').Router();
const protectedRoute = require("../middleware/auth");
const isRequestFromMobile = require("../middleware/mobilecheck");


// Models
const UserModel = require('../models/User');
const { twitterConfig, getKeys } = require('../middleware/helperFunctions');

router.get('/detail/:label', protectedRoute, isRequestFromMobile,  async(req, res)=>{
    try{
      const {label} = req.params
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
       
        
        const client = twitterConfig(user.authtoken, user.authsecret, "api", label)
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

router.get('/fetch-friends/:count/:label',protectedRoute, isRequestFromMobile,  async(req, res)=>{
// router.get('/fetch-friends/:count',  async(req, res)=>{
    try{
      let cursor = req.params.count
          label = req.params.label;
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
      
      
      const client = twitterConfig(user.authtoken, user.authsecret, "api", label)
      // const client = twitterConfig("586786732-K9o4MwJp8IyWA8GEqcOSBd75QTmRFrO1HPYs7pB4", "a5nLNe58c0bixr87EMI7x99AOIDGK67GpJs3LhnPX512c")
      // get user details from twitter
       const friendIds =  await client.get("friends/ids",{cursor, count:50});
        
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

router.get('/fetch-followers/:count/:label',protectedRoute, isRequestFromMobile,  async(req, res)=>{
    try{
      let cursor = req.params.count,
          label = req.params.label;
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
      
      
      const client = twitterConfig(user.authtoken, user.authsecret, "api", label)
      // const client = twitterConfig("586786732-K9o4MwJp8IyWA8GEqcOSBd75QTmRFrO1HPYs7pB4", "a5nLNe58c0bixr87EMI7x99AOIDGK67GpJs3LhnPX512c")
      // get user details from twitter
       const followersIds =  await client.get("followers/ids",{cursor, count:50});
        
       const followersList =  await client.get("friendships/lookup",{user_id:followersIds.ids.join()});
       return res.json({
         followers:followersList,
         previous : followersIds.previous_cursor_str,
         next : followersIds.next_cursor_str
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

router.get('/user-details/:id/:label',protectedRoute, isRequestFromMobile,  async(req, res)=>{
      try{
        let user_id = req.params.id,
            label = req.params.label;
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
        const client = twitterConfig(user.authtoken, user.authsecret, "api", label)
        const userDetails =  await client.get("users/show",{user_id, include_entities:false});
        return res.json(userDetails)
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
    })


router.post('/friend-create',protectedRoute, isRequestFromMobile,  async(req, res)=>{
// router.post('/friend-create',  async(req, res)=>{
  try{
    let user_id = req.body.id,
        label = req.body.label;
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
    const client = twitterConfig(user.authtoken, user.authsecret, "api", label)
      // const client = twitterConfig("586786732-K9o4MwJp8IyWA8GEqcOSBd75QTmRFrO1HPYs7pB4", "a5nLNe58c0bixr87EMI7x99AOIDGK67GpJs3LhnPX512c")
    const response =  await client.post("friendships/create",{user_id});
    return res.json(response);

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
})

router.post('/friend-destroy',protectedRoute, isRequestFromMobile,  async(req, res)=>{
  try{
    let user_id = req.body.id,
        label = req.body.label;
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
    const client = twitterConfig(user.authtoken, user.authsecret, "api", label)
      // const client = twitterConfig("586786732-K9o4MwJp8IyWA8GEqcOSBd75QTmRFrO1HPYs7pB4", "a5nLNe58c0bixr87EMI7x99AOIDGK67GpJs3LhnPX512c")
    const response =  await client.post("friendships/destroy",{user_id});
    return res.json(response);

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
})

router.post('/getkeys', isRequestFromMobile, async (req, res)=>{
    try{
      const {label} = req.body
      let keys = await getKeys(label);
      return res.json(keys);
    }catch(err){
      return res.json({
        errors: [
          {
            msg: "An error occurred, try again",
            err
          }
        ]
      });
    }
})
module.exports = router;