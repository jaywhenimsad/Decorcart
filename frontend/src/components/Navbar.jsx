import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Badge,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoginIcon from '@mui/icons-material/Login';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person'; // Added profile icon
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // adjust path if needed

const Navbar = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearCart(); // Clear cart on logout
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <AppBar position="static" sx={{ backgroundColor: '#3f51b5' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StorefrontIcon sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
            DecorCart
          </Typography>
        </Box>

        <TextField
          variant="outlined"
          placeholder="Search..."
          size="small"
          sx={{
            backgroundColor: 'white',
            borderRadius: 1,
            width: '40%',
            mx: 2,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isLoggedIn ? (
            <Button color="inherit" startIcon={<LoginIcon />} href="/login">
              Login
            </Button>
          ) : (
            <Button
              color="inherit"
              startIcon={<ExitToAppIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}

          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <Badge badgeContent={cartItems.length} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* Added Profile Icon Button - Only shows when logged in */}
          {isLoggedIn && (
            <IconButton color="inherit" onClick={() => navigate('/profile')}>
              <PersonIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;