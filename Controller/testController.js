const { request, response } = require("express")

exports.testFunction=(request,response)=>{
    response.send("Hello World!!!")
}

exports.secondFuntion=(request,response)=>{
    response.send("Hello second world")
}