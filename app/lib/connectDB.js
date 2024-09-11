import mongoose from "mongoose";



export function connectDB(){

try{
    mongoose.connect("mongodb://localhost:27017/expensiveDB").then(function(connectiion){
        console.log(connectiion);
        console.log("db connect successfull bro");

    })
}catch(err){
console.log(err +"db not connectd some error")
}
    
}