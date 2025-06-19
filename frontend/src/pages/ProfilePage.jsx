import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  CircularProgress,
  Alert,
  List,
  ListItem,
  Button,
  Paper,
  Chip,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' // 'error', 'warning', 'info', 'success'
  });
  const navigate = useNavigate();

  const handleSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!token || !user) {
          throw new Error('Please login to view profile');
        }

        setUserData(user);
        
        const response = await axios.get(
          `http://localhost:8080/api/orders/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        setOrders(response.data.orders || []);
        setLoading(false);
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError(error.response?.data?.message || error.message);
        setLoading(false);
        
        if (error.message.includes('login') || error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchProfileData();
  }, [navigate]);

const handleCancelOrder = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(
      `/api/orders/${cancelOrderId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      // Refresh orders
      const updatedOrders = await fetchOrders();
      setOrders(updatedOrders);
      handleSnackbar("Order cancelled", "success");
    } else {
      handleSnackbar(response.data.message, "error");
    }
  } catch (error) {
    console.error("Cancellation failed:", {
      status: error.response?.status,
      data: error.response?.data,
    });

    let errorMessage = "Failed to cancel order";
    if (error.response?.status === 500) {
      errorMessage = "Server error. Please try again later.";
    }
    handleSnackbar(errorMessage, "error");
  }
};

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/login')}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>My Profile</Typography>
        <Typography><strong>Name:</strong> {userData?.name || 'Not available'}</Typography>
        <Typography><strong>Email:</strong> {userData?.email || 'Not available'}</Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Order History</Typography>
        {orders.length > 0 ? (
          <List>
            {orders.map(order => (
              <Paper key={order.id} elevation={2} sx={{ mb: 2, p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle1">
                    <strong>Order #:</strong> {order.razorpay_order_id || order.id}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Chip 
                      label={order.payment_status} 
                      color={
                        order.payment_status === 'Paid' ? 'success' : 
                        order.payment_status === 'Failed' ? 'error' : 
                        order.payment_status === 'Cancelled' ? 'warning' : 'default'
                      }
                      sx={{ mr: 1 }}
                    />
                    {order.payment_status === 'Paid' && (
                      <Button 
                        variant="outlined" 
                        color="error"
                        size="small"
                        onClick={() => setCancelOrderId(order.id)}
                        disabled={isCanceling}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>Items:</Typography>
                <List>
                  {order.items?.map(item => (
                    <ListItem key={item.id} alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar 
                            src={item.image} 
                            alt={item.productName}
                            variant="square"
                            sx={{ width: 56, height: 56, mr: 2 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.productName}
                          secondary={
                            <>
                              <Typography component="span" display="block">
                                Quantity: {item.quantity}
                              </Typography>
                              <Typography component="span" display="block">
                                Price: {item.price ? `₹${Number(item.price).toFixed(2)}` : 'Price not available'}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                  ))}
                </List>
              </Paper>
            ))}
          </List>
        ) : (
          <Typography>No orders found</Typography>
        )}
      </Paper>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog
        open={Boolean(cancelOrderId)}
        onClose={() => setCancelOrderId(null)}
      >
        <DialogTitle>Cancel Order Confirmation</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to cancel this order?
          </Typography>
          {orders.find(o => o.id === cancelOrderId)?.payment_status === 'Paid' && (
            <>
              <Typography variant="body2" color="text.secondary">
                A refund will be initiated for this order.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Refunds typically take 5-7 business days to process.
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setCancelOrderId(null)}
            disabled={isCanceling}
          >
            Keep Order
          </Button>
          <Button 
            onClick={handleCancelOrder}
            color="error"
            variant="contained"
            disabled={isCanceling}
          >
            {isCanceling ? <CircularProgress size={24} /> : 'Confirm Cancellation'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;