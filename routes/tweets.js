const router = require('express').Router();
const isRequestFromMobile = require("../middleware/mobilecheck");
const { twitterConfig } = require('../middleware/helperFunctions');
const protectedRoute = require("../middleware/auth");
// Models
const UserModel = require('../models/User');
/* MOBILE APP AUTH */
router.get('/get-timeline-tweets/:id',protectedRoute, isRequestFromMobile, async (req, res) => {
  let lastId = req.params.id
  const metadata = lastId == 1 ? {exclude_replies:true,count:30,since_id:lastId}:{exclude_replies:true,count:30,max_id:lastId}
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
    const tweets = await client.get("statuses/home_timeline",metadata)
    return res.json(tweets)
  }catch(err){
     
  }
})


module.exports = router;