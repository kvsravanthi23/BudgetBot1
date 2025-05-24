// Example exchange rate, this should be fetched from an API for real-time conversion
  // Example rate (1 USD = 83 INR)

export function currencyFormatter(value) {
    const valueInINR = value ;  // Convert USD to INR
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(valueInINR);
}
