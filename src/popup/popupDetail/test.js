function formatNumber(number) {
    // Sử dụng hàm toLocaleString để chuyển đổi số thành định dạng ngôn ngữ
    // với dấu phân cách ngàn là ',' và dấu thập phân là '.'
    return number.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    });
}

// Sử dụng hàm formatNumber
var myNumber = 1234567.89;
var formattedNumber = formatNumber(myNumber);
console.log(formattedNumber);