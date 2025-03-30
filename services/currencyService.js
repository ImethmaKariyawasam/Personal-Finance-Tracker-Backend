// services/currencyService.js
const axios = require('axios');

const convertCurrency = async (amount, from, to) => {
  try {
    const response = await axios.get(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
    
    if (!response.data || !response.data.rates || !response.data.rates[to]) {
      throw new Error(`Invalid API response: ${JSON.stringify(response.data)}`);
    }

    const rate = response.data.rates[to];
    return amount * rate;
  } catch (err) {
    console.error('Currency conversion failed:', err.message);
    throw new Error('Failed to convert currency. Please try again later.');
  }
};

module.exports = { convertCurrency };