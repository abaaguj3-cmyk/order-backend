const express = require("express");
const router = express.Router();
const pool = require("../db");

/* ---------------- CREATE ---------------- */
router.post("/", async (req, res) => {
  try {
    const { customer_name, location, items } = req.body;

    const result = await pool.query(
      "INSERT INTO orders (customer_name, location, items, created_at) VALUES ($1,$2,$3,NOW()) RETURNING *",
      [customer_name, location, JSON.stringify(items)]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- READ ---------------- */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- DELETE ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM orders WHERE id=$1", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- EDIT ORDER ---------------- */
router.put("/:id", async (req, res) => {
  try {
    const { customer_name, location, items } = req.body;

    const result = await pool.query(
      `UPDATE orders 
       SET customer_name=$1, location=$2, items=$3
       WHERE id=$4
       RETURNING *`,
      [customer_name, location, JSON.stringify(items), req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;