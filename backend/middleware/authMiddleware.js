const jwt = require("jsonwebtoken");
const mySqlPool = require("../config/db");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied. Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user exists in database
    const [user] = await mySqlPool.query("SELECT * FROM users WHERE id = ?", [decoded.id]);
    
    if (!user || user.length === 0) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = {
      id: user[0].id,
      isAdmin: user[0].isAdmin || false
    };
    
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ success: false, message: "Admin Access Denied" });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };