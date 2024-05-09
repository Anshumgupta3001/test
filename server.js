const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = 5502;

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'anshum1234',
    database: 'homework',
    port: 3306
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/procedure', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        console.log("Connected to database!"); 
        
        try {
            const [rows] = await connection.query('CALL homework.storedprocedure()');
            console.log(rows);

            connection.release();
            res.json(rows);
        } catch (error) {
            connection.release();
            console.error('Error calling stored procedure:', error);
            res.status(500).json({ error: 'An error occurred while calling the stored procedure' });
        }
    } catch (error) {
        console.error('Error connecting to database:', error);
        res.status(500).json({ error: 'Database connection error' });
    }
});

app.post('/save', async (req, res) => {
    const { firstName, lastName, email, country, city, gender, dob, age } = req.body;
    const connection = await pool.getConnection();
    
    try {
        await connection.query('INSERT INTO your_table_name (firstName, lastName, email, country, city, gender, dob, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, email, country, city, gender, dob, age]);
        connection.release();
        res.redirect(`/index2.html?firstName=${firstName}&lastName=${lastName}&email=${email}&country=${country}&city=${city}&gender=${gender}&dob=${dob}&age=${age}`);
    } catch (error) {
        connection.release();
        console.error('Error inserting data:', error);
        res.status(500).json({ error: 'An error occurred while inserting data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
