const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require("path")
const fs = require('fs');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express();


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