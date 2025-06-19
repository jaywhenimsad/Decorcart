const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mySqlPool = require("../config/db");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const [existing] = await mySqlPool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await mySqlPool.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration Failed", error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await mySqlPool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login Failed", error: error.message || error.toString(),});
  }
};
