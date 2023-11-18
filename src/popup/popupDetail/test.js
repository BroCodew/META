const stringValue = "20,487,46.00";

// Loại bỏ dấu ","
const cleanedValue = stringValue.replace(/,/g, '');

// Chuyển đổi thành số
const numericValue = parseFloat(cleanedValue);

console.log(numericValue); 