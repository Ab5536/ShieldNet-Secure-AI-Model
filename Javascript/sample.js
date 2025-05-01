
let users=[{name:"Abdullah", age:12},{name:"Talha", age:14},{name:"Kamran", age:10},{name:"A", age:1},{name:"b", age:2}]

// arr.forEach(element => {

// });
let nums=[1,2,3,4,5,6];
nums=nums.map((num)=>num*5)
const newusers=users.map((user)=>user.age>10? {...user,age:user.age-5}:user)
// console.log(newusers);
console.log(nums)
