function convertCurrencyToNumber(currency) {
    if (typeof currency !== 'string') {
        console.error('Invalid input. Expected a string.');
        return null;
    }
    const numberValue = parseFloat(currency.replace(/,/g, ''));
    return isNaN(numberValue) ? 0 : numberValue;
}

console.log(convertCurrencyToNumber("23,000"))