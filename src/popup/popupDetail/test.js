// // const test = [
// //   {
// //     name: "HAI",
// //     age: 21,
// //     stt: "9",
// //   },
// //   {
// //     name: "NAM",
// //     age: 20,
// //     stt: "3",
// //   },
// //   {
// //     name: "An",
// //     age: 20,
// //     stt: "NaN",
// //   },
// //   {
// //     name: "Binh",
// //     age: 21,
// //     stt: "5",
// //   },
// // ];

// // const sortTest = test.map((item) => parseFloat(item.stt.replace("NaN", "0")));
// // console.log(sortTest.sort((a, b) => a - b));

// const test = [
//   {
//     name: "HAI",
//     age: 21,
//     stt: "9",
//   },
//   {
//     name: "NAM",
//     age: 20,
//     stt: "3",
//   },
//   {
//     name: "An",
//     age: 20,
//     stt: "NaN",
//   },
//   {
//     name: "Binh",
//     age: 21,
//     stt: "5",
//   },
// ];

// const sortTest = test
//   .map((item) => ({
//     ...item,
//     stt: parseFloat(item.stt.replace("NaN", "0")),
//   }))
//   .sort((a, b) => a.stt - b.stt);

// console.log(sortTest);

//   const sortedTest = [...test].sort((a, b) => {
//     const sttA = parseFloat(a.stt.replace("NaN", "0"));
//     const sttB = parseFloat(b.stt.replace("NaN", "0"));
//     return sttA - sttB;
//   });

// console.log(sortedTest);

const inputArray = [2500000, 816.9, NaN, 500000, 816.9, 200.0, NaN, 1.98];

const a = inputArray
  .map((item) => (isNaN(item) ? 0 : item))
  .sort((a, b) => a - b);
console.log(a);
// // Chuyển đổi chuỗi thành số, giữ NaN ở cuối
// const convertToNumber = (str) => {
//   if (str === "NaN") {
//     return NaN;
//   } else {
//     return parseFloat(str.replace(/[^0-9.-]+/g, ""));
//   }
// };

// const sortedArray = [...inputArray].sort((a, b) => {
//   const numA = convertToNumber(a);
//   const numB = convertToNumber(b);

//   if (isNaN(numA) && isNaN(numB)) {
//     return 0;
//   } else if (isNaN(numA)) {
//     return 1;
//   } else if (isNaN(numB)) {
//     return -1;
//   } else {
//     return numA - numB;
//   }
// });

// console.log(sortedArray);
["25,000.00","816.90", "90,000.00","90,000.00","5,000.00","816.90","200.00","NaN","1.98"]