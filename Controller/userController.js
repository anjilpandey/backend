const User = require("../Model/userModel")
const Token = require("../Model/tokenModel")
const crypto = require("crypto")
const sendEmail = require("../utils/setEmail")
const jwt = require("jsonwebtoken")
const {expressjwt} = require("express-jwt")

// register new User

exports.register = async (req, res) => {
    // destructing
    const { username, password, email } = req.body
    // check if email is registered

    // right side email is req.body.email
    const user = await User.findOne({ email: email })
    if (user) {
        return res.status(400).json({ error: "Email already registered" })
    }
    // add user to database 
    let newUser = new User({
        username: username,
        email: email,
        password: password
    })
    newUser = await newUser.save()
    if (!newUser) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    // generate token
    let token = new Token({
        token: crypto.randomBytes(24).toString("hex"),
        user: newUser._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    // send token to email
    const url = `http://localhost:5000/api/verifyemail/${token.token}`
    sendEmail({
        from: "noreply@gmail.com",
        to: newUser.email,
        subject: "Verification Email",
        text: `Click on the following 
        link or copy paste the link in the browser to verify your email : ${url}`,
        html: `<a href="${url}"><button>Verify Email</button></a>`
    })

    res.send(newUser)
}

// to verify user
exports.verifyEmail = async (req, res) => {
    // check token
    const token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: "Invalid token or the token may have been expired" })
    }
    // find user
    let user = await User.findById(token.user)
    if (!user) {
        return res.status(400).json({ error: "User not found" })
    }
    // check if already verified
    if (user.isVerified) {
        return res.status(400).json({ error: "User already verified. Please login to continue." })
    }
    // at last verify user
    user.isVerified = true
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: "Something went wrong." })
    }
    return res.status(200).json({ message: "User verified successfully." })
}

// to resend verification email
exports.resendVerification = async (req, res) => {
    // check if email is registered or  not
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email is not registered" })
    }
    // check if verified or  not
    if (user.isVerified) {
        return res.status(400).json({ error: "Email/User is already verified." })
    }

    // generate token
    let token = new Token({
        token: crypto.randomBytes(24).toString("hex"),
        user: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "Something went wrong." })
    }
    // send token to email
    const url = `http://localhost:5000/api/verifyemail/${token.token}`
    sendEmail({
        from: "noreply@gmail.com",
        to: user.email,
        subject: "Verification Email",
        text: `Click on the following 
        link or copy paste the link in the browser to verify your email : ${url}`,
        html: `<a href="${url}"><button>Verify Email</button></a>`
    })

    res.status(200).json({ message: "Verification email has been sent to your e-mail." })

}

// to get all users
exports.getAllUsers = async (req, res) => {
    let allUsers = await User.find()
    if (!allUsers) {
        return res.status(400).json("Something went wrong.")
    }
    res.send(allUsers)
}

// forget password
exports.forgetPassword = async (req, res) => {
    // check if email is registered or not
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email is not registered." })
    }
    // generate token
    let token = new Token({
        token: crypto.randomBytes(24).toString("hex"),
        user : user._id
    })
    token = await token.save()
    if(!token){
        return res.status(400).json({error:"Something went wrong."})
    }
    // send email
    const url = `http://localhost:5000/api/resetpassword/${token.token}`
    sendEmail({
        from:"noreply@example.com",
        to : user.email,
        subject:"Password reset email",
        text:`Click on the link to reset Password: ${url}`,
        html:`<a href=${url}><button>Reset Password</button></a>`
    })
    return res.send({message:"Password reset link has been sent to your email."})
}

// to reset Password
    exports.resetPassword=async(req,res)=>{
        // check token
        const token = await Token.findOne({token:req.params.token})
        if(!token){
            return res.status(400).json({error:"Invalid token or the link may have been expired."})
        }
        // find user
        let user = await User.findById(token.user)
        if(!user){
            return res.status(400).json({error:"Something went wrong."})
        }
        user.password= req.body.password
        user = await user.save()
        if(!user){
            return res.status(400).json({error:"Something went wrong."})
        }
        res.send({message:"Password reset successfully."})
    }

    // to get user details by id
    exports.getUserById = async(req,res)=>{
        let getUserById = await User.findById(req.params.id)
        if(!getUserById){
            return res.status(400).json({error:"User not found"})
        }
        res.send(getUserById)
    }
    // to update user details
    exports.updateUserDetail= async(req,res)=>{
        let updateUserDetail = await User.findByIdAndUpdate(req.params.id, {
            username : req.body.username,
            password  : req.body.password,
            email : req.body.email,
            isVerified : req.body.isVerified,
            role : req.body.role
        },{new:true})
        if(!updateUserDetail){
            return res.status(400).json({error:"User not found"})
        }
        res.send(updateUserDetail)
    }

    // to sign in 
    exports.signIn = async(req,res)=>{
        // check email
        let {email, password}= req.body
        let user = await User.findOne({email:email})
        if(!user){
            return res.status(400).json({error:"Email not registered."})
        }
        // check password
            if(!user.authenticate(password)){
                return res.status(400).json({error:"Email or password in incorrect."})
            }
        // check if verified
        if(!user.isVerified){
            return res.status(400).json({error:"User is not verified."})
        }
        // create sign in token
        let token = jwt.sign({user : user._id,role: user.role},process.env.JWT_SECRET)

        // set cookie
        res.cookie('myCookie', token, {expire:Date.now()+86400})
 
        // return info to frontend
        let { _id, username, role}= user
        res.send({token,user:{email,_id,username,role}})
    }

    // to signout
    exports.signOut=async(req,res)=>{
        await res.clearCookie('myCookie')
        res.send({message:"Signed out successfully."})
    }


    // for authorization
    exports.requireSignin = expressjwt({
        algorithms : ['HS256'],
        secret : process.env.JWT_SECRET
    })