function sortBooleanArray(booleanArray) {
    // Sắp xếp mảng boolean
    booleanArray.sort((a, b) => {
        // Đặt giá trị true trước giá trị false
        if (a === b) {
            return 0;
        } else if (a) {
            return -1;
        } else {
            return 1;
        }
    });

    return booleanArray;
}

// Sử dụng hàm
var unsortedArray = [true, false, true, false, true];
var sortedArray = sortBooleanArray(unsortedArray);

console.log(sortedArray);





