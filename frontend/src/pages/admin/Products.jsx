import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import ProductForm from "./ProductForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:8080/api/products/getall");
    setProducts(res.data.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/products/delete/${id}`);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setOpenForm(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setOpenForm(true);
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>Manage Products</Typography>
      <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
        Add Product
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell>{prod.name}</TableCell>
                <TableCell>{prod.category}</TableCell>
                <TableCell>₹{prod.price}</TableCell>
                <TableCell>{prod.stock}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEdit(prod)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(prod.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent>
          <ProductForm
            product={editProduct}
            onClose={() => {
              setOpenForm(false);
              fetchProducts();
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Products;
