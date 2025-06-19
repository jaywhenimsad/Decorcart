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
  IconButton
} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
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
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        name,
        email,
        password,
      });

      setSuccessMsg('Registration successful! You can now log in.');
      setName('');
      setEmail('');
      setPassword('');

      // Redirect to login after short delay
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, mt: 8, position: 'relative' }}>
        {/* Close Button */}
        <IconButton
          onClick={() => navigate('/')}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={{ bgcolor: 'secondary.main', mb: 2 }}>
            <PersonAddAltIcon />
          </Avatar>
          <Typography component="h1" variant="h5" gutterBottom>
            Create Account
          </Typography>

          {errorMsg && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{errorMsg}</Alert>}
          {successMsg && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{successMsg}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              label="Name"
              variant="outlined"
              margin="normal"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              margin="normal"
              fullWidth
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
            >
              Register
            </Button>
          </Box>

          <Typography sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
