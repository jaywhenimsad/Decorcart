import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Alert,
  Link,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      
      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Immediately fetch orders after successful login
      try {
        const ordersResponse = await axios.get(
          `http://localhost:8080/api/orders/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        // Store orders in localStorage if needed
        localStorage.setItem('userOrders', JSON.stringify(ordersResponse.data));
      } catch (orderError) {
        console.warn('Could not fetch orders:', orderError);
        // This is non-critical, so we don't show error to user
      }

      setSuccessMsg(`Welcome back, ${user.name}!`);
      navigate(user.isAdmin ? '/admin' : '/');

    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userOrders');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main', mb: 2 }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" gutterBottom>
            Sign in to DecorCart
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {errorMsg}
            </Alert>
          )}
          
          {successMsg && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {successMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              size="large"
            >
              Sign In
            </Button>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Link 
              component={RouterLink} 
              to="/forgot-password" 
              variant="body2"
            >
             
            </Link>
            
            <Link 
              component={RouterLink} 
              to="/register" 
              variant="body2"
            >
              Don't have an account? Sign Up
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;