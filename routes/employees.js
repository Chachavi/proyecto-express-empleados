const express = require('express');
const pool = require('../config/database');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM employees ORDER BY employee_id'
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.get('/search/:name', verifyToken, async (req, res) => {
    const { name } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM employees
            WHERE first_name ILIKE $1 OR last_name ILIKE $1
            ORDER BY employee_id`,
            [`%${name}%`]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { 
        first_name,
        last_name, 
        phone,
        email,
        address
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO employees (first_name, last_name, phone, email, address)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [first_name, last_name, phone, email, address]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    const {
        first_name,
        last_name,
        phone,
        email,
        address
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE employees
            SET 
            first_name = $1, 
            last_name = $2, 
            phone = $3, 
            email = $4, 
            address = $5
            WHERE employee_id = $6 
            RETURNING *`,
            [first_name, last_name, phone, email, address, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM employees
             WHERE employee_id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }

        res.json({
            message: 'Employee deleted'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

module.exports = router;