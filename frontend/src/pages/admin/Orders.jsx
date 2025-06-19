// src/pages/admin/Orders.jsx
import React, { useEffect, useState } from "react";
import {
  Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Select, MenuItem, Paper, Box
} from "@mui/material";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/orders/all");
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/update/${id}`, { status });
      fetchOrders(); // refresh
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>Manage Orders</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Change Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.userName || "N/A"}</TableCell>
                <TableCell>
                  {order.items?.map(item => (
                    <div key={item.id}>{item.productName} × {item.quantity}</div>
                  ))}
                </TableCell>
                <TableCell>{order.payment_status}</TableCell>
                <TableCell>
                  <Select
                    value={order.payment_status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Orders;
