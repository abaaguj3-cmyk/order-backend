const express = require("express");
const router = express.Router();
const db = require("../db");

// CREATE ORDER
router.post("/", async (req, res) => {
  const { customer_name, item, quantity, location } = req.body;

  if (!customer_name || !item || !quantity) {
    return res.status(400).json({
      error: "customer_name, item, and quantity are required"
    });
  }

  try {
    const result = await db.query(
      `INSERT INTO orders (customer_name, item, quantity, location)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [customer_name, item, quantity, location || null]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EXPORT CSV
router.get("/export/csv", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    let csv = "Customer Name,Item,Quantity,Location,Created At\n";

    result.rows.forEach(order => {
      csv += `${order.customer_name},${order.item},${order.quantity},${order.location || ""},${order.created_at}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("orders.csv");
    res.send(csv);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;