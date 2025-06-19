import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  CssBaseline,
  IconButton,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

import Products from "./Products";
import Orders from "./Orders";
import DashboardHome from "./DashboardHome";

const drawerWidth = 240;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token or session data
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>

          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button component={Link} to="">
            <ListItemText primary="Dashboard Home" />
          </ListItem>
          <ListItem button component={Link} to="products">
            <ListItemText primary="Manage Products" />
          </ListItem>
          <ListItem button component={Link} to="orders">
            <ListItemText primary="Manage Orders" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="" element={<DashboardHome />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
