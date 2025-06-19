const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mySqlPool = require('./config/db');
const authRoutes = require("./routes/authRoutes");
const { verifyToken, verifyAdmin } = require("./middleware/authMiddleware");
const orderRoutes = require("./routes/orderRoutes")
const adminRoutes = require("./routes/adminRoutes");
const cors = require('cors')

//config env
dotenv.config();

//rest object
const app = express();

//middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
//routes
app.use("/api/products", require("./routes/productRoutes"));
//auth routes
app.use("/api/auth", authRoutes);
//orders routes
app.use("/api/orders", orderRoutes);
//admin routes

app.use("/api/admin", adminRoutes);


//sample route
app.get('/test', (req, res) => {
    res.status(200).send('<h1>MySQL App</h1>');
});

// Example of protected route
app.get("/api/profile", verifyToken, (req, res) => {
    res.json({ message: "Welcome user", user: req.user });
  });
  
  // Example of admin-only route
  app.get("/api/admin/dashboard", verifyAdmin, (req, res) => {
    res.json({ message: "Welcome admin", user: req.user });
  });

//port
const PORT = process.env.PORT || 8000;

//conditionally listen
mySqlPool.query('SELECT 1')
    .then(() => {
        console.log("MySQL database is connected".bgCyan.white);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`.bgMagenta.white);
        });
    })
    .catch((error) => {
        console.log(error);
    });
