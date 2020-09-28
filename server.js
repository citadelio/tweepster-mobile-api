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

// set the view engine to ejs
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/tweets', require('./routes/tweets'));
app.get('/download-video/:id', async(req, res)=>{
  try{
    let tweetId = req.params.id;
    const client = twitterConfig("586786732-K9o4MwJp8IyWA8GEqcOSBd75QTmRFrO1HPYs7pB4", "a5nLNe58c0bixr87EMI7x99AOIDGK67GpJs3LhnPX512c", "api", "iphone")
   
    let tweet = await client.get(`statuses/show/${tweetId}`,{
      tweet_mode:"extended"
    })
    if(tweet && tweet.extended_entities){
      res.render('pages/index', { tweet });
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

app.get('/privacy-policy', (req, res)=>{
  res.render('pages/privacy');
})

//handle every other request
app.get('/*', (req, res)=> {
    // res.json([{"error":"invalid request"}])
    res.json({
      errors: [{ msg: "invalid token" }]
    });
  })

app.listen(process.env.PORT || 5000, ()=>{ console.log(`Server started on port ${process.env.PORT || 5000}`)})