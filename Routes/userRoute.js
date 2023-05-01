const express=require("express")
const router = express.Router()
const { register, verifyEmail, resendVerification, getAllUsers, forgetPassword, resetPassword, getUserById, updateUserDetail, signIn, signOut } = require("../Controller/userController")
const { userCheck, validate } = require("../Validator")

router.post("/register",userCheck,validate, register)
router.get('/verifyemail/:token',verifyEmail)
router.post("/resendverification",resendVerification)
router.get("/getallusers",getAllUsers)
router.post("/forgetpassword",forgetPassword)
router.post("/resetpassword/:token",resetPassword)
router.get("/getbyuserid/:id",getUserById)
router.put("/updateuserdetails/:id",updateUserDetail)
router.post("/signin",signIn)
router.get("/signout",signOut)

module.exports=router