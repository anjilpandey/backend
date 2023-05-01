const { find } = require("../Model/productModel")
const Product = require("../Model/productModel")

//to add product
exports.addProduct = async (req, res) => {
    // let product = await Product.findOne({ category_name: req.body.category_name })
    // if(!product){
        if(!req.file){
            return res.status(400).json({error:"File not selected."})
        }
    let productToAdd = new Product({
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_description: req.body.product_description,
        product_image: req.file.path,
        category: req.body.category,
        count_in_stock: req.body.count_in_stock,
        rating: req.body.rating
    })
    productToAdd = await productToAdd.save()
    if (!productToAdd) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(productToAdd)
}
// res.status(400).json({ error: "Product already exits." })

// get all products
exports.getAllProduct = async (req, res) => {
    let products = await Product.find().populate('category', "category_name")
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(products)
}

//to get product list of particular category
exports.getProductByCategory = async (req, res) => {
    let productByCategory = await Product.find({ category: req.params.category_id }).select(["product_name", "rating"])
    if (!productByCategory) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(productByCategory)
}

//update products
exports.updateProduct = async (req, res) => {
    let productToUpdate = await Product.findByIdAndUpdate(req.params.id,
        req.file ?
            {
                product_name: req.body.product_name,
                product_price: req.body.product_price,
                product_description: req.body.product_description,
                product_image: req.file.path,
                category: req.body.category,
                count_in_stock: req.body.count_in_stock,
                rating: req.body.rating
            }
            :
            {
                product_name: req.body.product_name,
                product_price: req.body.product_price,
                product_description: req.body.product_description,
                product_image: req.body.product_image,
                category: req.body.category,
                count_in_stock: req.body.count_in_stock,
                rating: req.body.rating
            }, { new: true })
    if (!productToUpdate) {
        return res.status(400).json({ error: "Something went wrong." })
    }
    res.send(productToUpdate)
}

//delete product
exports.deleteProduct = async (req, res) => {
    try {

        let productToDelete = await Product.findByIdAndDelete(req.params.id)
        if (!productToDelete) {
            return res.status(400).json({ error: "Something went wrong" })
        }
        res.status(200).json({ error: "Category successfully deleted" })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

