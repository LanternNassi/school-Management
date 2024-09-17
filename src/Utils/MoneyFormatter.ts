
export default function FormatMoney(amount : number) : string | null {

    if (amount == null){
      return null
    }
    // Convert the amount to a string
    let amountStr : string = amount.toString();
    
    // Use a regular expression to add commas
    let formattedAmount : string = amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // Prefix with 'shs.'
    return "shs." + formattedAmount;

  }