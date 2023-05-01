const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema

const productSchema= new mongoose.Schema({
    product_name:{
        type: String,
        required:true,
        trim:true 
    },
    product_price:{
        type:Number,
        required:true
    },
    product_description:{
        type:String,
        required:true
    },
    product_image:{
        type:String,
        required:true
    },
    count_in_stock:{
        type:Number,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        default:1
    },
    category:{
        type:ObjectId,
        ref:"Category",
        required:true
    }

},
{
    timestamps:true
})

module.exports=mongoose.model("Product",productSchema)