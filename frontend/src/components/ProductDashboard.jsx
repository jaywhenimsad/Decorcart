// components/ProductDashboard.jsx
import React, { useContext } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  Grid,
  Typography,
  Button,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductDashboard = ({ product, open, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    const token = localStorage.getItem('token');
    token ? addToCart(product) : navigate('/login');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      sx={{ backdropFilter: 'blur(5px)' }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      
      <DialogContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={product?.image || '/images/photo.png'}
              alt={product?.name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '60vh',
                objectFit: 'contain',
                borderRadius: 2,
              }}
              onError={(e) => (e.target.src = '/images/photo.png')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product?.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ₹{parseFloat(product?.price || 0).toFixed(2)}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" paragraph>
              {product?.description || 'No description available.'}
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDashboard;