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




module.exports = {
  prettyCurrency,
  makeTitleCase, 
}