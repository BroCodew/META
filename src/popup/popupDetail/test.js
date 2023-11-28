function formatNumber(number) {
    const formattedNumber = number.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        useGrouping: true,
    });

    // Sử dụng regex để loại bỏ số 0 sau dấu thập phân
    return formattedNumber.replace(/\.0$/, '');
}

const result = formatNumber(20000000.0);
console.log(result); // Kết quả: "20,000,000"
