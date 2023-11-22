const a = [{age: 13, name: "An"}, {age: 13, name: "An"}, {age: 13, name: "An"}, {age: 13, name: "An"}, {
    age: 13,
    name: "An"
}];
const sum = a.reduce((total, item) => total + item.age, 0)
console.log(sum)