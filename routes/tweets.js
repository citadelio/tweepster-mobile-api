const router = require('express').Router();
const isRequestFromMobile = require("../middleware/mobilecheck");
const { twitterConfig } = require('../middleware/helperFunctions');
const protectedRoute = require("../middleware/auth");
const fs = require('fs')
const path = require('path')
const fileUpload = require('../middleware/fileupload');

// Models
const UserModel = require('../models/User');
const { route } = require('./auth');
const labels = require('../middleware/labels');
/* MOBILE APP AUTH */
router.get('/get-timeline-tweets/:id/:label',protectedRoute, isRequestFromMobile, async (req, res) => {
  let lastId = req.params.id,
      label = req.params.label;
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
    const client = twitterConfig(user.authtoken, user.authsecret,"api",label)
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

router.get('/get-user-tweets/:id/:last/:label',protectedRoute, isRequestFromMobile, async (req, res) => {
  let user_id = req.params.id,
      lastId = req.params.last,
      label = req.params.label;
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
    const client = twitterConfig(user.authtoken, user.authsecret, "api", label)
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

router.get('/single-tweet/:id/:label', protectedRoute, isRequestFromMobile, async (req, res) => {
  let tweetId = req.params.id;
  let label = req.params.label;
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
    const client = twitterConfig(user.authtoken, user.authsecret, "api", label)
   
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

router.post('/postTweetWithImage',protectedRoute, isRequestFromMobile,  async (req, res) => {
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

     //upload image
     fileUpload(req, res, async(err) => { 
       
      if(err){
        console.log(err)
          return res.json({
              errors: [
                {
                  msg: "Image could not be uploaded, try again",
                  err
                }
              ]
            });
          }
          
      if(req.files === undefined || req.files.length < 0){
          return res.json({
              errors: [
                {
                  msg: "You haven't uploaded any image, try again",
                  err
                }
              ]
            });
          }

      const {tweetText, screen_name,id_str, label} = req.body        
      const uploadClient = twitterConfig(user.authtoken, user.authsecret, "upload", label)
      const client = twitterConfig(user.authtoken, user.authsecret, "api", label)
      let stringArray = []
      req.files.map(async singleFile=>{

        let tweetImage = await fs.readFileSync(path.join(__dirname, `../${singleFile.path}`));
      let base64Image = await Buffer.from(tweetImage).toString('base64');

    
        let mediaResponse = await uploadClient.post('media/upload', {
          media_data: base64Image,
        })

        stringArray.push(mediaResponse.media_id_string);
        console.log(stringArray)
        fs.unlinkSync(singleFile.path)

        if(stringArray.length === req.files.length){
          let payload = 
          screen_name && id_str ?{
            // status:tweetText.concat(` @${screen_name}`),
            status:(`@${screen_name} `).concat(tweetText),
            in_reply_to_status_id:id_str,
            media_ids: stringArray.join()
          } : 
          {
            status: tweetText,
            media_ids: stringArray.join()
          }
          let response = await client.post(`statuses/update`,payload)
          return res.json(response)    
        }
      })
  })
  }
  catch(err){
    console.log(err)
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

router.post('/postTweet',protectedRoute, isRequestFromMobile,  async (req, res) => {
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

    const {tweetText, screen_name,id_str, label} = req.body        
    const client = twitterConfig(user.authtoken, user.authsecret, "api", label)

        let payload = 
        screen_name && id_str ?{
          // status:tweetText.concat(` @${screen_name}`),
          status:(`@${screen_name} `).concat(tweetText),
          in_reply_to_status_id:id_str,
        } : 
        {
          status: tweetText,
        }
        let response = await client.post(`statuses/update`,payload)
        return res.json(response)    
  }
  catch(err){
    console.log(err)
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


router.post('/likeTweet',protectedRoute, isRequestFromMobile,  async (req, res) => {
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

    const {id, label} = req.body    
    const client = twitterConfig(user.authtoken, user.authsecret, "api", label)
        let response = await client.post(`favorites/create`,{
          id
        })
        return res.json(response)    
  }
  catch(err){
    console.log(err)
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

router.get('/serverlabels', (req, res)=>{
  console.log("innnn")
    return res.json(labels);
})

module.exports = router;