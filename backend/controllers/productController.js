const { status } = require("express/lib/response");
const mySqlPool = require("../config/db");

const getProducts = async(req,res) =>{
    try{
        const data = await mySqlPool.query(' SELECT * FROM products')
        if(!data){
            return res.status(404).send({
                success:false,
                message:'NO data found'
            })
        }
        res.status(200).send({
            success:true,
            message:'All Products Record',
            totalproducts:data[0].length,
            data:data[0],
        })

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Get Products',
            error,
        })
    }
}

//get products by id 

const getProductsByID = async(req,res) =>{
    try {
        const ProductID = req.params.id
        if(!ProductID){
            return res.status(404).send({
                success:false,
                message:'Invalid Or Provide Product ID',

            })
        }
        const data = await mySqlPool.query(`SELECT * FROM products WHERE id=?`,[ProductID])
        if(data[0].length === 0 ){
            return res.status(400).send({
                success:false,
                message:'no records found',
            })
        }
        res.status(200).send({
            success:true,
            data:data[0],

        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Get Products by ID',
            error

        })
    }
} 


// add product || POST

const addProduct = async(req,res) => {
    try {
        const {name, description, price, category, image, stock} = req.body
        if(!name || !description || !price || !category || !image || !stock){
            return res.status(500).send({
                success:false,
                message:'please provide all the fields'

            })

        }
        const data = await mySqlPool.query(`INSERT INTO products (name, description, price, category, image, stock) VALUES (?,?,?,?,?,?)`,[name, description, price, category, image, stock])
        if(!data){
            return res.status(500).send({
                success:false,
                message:'Error in Insert in query '
            })
        }

    res.status(200).send({
        success:true,
        message:'new product added',
    })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Add Product in API',
            error,

        })
    }
}

//update the product || PUT
const updateProduct = async(req,res) => {
    try {
        const ProductID = req.params.id
        if(!ProductID){
            return res.status(404).send({
                success:false,
                message:'Invalid Or Provide Product ID',

            })
        }
        const {name, description, price, category, image, stock} = req.body
        const data = await mySqlPool.query(`UPDATE products SET name=?, description=?, price=?, category=?, image=?, stock=? WHERE id = ?`, [name, description, price, category, image, stock, ProductID])
        if(!data){
            return res.status(500).send({
                success:false,
                message:'Error In Update the product ',
            })
        }
        res.status(200).send({
            success:true,
            message:"Product details Updated",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in update product',
            error,
        })
    } 
}


//delete product || DELETE

const deleteProduct = async(req,res) =>{
    try {
         const ProductID = req.params.id
         if(!ProductID){
            return res.status(404).send({
                success:false,
                message:'Invalid Or Provide Product ID',
                
            })
         }
         await mySqlPool.query(`DELETE FROM products WHERE id = ? `,[ProductID])
         res.status(200).send({
            success:false,
            message:'Product Deleted Successfully',
         })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in delete product',
            error,
        })
    }

}




module.exports = { getProducts, getProductsByID, addProduct, updateProduct , deleteProduct};

