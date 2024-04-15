// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const axios = require('axios');

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pr@mit2000',
    database: 'my_database'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            res.status(500).send('Failed to sign up');
            throw err;
        }

        if (result.length > 0) {
            res.status(409).send('User already exists');
        } else {
            db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, result) => {
                if (err) {
                    res.status(500).send('Failed to sign up');
                    throw err;
                }
                res.status(200).send('User registered successfully');
            });
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, result) => {
        if (err) {
            res.status(500).send('Failed to log in');
            throw err;
        }

        if (result.length === 0) {
            res.status(401).send('Invalid email or password');
        } else {
            res.status(200).send('Login successful');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
