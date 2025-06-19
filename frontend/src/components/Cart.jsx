// src/pages/Cart.jsx

import React from 'react';
import { useCart } from '../context/CartContext';
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import PaymentIcon from '@mui/icons-material/Payment';


const Cart = () => {
    const { cartItems, removeItem, updateQuantity, clearCart, cartCount } = useCart();
    const navigate = useNavigate();
    
    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (productId, change) => {
    const product = cartItems.find((item) => item.id === productId);
    const newQuantity = product.quantity + change;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Cart ({cartCount} items)
      </Typography>

      <Divider sx={{ my: 2 }} />

      {cartItems.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <List>
          {cartItems.map((item) => (
            <ListItem key={item.id} divider>
              <ListItemText
                primary={`${item.name} x${item.quantity}`}
                secondary={`₹${Number(item.price).toFixed(2)} each`}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  onClick={() => handleQuantityChange(item.id, -1)}
                  disabled={item.quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, parseInt(e.target.value) || 1)
                  }
                  type="number"
                  inputProps={{ min: 1 }}
                  sx={{ width: 50, textAlign: 'center', mx: 1 }}
                />
                <IconButton onClick={() => handleQuantityChange(item.id, 1)}>
                  <AddIcon />
                </IconButton>
                <Typography variant="body1" sx={{ ml: 2 }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </Typography>
                <IconButton
                  color="error"
                  onClick={() => removeItem(item.id)}
                  sx={{ ml: 2 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Total: ₹{totalPrice.toFixed(2)}</Typography>

      <Button
        variant="contained"
        color="error"
        sx={{ mt: 2, mb: 2 }}
        onClick={clearCart}
        disabled={cartItems.length === 0}
      >
        Clear Cart
      </Button>

      <Button
        variant="contained"
        color="primary"
        startIcon={<PaymentIcon />}
        onClick={() => navigate("/checkout")}
        sx={{ mt: 2, mb: 2 }}
        >
        Proceed to Checkout
     </Button>

    </Box>
  );
};

export default Cart;
