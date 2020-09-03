const router = require('express').Router();
const isRequestFromMobile = require("../middleware/mobilecheck");
const { twitterConfig } = require('../middleware/helperFunctions');
const protectedRoute = require("../middleware/auth");
// Models
const UserModel = require('../models/User');
/* MOBILE APP AUTH */
router.get('/get-timeline-tweets/:id',protectedRoute, isRequestFromMobile, async (req, res) => {
  let lastId = req.params.id
  const metadata = lastId == 1 ? {exclude_replies:true,since_id:lastId, tweet_mode:"extended"}:{exclude_replies:true,max_id:lastId, tweet_mode:"extended"}
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

router.get('/get-user-tweets/:id/:last',protectedRoute, isRequestFromMobile, async (req, res) => {
  let user_id = req.params.id
  let lastId = req.params.last
  const metadata = lastId == 1 ? {user_id, since_id:lastId, tweet_mode:"extended"}:{user_id, max_id:lastId, tweet_mode:"extended"}
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
    let tweets = await client.get("statuses/user_timeline",metadata)
    // tweets = tweets.map((a) => ({sort: Math.random(), value: a}))
    //               .sort((a, b) => a.sort - b.sort)
    //               .map((a) => a.value);
    return res.json(tweets)
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

router.get('/single-tweet/:id', protectedRoute, isRequestFromMobile, async (req, res) => {
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
   
    let tweet = await client.get(`statuses/show/${tweetId}`,{
      tweet_mode:"extended"
    })
    return res.json(tweet)
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

router.post('/post', protectedRoute, isRequestFromMobile, async (req, res) => {
  const {tweet} = req.body
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
    let tweet = await client.post(`statuses/update`,{
      status:tweet[0].text
    })
    return res.json(tweet)
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

module.exports = router;