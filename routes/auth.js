const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
require('dotenv').config();

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password} = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0){
            return res.status(401).json({ 
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: 'Incorrect password'
            });
        }

        const token = jwt.sign(
            {
            user_id: user.user_id,
            email: user.email 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error'
        })
    }
 });

 module.exports = router;