import React, { useEffect, useState } from "react";
import { Typography, Box, TextField, Button, Paper } from "@mui/material";
import axios from "axios";

const DashboardHome = () => {
  const [admin, setAdmin] = useState({ name: "", email: "", mobile: "", address: "" });

  const fetchAdmin = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/profile");
      setAdmin(res.data);
    } catch (err) {
      console.error("Failed to fetch admin:", err);
    }
  };

  const updateAdmin = async () => {
    try {
      await axios.put("http://localhost:8080/api/admin/profile", admin);
      alert("Profile updated!");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Typography variant="body1" gutterBottom>Manage your admin profile here.</Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          value={admin.name}
          onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          value={admin.email}
          onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Mobile"
          value={admin.mobile}
          onChange={(e) => setAdmin({ ...admin, mobile: e.target.value })}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Address"
          multiline
          rows={3}
          value={admin.address}
          onChange={(e) => setAdmin({ ...admin, address: e.target.value })}
        />
        <Button variant="contained" color="primary" onClick={updateAdmin} sx={{ mt: 2 }}>
          Save Profile
        </Button>
      </Paper>
    </Box>
  );
};

export default DashboardHome;
