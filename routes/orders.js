const express = require("express");
const router = express.Router();
const db = require("../db");


// ==========================
// CREATE ORDER
// ==========================
router.post("/", async (req, res) => {
  const { customer_name, item, quantity } = req.body;

  // basic validation (VERY IMPORTANT)
  if (!customer_name || !item || !quantity) {
    return res.status(400).json({
      error: "customer_name, item, and quantity are required"
    });
  }

  try {
    const result = await db.query(
      "INSERT INTO orders (customer_name, item, quantity) VALUES ($1, $2, $3) RETURNING *",
      [customer_name, item, quantity]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error("🔥 DATABASE ERROR (POST /orders):", err);

    res.status(500).json({
      error: err.message
    });
  }
});


// ==========================
// GET ALL ORDERS
// ==========================
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    res.json(result.rows);

  } catch (err) {
    console.error("🔥 DATABASE ERROR (GET /orders):", err);

    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;

router.get("/export/csv", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    const orders = result.rows;

    // CSV header
    let csv = "Customer Name,Item,Quantity,Created At\n";

    // CSV rows
    orders.forEach(order => {
      csv += `${order.customer_name},${order.item},${order.quantity},${order.created_at}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("orders.csv");

    res.send(csv);

  } catch (err) {
    console.error("EXPORT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});