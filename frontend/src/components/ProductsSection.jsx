// components/ProductsSection.jsx
import { Box, Typography, Container, useTheme } from '@mui/material';
import ProductList from './ProductList';

const ProductsSection = () => {
  const theme = useTheme();

  return (
    <Box 
      id="products-section" 
      sx={{ 
        py: 8,
        backgroundColor: theme.palette.mode === 'dark' 
          ? theme.palette.grey[900] 
          : theme.palette.grey[50],
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: theme.palette.mode === 'dark' ? '#fff' : '#37474f',
            mb: 6,
            position: 'relative',
            '&:after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              background: theme.palette.primary.main,
              margin: '16px auto 0',
              borderRadius: 2
            }
          }}
        >
          Our Products
        </Typography>
        
        {/* This will render your ProductList with all its functionality */}
        <ProductList />
      </Container>
    </Box>
  );
};

export default ProductsSection;