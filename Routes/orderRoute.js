const express = require("express")
const { placeOrder, getAllOrders, getOrderDetails, getOrderOfUser, updateOrder, deleteorder } = require("../Controller/orderController")
const router = express.Router()

router.post("/placeorder",placeOrder)
router.get("/getallorders",getAllOrders)
router.get("/orderdetails/:id",getOrderDetails)
router.get("/getuserorders/:userid",getOrderOfUser)
router.put("/updateorder/:orderid",updateOrder)
router.delete("/deleteorder/:orderid",deleteorder)

module.exports = router