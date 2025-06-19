import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', py: 6, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom color="primary">
              DecorCart
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Beautify your home with premium curated products. We bring you the best of design and comfort.
            </Typography>
          </Grid>

          {/* Useful Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" underline="none" color="textSecondary" display="block" sx={{ mb: 1 }}>
              Home
            </Link>
            <Link href="/products" underline="none" color="textSecondary" display="block" sx={{ mb: 1 }}>
              Products
            </Link>
            <Link href="/cart" underline="none" color="textSecondary" display="block" sx={{ mb: 1 }}>
              Cart
            </Link>
            <Link href="/login" underline="none" color="textSecondary" display="block">
              Login
            </Link>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Pune, Maharashtra, India
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Email: support@decorcart.com
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Phone: +91 8668700378
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" align="center" color="textSecondary">
          © {new Date().getFullYear()} DecorCart. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
