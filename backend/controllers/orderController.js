const mySqlPool = require("../config/db");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, receipt, notes } = req.body;
    
    if (!amount || !receipt) {
      return res.status(400).json({
        success: false,
        message: "Amount and receipt are required"
      });
    }

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt,
      notes,
      payment_capture: 1
    });

    res.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: process.env.NODE_ENV === 'development' ? err.error : undefined
    });
  }
};

// Verify Payment and Create Order
exports.verifyPayment = async (req, res) => {
  const connection = await mySqlPool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      userId,
      items,
      shippingAddress,
      amount
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'razorpayPaymentId', 'razorpayOrderId', 'razorpaySignature',
      'userId', 'items', 'shippingAddress', 'amount'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    // Create order record
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
       (user_id, payment_id, razorpay_order_id, payment_status, shipping_address, amount) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        razorpayPaymentId,
        razorpayOrderId,
        "Paid",
        JSON.stringify(shippingAddress),
        amount
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "Invalid item format"
        });
      }

      await connection.query(
        `INSERT INTO order_items 
         (order_id, product_id, quantity, price) 
         VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    await connection.commit();
    
    res.json({
      success: true,
      message: "Order created successfully",
      orderId
    });
  } catch (err) {
    await connection.rollback();
    console.error("Payment verification error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment and create order",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    connection.release();
  }
};

// Place COD Order
exports.placeOrder = async (req, res) => {
  const connection = await mySqlPool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      userId,
      items,
      shippingAddress,
      paymentMethod = "cod",
      amount
    } = req.body;

    // Validate required fields
    const requiredFields = ['userId', 'items', 'shippingAddress', 'amount'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate items
    if (!Array.isArray(items)) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Items must be an array"
      });
    }

    // Create order record
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
       (user_id, payment_status, shipping_address, amount, payment_method) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        paymentMethod === "cod" ? "Pending" : "Paid",
        JSON.stringify(shippingAddress),
        amount,
        paymentMethod
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "Invalid item format"
        });
      }

      await connection.query(
        `INSERT INTO order_items 
         (order_id, product_id, quantity, price) 
         VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    await connection.commit();
    
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId
    });
  } catch (err) {
    await connection.rollback();
    console.error("Order placement error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    connection.release();
  }
};


// ... (keep your other existing controller methods)

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await mySqlPool.query(
      `SELECT o.*, u.name AS userName, u.email 
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );

    for (const order of orders) {
      const [items] = await mySqlPool.query(
        `SELECT oi.*, p.name AS productName, p.image 
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({ success: true, orders });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// Get orders by user
exports.getOrdersByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [orders] = await mySqlPool.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    for (const order of orders) {
      const [items] = await mySqlPool.query(
        `SELECT oi.*, p.name AS productName, p.image 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch user orders" });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const [orderRows] = await mySqlPool.query("SELECT * FROM orders WHERE id = ?", [orderId]);

    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRows[0];

    const [items] = await mySqlPool.query(
      `SELECT oi.*, p.name AS productName FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    res.json({ order, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch order details" });
  }
};

// Update payment status
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await mySqlPool.query("UPDATE orders SET payment_status = ? WHERE id = ?", [status, id]);
    res.json({ success: true, message: "Payment status updated" });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ success: false, message: "Failed to update payment status" });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    await mySqlPool.query("DELETE FROM order_items WHERE order_id = ?", [id]);
    await mySqlPool.query("DELETE FROM orders WHERE id = ?", [id]);

    res.json({ success: true, message: "Order deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
};

// delete the order 

// Add this to your orderController.js

// Add this to your existing orderController.js
exports.cancelOrder = async (req, res) => {
  const connection = await mySqlPool.getConnection();
  
  try {
    await connection.beginTransaction();
    const orderId = req.params.id;
    
    // 1. Check if order exists and can be cancelled
    const [orderRows] = await connection.query(
      `SELECT * FROM orders WHERE id = ? FOR UPDATE`,
      [orderId]
    );
    
    if (orderRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false,
        message: "Order not found" 
      });
    }
    
    const order = orderRows[0];
    
    // 2. Validate order can be cancelled
    if (order.payment_status === 'Cancelled') {
      await connection.rollback();
      return res.status(400).json({ 
        success: false,
        message: "Order is already cancelled" 
      });
    }
    
    if (order.payment_status !== 'Paid' && order.payment_status !== 'Pending') {
      await connection.rollback();
      return res.status(400).json({ 
        success: false,
        message: "Order cannot be cancelled at this stage" 
      });
    }
    
    // 3. If paid, initiate refund (this is a simplified version)
    if (order.payment_status === 'Paid' && order.payment_method === 'razorpay') {
      try {
        // In a real app, you would call Razorpay's refund API here
        // This is just a placeholder for the refund logic
        const refundNotes = {
          reason: 'Customer requested cancellation',
          orderId: order.id
        };
        
        // In a real implementation, you would:
        // 1. Call Razorpay API to create refund
        // 2. Store refund details in your database
        // 3. Update payment status
        
        // For now, we'll just simulate a successful refund
        console.log(`Would process refund for payment ${order.payment_id}`);
      } catch (refundError) {
        await connection.rollback();
        console.error("Refund failed:", refundError);
        return res.status(500).json({ 
          success: false,
          message: "Refund processing failed" 
        });
      }
    }
    
    // 4. Update order status
    await connection.query(
      `UPDATE orders SET 
       payment_status = 'Cancelled',
       cancelled_at = NOW()
       WHERE id = ?`,
      [orderId]
    );
    
    // 5. Restore product quantities if needed
    const [items] = await connection.query(
      `SELECT product_id, quantity FROM order_items WHERE order_id = ?`,
      [orderId]
    );
    
    for (const item of items) {
      await connection.query(
        `UPDATE products 
         SET stock = stock + ? 
         WHERE id = ?`,
        [item.quantity, item.product_id]
      );
    }
    
    await connection.commit();
    
    res.json({ 
      success: true,
      message: "Order cancelled successfully" 
    });
  } catch (err) {
    await connection.rollback();
    console.error("Order cancellation error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to cancel order",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  } finally {
    connection.release();
  }
};
