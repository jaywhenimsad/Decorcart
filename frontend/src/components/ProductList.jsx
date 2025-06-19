// components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { Grid, Typography, CircularProgress, Box, Dialog } from '@mui/material';
import ProductCard from './ProductCard';
import ProductDashboard from './ProductDashboard'; // Import the new component
import api from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDashboard, setOpenDashboard] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products/getall');
        setProducts(response.data.data || []);  
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setOpenDashboard(true);
  };

  const handleCloseDashboard = () => {
    setOpenDashboard(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3} justifyContent={products.length ? "flex-start" : "center"}>
        {products.length > 0 ? (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <ProductCard 
                product={product} 
                onClick={() => handleProductClick(product)} 
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              No products available
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Product Dashboard Dialog */}
      <Dialog
        open={openDashboard}
        onClose={handleCloseDashboard}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            overflow: 'hidden',
          }
        }}
      >
        {selectedProduct && (
          <ProductDashboard 
            product={selectedProduct} 
            onClose={handleCloseDashboard} 
          />
        )}
      </Dialog>
    </>
  );
};

export default ProductList;