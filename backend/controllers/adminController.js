// controllers/adminController.js
const mySqlPool = require("../config/db");

// Get admin profile (for demo, use id = 1)
exports.getAdminProfile = async (req, res) => {
  try {
    const [rows] = await mySqlPool.query("SELECT * FROM admins WHERE id = 1");
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin profile" });
  }
};

exports.updateAdminProfile = async (req, res) => {
  const { name, email, mobile, address } = req.body;
  try {
    await mySqlPool.query(
      "UPDATE admins SET name = ?, email = ?, mobile = ?, address = ? WHERE id = 1",
      [name, email, mobile, address]
    );
    res.json({ message: "Admin profile updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update admin profile" });
  }
};
