const Twitter = require('twitter-lite');
  
  const prettyCurrency = amount => {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2
    });
    const convertedAmount = formatter.format(amount);
    return convertedAmount;
  }

 const  makeTitleCase = str => {
    return str
      .toLowerCase()
      .split(" ")
      .map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }
  
  const twitterConfig = (authtoken, authsecret) => {
     //configure twitter client
     return new Twitter({
      consumer_key: process.env.TAPP_IPHONE_KEY, 
      consumer_secret: process.env.TAPP_IPHONE_SECRET,
      access_token_key: authtoken, 
      access_token_secret: authsecret
    })
  }




module.exports = {
  prettyCurrency,
  makeTitleCase, 
  twitterConfig
}