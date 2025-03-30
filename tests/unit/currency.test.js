// tests/currency.test.js
const { convertCurrency } = require('../../services/currencyService');

describe('Currency Conversion Test', () => {
  it('should convert EUR to USD', async () => {
    const amount = 100;
    const from = 'EUR';
    const to = 'USD';
    const convertedAmount = await convertCurrency(amount, from, to);
    console.log(`Converted ${amount} ${from} to ${convertedAmount} ${to}`);
    expect(convertedAmount).toBeGreaterThan(0);
  });
});