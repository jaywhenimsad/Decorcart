import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import ProductList from '../components/ProductList';
import HeroSection from '../components/HeroSection';
import FeaturedCategories from '../components/FeaturedCategories';
import ProductsSection from '../components/ProductsSection';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/products/getall');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <Typography variant="h5" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container>
      <HeroSection />
      <FeaturedCategories />
      {/* <ProductList products={products} /> */}
      <ProductsSection/>
    </Container>
  );
};

export default Home;
