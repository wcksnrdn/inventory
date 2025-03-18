const express = require('express');
const pool = require('../db');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

//* GET ALL INVENTORY (Admin & Staff)
router.get('/', authenticateUser, async (req, res) => {
    try {
        const inventory = await pool.query("SELECT * FROM inventory");
        res.json(inventory.rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching inventory", error: error.message });
    }
});

//* ADD INVENTORY (Hanya Admin)
router.post('/', authenticateUser, authorizeAdmin, async (req, res) => {
    const { name, quantity, price } = req.body;
    try {
        const newItem = await pool.query(
            "INSERT INTO inventory (name, quantity, price) VALUES ($1, $2, $3) RETURNING *",
            [name, quantity, price]
        );
        res.status(201).json({ message: "Item added", item: newItem.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error adding item", error: error.message });
    }
});

//* UPDATE INVENTORY (Hanya Admin)
router.put('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, quantity, price } = req.body;
    try {
        const updatedItem = await pool.query(
            "UPDATE inventory SET name = $1, quantity = $2, price = $3 WHERE id = $4 RETURNING *",
            [name, quantity, price, id]
        );
        res.json({ message: "Item updated", item: updatedItem.rows[0] });
    } catch (error) {
        res.status(500).json({ message: "Error updating item", error: error.message });
    }
});

//* DELETE INVENTORY (Hanya Admin)
router.delete('/:id', authenticateUser, authorizeAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM inventory WHERE id = $1", [id]);
        res.json({ message: "Item deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item", error: error.message });
    }
});

module.exports = router;
