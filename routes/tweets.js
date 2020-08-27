const router = require('express').Router();
const isRequestFromMobile = require("../middleware/mobilecheck");
const { twitterConfig } = require('../middleware/helperFunctions');
const protectedRoute = require("../middleware/auth");
// Models
const UserModel = require('../models/User');
/* MOBILE APP AUTH */
router.get('/get-timeline-tweets/:id',protectedRoute, isRequestFromMobile, async (req, res) => {
  let lastId = req.params.id
  const metadata = lastId == 1 ? {exclude_replies:true,since_id:lastId}:{exclude_replies:true,max_id:lastId}
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
    let tweets = await client.get("statuses/home_timeline",metadata)
    tweets = tweets.map((a) => ({sort: Math.random(), value: a}))
                  .sort((a, b) => a.sort - b.sort)
                  .map((a) => a.value);
    return res.json(tweets)
  }catch(err){
     
  }
})

router.get('/single-tweet/:id',protectedRoute, isRequestFromMobile, async (req, res) => {
  let tweetId = req.params.id
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
   
    let tweet = await client.get(`statuses/show/${tweetId}`)
    return res.json(tweet)
  }catch(err){
     
  }
})


module.exports = router;