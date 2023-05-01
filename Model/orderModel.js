const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

const OrderSchema = new mongoose.Schema({
    orderItems:[{
        type:ObjectId,
        ref : "OrderItems",
        required : true
    }],
    user:{
        type:ObjectId,
        ref:"User",
        required:true
    },
    shipping_address:{
        type:String,
        required:true
    },
    alternate_shipping_address:{
        type:String,
    },
    city:{
        type:String,
        required:true
    },
    zipcode:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    phone_number:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"Pending",
        required:true
    },
    total_price:{
        type:Number,
        required:true
    }

},{timestamps:true})

module.exports = mongoose.model("Order",OrderSchema)