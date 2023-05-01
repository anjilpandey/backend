const Category = require('../Model/categoryModel')

// to create new Category
exports.addCategory = async (req, res) => {
    let category = await Category.findOne({ category_name: req.body.category_name })
    if (!category) {

        let categoryToAdd = new Category({
            category_name: req.body.category_name
        })
        categoryToAdd = await categoryToAdd.save()
        if (!categoryToAdd) {
            return res.status(400).json({ error: "Something went wrong" })
        }
        
            return res.send(categoryToAdd)
        
    }
    res.status(400).json({ error: "Category already exits." })
}

//to get all categories
exports.getAllCategories = async (req, res) => {
    categories = await Category.find()
    if (!categories) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    // dont need to put else because there is return
    res.send(categories)
}

// to get categories details
exports.categoryDetails = async (req, res) => {
    category = await Category.findById(req.params.id)
    if (!category) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(category)
}

//to update category
exports.updateCategory=async(req,res)=>{
    let categoryToUpdate = await Category.findByIdAndUpdate(req.params.id,{category_name:req.body.category_name},{new:true})
    if(!categoryToUpdate){
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(categoryToUpdate)
}

// to delete category using callback
// exports.deleteCategory=(req,res)=>{
//     Category.findByIdAndDelete(req.params.id,(error,data)=>{
//         if(!data){
//             return res.status(400).json({error:"Category not found"})
//         }

//         res.status(200).json({msg:"Category deleted successfully"})
//     })
// }

//to delete category using promise
// exports.deleteCategory=(req,res)=>{
//     Category.findByIdAndDelete(req.params.id)
//     .then(data=>{
//         if(!data){
//             return res.status(400).json({error:"Category not found."})
//         }
//         res.status(200).json({msg:"Category deleted successfully."})
//     })
//     .catch(error=>res.status(400).json({error:error.message}))
// }

// to delete category using async and await
exports.deleteCategory=async(req,res)=>{
    try{

        let categoryToDelete=await Category.findByIdAndDelete(req.params.id)
        if(!categoryToDelete){
            return res.status(400).json({error:"Category not found."})
        }
        res.status(200).json({msg:"Category deleted successfully"})
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}