export default function FormatMoney(amount) {

    if (amount == null){
      return null
    }
    // Convert the amount to a string
    let amountStr = amount.toString();
    
    // Use a regular expression to add commas
    let formattedAmount = amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // Prefix with 'shs.'
    return "shs." + formattedAmount;

  }