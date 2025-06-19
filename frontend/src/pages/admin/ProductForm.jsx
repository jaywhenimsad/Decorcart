import React, { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";

const ProductForm = ({ product, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "decorcart_unsigned"); // Replace with your Cloudinary preset

    setUploading(true);
    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/dz1e0sigm/image/upload", formData);
      setForm({ ...form, image: res.data.secure_url });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product) {
      await axios.put(`http://localhost:8080/api/products/update/${product.id}`, form);
    } else {
      await axios.post("http://localhost:8080/api/products/create", form);
    }
    onClose();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField fullWidth label="Name" name="name" value={form.name} onChange={handleChange} margin="normal" required />
      <TextField fullWidth label="Description" name="description" value={form.description} onChange={handleChange} margin="normal" required />
      <TextField fullWidth label="Category" name="category" value={form.category} onChange={handleChange} margin="normal" required />
      
      <Button variant="outlined" component="label" sx={{ mt: 2 }}>
        Upload Image
        <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
      </Button>
      {uploading && <p>Uploading...</p>}
      {form.image && <img src={form.image} alt="preview" style={{ width: 100, marginTop: 10 }} />}

      <TextField fullWidth label="Price" name="price" value={form.price} onChange={handleChange} margin="normal" type="number" required />
      <TextField fullWidth label="Stock" name="stock" value={form.stock} onChange={handleChange} margin="normal" type="number" required />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        {product ? "Update" : "Add"}
      </Button>
    </Box>
  );
};

export default ProductForm;
