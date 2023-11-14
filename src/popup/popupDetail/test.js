const a = [{id: 1, name: "2"}, {id: 2, name: "2"}, {id: 3, name: "2"}, {id: 1, name: "4"}];
const accounID = 1;
const findId = a.filter(item => item.id === accounID);
console.log('findId', findId)
//
// const includeAccountID = a.map(item => item.includes(accounID));
// console.log('includeAccountID', includeAccountID)