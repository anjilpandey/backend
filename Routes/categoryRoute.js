const express = require("express")
const { addCategory, getAllCategories, categoryDetails, updateCategory, deleteCategory } = require("../Controller/categoryController")
const { requireSignin } = require("../Controller/userController")
const { categoryCheck, validate } = require("../Validator")
const router = express.Router()

router.post("/addcategory",requireSignin,categoryCheck,validate,addCategory)
router.get("/getallcategories", getAllCategories)
router.get("/categorydetails/:id",categoryDetails)
router.put("/updatecategory/:id",requireSignin,updateCategory)
router.delete("/deletecategory/:id",requireSignin,deleteCategory)

module.exports=router