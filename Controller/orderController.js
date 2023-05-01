let Order = require("../Model/orderModel")
let OrderItems = require("../Model/orderItemsModel")
let Product = require("../Model/productModel")

// orderItems:  [{product,quantity},{product,quantity}]

// place order
exports.placeOrder = async (req, res) => {
    let orderItemsId = await Promise.all(
        req.body.orderItems.map(async orderItem => {
            let orderItemToAdd = new OrderItems({
                product: orderItem.product,
                quantity: orderItem.quantity
            })
            orderItemToAdd = await orderItemToAdd.save()
            if (!orderItemToAdd) {
                return res.status(400).json({ error: "Something went wrong." })
            }
            return orderItemToAdd._id
        })
    )
    // calculate total price
    let individualTotal = await Promise.all(
        orderItemsId.map(async orderItemId => {
            let item = await OrderItems.findById(orderItemId).populate('product', 'product_price')
            return item.quantity * item.product.product_price
        })
    )
    let totalPrice = individualTotal.reduce((acc, cur) => acc + cur)

    let newOrder = new Order({
        orderItems: orderItemsId,
        user: req.body.user,
        shipping_address: req.body.shipping_address,
        alternate_shipping_address: req.body.alternate_shipping_address,
        city: req.body.city,
        zipcode: req.body.zipcode,
        country: req.body.country,
        phone_number: req.body.phone_number,
        total_price: totalPrice
    })

    newOrder = await newOrder.save()
    if (!newOrder) {
        return res.status(400).json({ error: "Faile to place order." })
    }
    res.send(newOrder)
}

// to get all orders list
exports.getAllOrders = async (req, res) => {
    let orders = await Order.find().populate({ path: 'orderItems', populate: { path: "product", populate: "category" } })
        .populate("user", "username")
    if (!orders) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(orders)
}

// to get order details
exports.getOrderDetails = async (req, res) => {
    let order = await Order.findById(req.params.id)
        .populate({ path: 'orderItems', populate: { path: "product", populate: "category" } })
        .populate("user", "username")
    if (!order) {
        return res.status(400).json({ error: "Something went wrong or Order ID is mistake." })
    }
    res.send(order)
}

// get order of a user
exports.getOrderOfUser = async (req, res) => {
    let userorders = await Order.find({ user: req.params.userid })
        .populate({ path: 'orderItems', populate: { path: "product", populate: "category" } })
        .populate("user", "username")
    if (!userorders) {
        return res.status(400).json({ error: "Something went wrong." })
    }
    res.send(userorders)
}

// to update order status
exports.updateOrder = async (req, res) => {
    let usertoupdate = await Order.findByIdAndUpdate(req.params.orderid, {
        status: req.body.status
    }, { new: true })
    if (!usertoupdate) {
        return res.status(400).json({ error: "Something went wrong." })
    }
    res.send(usertoupdate)

}

// to delete order
exports.deleteorder = (req, res) => {
    Order.findByIdAndRemove(req.params.orderid)
        .then(order => {
            if (order == null) {
                return res.status(400).json({ error: "Order not found." })
            }
            order.orderItems.map(orderItem => {
                OrderItems.findByIdAndDelete(orderItem)
                    .then(orderItem => {
                        if (!orderItem) {
                            return res.status(400).json({ error: "Something went wrong." })
                        }
                    })
            })
            res.send({ message: "Order deleted." })
        })
        .catch(error => res.status(400).json({ error: error.message }))
}






