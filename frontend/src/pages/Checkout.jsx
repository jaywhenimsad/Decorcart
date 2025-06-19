import React from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { 
  Box, Typography, Card, CardContent, List, ListItem, 
  ListItemText, Divider, FormControl, InputLabel, Select, 
  MenuItem, Button, Grid, TextField, Snackbar, Alert, 
  CircularProgress 
} from "@mui/material";

const Checkout = () => {
  const { cartItems, cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = React.useState("cod");
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ 
    open: false, 
    message: "", 
    severity: "info" 
  });

  const [shipping, setShipping] = React.useState({
    fullName: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    country: "India",
    mobile: "",
  });

  const [errors, setErrors] = React.useState({
    fullName: false,
    address: false,
    city: false,
    pincode: false,
    state: false,
    country: false,
    mobile: false,
  });

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const handleSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const validateForm = () => {
    const newErrors = {
      fullName: !shipping.fullName,
      address: !shipping.address,
      city: !shipping.city,
      pincode: !/^\d{6}$/.test(shipping.pincode),
      state: !shipping.state,
      country: !shipping.country,
      mobile: !/^\d{10}$/.test(shipping.mobile),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handlePlaceCODOrder = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) throw new Error("User not logged in");

      const orderData = {
        userId: user.id,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: shipping,
        paymentMethod: "cod",
        amount: totalAmount
      };

      const res = await axios.post("http://localhost:8080/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      clearCart();
      handleSnackbar("Order placed successfully! Your items will be delivered soon.", "success");
      setTimeout(() => {
        navigate(`/order-success/${res.data.orderId}`);
      }, 2000); // Show success message for 2 seconds before navigating
    } catch (err) {
      console.error("COD Order Error:", err.response?.data || err);
      handleSnackbar(
        err.response?.data?.message || "Failed to place COD order. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) throw new Error("User not logged in");

      // Step 1: Create order on backend
      const orderRes = await axios.post(
        "http://localhost:8080/api/orders/razorpay-order",
        {
          amount: totalAmount * 100,
          receipt: `order_${user.id}_${Date.now()}`,
          notes: {
            userId: user.id,
            amount: totalAmount
          }
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      // Step 2: Initialize Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "DecorCart",
        description: "Order Payment",
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            // Step 3: Verify payment and create order
            const verificationRes = await axios.post(
              "http://localhost:8080/api/orders/verify-payment",
              {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id, // Fixed typo
                razorpaySignature: response.razorpay_signature, // Fixed typo
                userId: user.id,
                items: cartItems.map(item => ({
                  productId: item.id,
                  quantity: item.quantity,
                  price: item.price
                })),
                shippingAddress: shipping,
                amount: totalAmount
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
                }
              }
            );

            clearCart();
            handleSnackbar("Payment successful! Your order has been confirmed.", "success");
            setTimeout(() => {
              navigate(`/`);
            }, 2000);
          } catch (err) {
            console.error("Payment verification failed:", err.response?.data || err);
            handleSnackbar(
              `Payment succeeded but order processing failed. Please contact support with reference ID: ${response.razorpay_payment_id}`,
              "error"
            );
          }
        },
        prefill: {
          name: shipping.fullName,
          email: user.email || "",
          contact: shipping.mobile
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: () => {
            handleSnackbar("Payment window closed. Please try again if you want to complete your order.", "info");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay Error:", err.response?.data || err);
      handleSnackbar(
        err.response?.data?.message || "Payment initialization failed. Please try again later.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      handleSnackbar("Please fill all fields correctly", "warning");
      return;
    }

    if (paymentMethod === "cod") {
      await handlePlaceCODOrder();
    } else {
      await handleRazorpayPayment();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Shipping Address</Typography>
              <Grid container spacing={2}>
                {[
                  { field: "fullName", label: "Full Name", xs: 12 },
                  { field: "address", label: "Address", xs: 12 },
                  { field: "city", label: "City", xs: 6 },
                  { field: "pincode", label: "Pincode", xs: 6 },
                  { field: "state", label: "State", xs: 6 },
                  { field: "country", label: "Country", xs: 6 },
                  { field: "mobile", label: "Mobile", xs: 12 },
                ].map(({ field, label, xs }) => (
                  <Grid item xs={xs} key={field}>
                    <TextField
                      fullWidth
                      label={label}
                      name={field}
                      value={shipping[field]}
                      onChange={handleChange}
                      error={errors[field]}
                      helperText={
                        errors[field] && field === "pincode" ? "6 digits required" :
                        errors[field] && field === "mobile" ? "10 digits required" :
                        errors[field] ? "Required field" : ""
                      }
                      type={["pincode", "mobile"].includes(field) ? "number" : "text"}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">Order Summary</Typography>
              <List>
                {cartItems.map((item) => (
                  <ListItem key={item.id} divider>
                    <ListItemText
                      primary={`${item.name} x${item.quantity}`}
                      secondary={`₹${(item.price * item.quantity).toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Total: ₹{totalAmount.toFixed(2)}</Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Payment Method</Typography>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Payment Method"
                >
                  <MenuItem value="cod">Cash on Delivery</MenuItem>
                  <MenuItem value="razorpay">Online Payment</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                onClick={handlePlaceOrder}
                disabled={loading || cartItems.length === 0}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? "Processing..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }} // Add margin to avoid overlapping with app bar
      >
        <Alert 
          severity={snackbar.severity}
          onClose={handleCloseSnackbar}
          sx={{
            width: '100%',
            fontSize: '1rem',
            boxShadow: 3,
            alignItems: 'center'
          }}
          variant="filled"
        >
          <Typography variant="body1" fontWeight="medium">
            {snackbar.message}
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Checkout;