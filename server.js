const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require("path")
const fs = require('fs');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express();
const { twitterConfig } = require('./middleware/helperFunctions');


//MODELS

if (process.env.NODE_ENV === "production") {
    app.use(express.static("build"));
  }
  
//connect to DB
mongoose.connect(process.env.dbConnectCloud, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(()=>console.log('Connected to Database'))
.catch(err=>console.log(err))


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/tweets', require('./routes/tweets'));
app.get('/download-video/:id', async(req, res)=>{
  try{
    console.log("here")
    let tweetId = req.params.id;
    console.log(tweetId)
    const client = twitterConfig("586786732-K9o4MwJp8IyWA8GEqcOSBd75QTmRFrO1HPYs7pB4", "a5nLNe58c0bixr87EMI7x99AOIDGK67GpJs3LhnPX512c", "api", "iphone")
   
    let tweet = await client.get(`statuses/show/${tweetId}`,{
      tweet_mode:"extended"
    })
    console.log(tweet)
    if(tweet && tweet.extended_entities){
      console.log(tweet.extended_entities.media.video_info.variants[1].url)
        res.download(tweet.extended_entities.media.video_info.variants[1].url)
    }
  }catch(err){

  }
})
app.get('/', (req, res)=>{
  res.json({
    msg:`Welcome to ${process.env.SITE_NAME}. Download the app on the Google Playstore and Apple Appstore`
  })
//   res.sendFile('index.html')
})

//handle every other request
app.get('/*', (req, res)=> {
    // res.json([{"error":"invalid request"}])
    res.json({
      errors: [{ msg: "invalid token" }]
    });
  })

app.listen(process.env.PORT || 5000, ()=>{ console.log(`Server started on port ${process.env.PORT || 5000}`)})