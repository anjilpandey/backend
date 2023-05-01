const express=require("express")
const { addProduct, getAllProduct, updateProduct, deleteProduct, getProductByCategory } = require("../Controller/productController")
const { requireSignin } = require("../Controller/userController")
const upload = require("../utils/fileUpload")
const { productCheck, validate } = require("../Validator")
const router=express.Router()

router.post("/addproduct",upload.single('product_image'),requireSignin,productCheck,validate,addProduct)
router.get("/getallproducts",getAllProduct)
router.get("/getproductbycategory/:category_id",getProductByCategory)
router.put("/updateproduct/:id",requireSignin,updateProduct)
router.delete("/deleteproduct/:id",requireSignin,deleteProduct)

module.exports=router