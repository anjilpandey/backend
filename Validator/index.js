const {check, validationResult} = require("express-validator")

exports.categoryCheck = [
    check('category_name', "category name is required.").notEmpty()
    .isLength({min:3}).withMessage("category name must be atleast 3 characters.")
]

exports.validate = (req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({error : errors.array()[0].msg})
        // return res.status(400).json({error : errors.array().map(i=>i.msg)})
    }
    next()
}

exports.productCheck = [
    check('product_name',"product name is required.").notEmpty()
    .isLength({min:3}).withMessage("Product name must be atleast 3 characters."),

    check("product_price","product price is required.").notEmpty()
    .isNumeric().withMessage("Price must be a number."),

    check("product_description","Product Description is required.").notEmpty()
    .isLength({min:20}).withMessage("Product Description should be atleast 20 characters."),

    check("category","Category is required.").notEmpty(),

    check("count_in_stock","Count in stock is required.").notEmpty()
    .isNumeric().withMessage("count must be a number.")

]

exports.userCheck=[
    check("username","username is required.").notEmpty()
    .isLength({min:3}).withMessage("Username must be atleast 3 characters."),

    check("email","Email is required.").notEmpty()
    .isEmail().withMessage("Email format incorrect."),

    check("password","Password is required").notEmpty()
    .isLength({min:8}).withMessage("Password must be atleast 8 characters.")
    .not().isIn(['asdf1234',/password/i,'qwer1234','12345678']).withMessage("Normal password has less security.")
    .matches(/[a-z]/).withMessage("Password must contain atleast one lowercase character")
    .matches(/[A-Z]/).withMessage("Password must contain atleast one uppercase character")
    .matches(/[0-9]/).withMessage("Password must contain atleast one numeric character")
    .matches(/[-_+@#$%^&]/).withMessage("Password must contain atleast one special character")
    .not().matches(/[\\;.,]/).withMessage("\ ; . and , are not allowed in password")
    
]