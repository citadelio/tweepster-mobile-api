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
  
  const getKeys = label => {
    let keys = {};
    if(label === "default" || label === "iphone"){
        keys = { key:process.env.TAPP_IPHONE_KEY, secret:process.env.TAPP_IPHONE_SECRET}
      }else if(label === "samsung"){
        keys = { key:process.env.TAPP_S10_KEY, secret:process.env.TAPP_S10_SECRET}
      }else if(label === "tweepster"){
        keys = { key:process.env.TAPP_TWEEPSTER_KEY, secret:process.env.TAPP_TWEEPSTER_SECRET}
      }else if(label === "zapp"){
        keys = { key:process.env.TAPP_ZAPP_KEY, secret:process.env.TAPP_ZAPP_SECRET}
      }
      return keys;

  }
  const twitterConfig = (authtoken, authsecret, subdomain = 'api', label = 'default') => {
    let keys = getKeys(label);
     //configure twitter client
     return new Twitter({
      subdomain,
      consumer_key: keys.key, 
      consumer_secret: keys.secret,
      access_token_key: authtoken, 
      access_token_secret: authsecret
    })
  }




module.exports = {
  prettyCurrency,
  makeTitleCase, 
  twitterConfig,
  getKeys
}