// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { getAdminProfile, updateAdminProfile } = require("../controllers/adminController");

router.get("api/admin/profile", getAdminProfile);
router.put("api/admin/profile", updateAdminProfile);

module.exports = router;
