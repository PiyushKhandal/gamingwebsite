import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
});

pool.connect(err => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err);
    } else {
        console.log('Connected to PostgreSQL');
    }
});

// User Registration
app.post('/api/register', async (req, res) => {
    const { user_name, user_password, user_email } = req.body;

    try {
        // Check if username already exists
        const userCheck = await pool.query("SELECT * FROM users WHERE user_name = $1", [user_name]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: "Username already taken" });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(user_password, 10);

        // Insert new user into the database
        const result = await pool.query(
            "INSERT INTO users (user_name, user_password, user_email) VALUES ($1, $2, $3) RETURNING *",
            [user_name, hashedPassword, user_email]
        );

        res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// User login
app.post("/api/login", async (req, res) => {
    const { user_name, user_password } = req.body;

    try {
        // Fetch user from the database
        const userQuery = await pool.query("SELECT * FROM users WHERE user_name = $1", [user_name]);

        // Check if user exists
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        const user = userQuery.rows[0];

        // Compare password with the stored hash
        const validPassword = await bcrypt.compare(user_password, user.user_password);

        if (!validPassword) {
            return res.status(400).json({ error: "Invalid password" });
        }

        res.json({ message: "Login successful", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});
// Serve static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..','frontend', 'index.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..','frontend', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..','frontend', 'index.html'));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
