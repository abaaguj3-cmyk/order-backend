const express = require("express");
const router = express.Router();
const db = require("../db");

// CREATE order
router.post("/", async (req, res) => {
  const { customer_name, item, quantity } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO orders (customer_name, item, quantity) VALUES ($1, $2, $3) RETURNING *",
      [customer_name, item, quantity]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
});

// GET all orders
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching orders");
  }
});

module.exports = router;