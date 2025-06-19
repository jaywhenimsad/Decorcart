import React, { useState, useContext } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  Box,
  Dialog,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const fallbackImage = '/images/photo.png';

const ProductCard = ({ product }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [openDashboard, setOpenDashboard] = useState(false);

  const priceNumber = parseFloat(product?.price);
  const displayPrice = !isNaN(priceNumber) ? priceNumber.toFixed(2) : null;

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent triggering card click
    const token = localStorage.getItem('token');
    token ? addToCart(product) : navigate('/login');
  };

  const handleCardClick = () => {
    setOpenDashboard(true);
  };

  const handleCloseDashboard = () => {
    setOpenDashboard(false);
  };

  return (
    <>
      {/* Product Card */}
      <Card
        onClick={handleCardClick}
        sx={{
          maxWidth: 200,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 3,
          transition: '0.3s',
          cursor: 'pointer',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 6,
          },
        }}
      >
        <CardMedia
          component="img"
          height="150"
          image={product?.image || fallbackImage}
          alt={product?.name || 'Product Image'}
          onError={(e) => (e.target.src = fallbackImage)}
          sx={{ objectFit: 'cover' }}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {product?.name || 'Unnamed Product'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {product?.description || 'No description available.'}
          </Typography>
          <Box mt={2}>
            {displayPrice ? (
              <Typography variant="h6" color="primary">
                ₹{displayPrice}
              </Typography>
            ) : (
              <Typography variant="subtitle2" color="text.secondary">
                Price not available
              </Typography>
            )}
          </Box>
        </CardContent>

        <CardActions>
          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            Add to Cart
          </Button>
        </CardActions>
      </Card>

      {/* Product Dashboard Dialog */}
      <Dialog
        open={openDashboard}
        onClose={handleCloseDashboard}
        fullScreen={isMobile}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: isMobile ? 0 : 3,
            overflow: 'hidden',
          }
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleCloseDashboard}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
          {/* Product Image */}
          <Box
            sx={{
              width: isMobile ? '100%' : '50%',
              height: isMobile ? '300px' : '500px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.grey[100],
            }}
          >
            <Box
              component="img"
              src={product?.image || fallbackImage}
              alt={product?.name}
              onError={(e) => (e.target.src = fallbackImage)}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>

          {/* Product Details */}
          <Box sx={{
            width: isMobile ? '100%' : '50%',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Typography variant="h4" gutterBottom>
              {product?.name || 'Unnamed Product'}
            </Typography>
            
            <Typography variant="h5" color="primary" gutterBottom>
              {displayPrice ? `₹${displayPrice}` : 'Price not available'}
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              {product?.description || 'No description available.'}
            </Typography>
            
            <Box sx={{ mt: 'auto', pt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default ProductCard;