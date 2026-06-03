const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const app = express();

// ================= CONFIG =================
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// ================= MIDDLEWARE =================
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../frontend')));

// ================= DATABASE =================
const DB_PATH = path.join(__dirname, 'lost_and_found.db');
const db = new sqlite3.Database(DB_PATH);

// ================= INIT DB =================
function initDB() {
    db.serialize(() => {

        // USERS TABLE
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT,
                email TEXT UNIQUE,
                student_id TEXT,
                phone TEXT,
                password_hash TEXT,
                role TEXT DEFAULT 'student',
                is_active INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // LOST ITEMS
        db.run(`
            CREATE TABLE IF NOT EXISTS lost_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                item_name TEXT,
                category TEXT,
                description TEXT,
                date_lost TEXT,
                location_lost TEXT,
                contact_number TEXT,
                email TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // FOUND ITEMS
        db.run(`
            CREATE TABLE IF NOT EXISTS found_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                item_name TEXT,
                category TEXT,
                description TEXT,
                date_found TEXT,
                location_found TEXT,
                contact_number TEXT,
                email TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("✅ Database initialized");
    });
}

// ================= AUTO ADMIN CREATE =================
function createDefaultAdmin() {
    const email = "admin@gmail.com";
    const password = "Admin@123";

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
        if (user) {
            console.log("👤 Admin already exists");
            return;
        }

        const hash = await bcrypt.hash(password, 10);

        db.run(`
            INSERT INTO users (full_name, email, student_id, phone, password_hash, role, is_active)
            VALUES (?, ?, ?, ?, ?, 'admin', 1)
        `, [
            "Admin User",
            email,
            "ADMIN001",
            "9999999999",
            hash
        ]);

        console.log("🔥 Default admin created:");
        console.log("📧 Email: admin@gmail.com");
        console.log("🔑 Password: Admin@123");
    });
}

// ================= AUTH MIDDLEWARE =================
function auth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "No token" });

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data;
        next();
    } catch {
        return res.status(403).json({ error: "Invalid token" });
    }
}

// ================= AUTH ROUTES =================

// REGISTER
app.post('/api/auth/register', (req, res) => {
    const { full_name, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        db.run(
            `INSERT INTO users (full_name, email, password_hash)
             VALUES (?, ?, ?)`,
            [full_name, email, hash],
            (err) => {
                if (err) return res.status(400).json({ error: "User exists" });

                res.json({ success: true, message: "Registered" });
            }
        );
    });
});

// LOGIN
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    });
});

// ME
app.get('/api/auth/me', auth, (req, res) => {
    db.get("SELECT id, email, role FROM users WHERE id = ?", [req.user.id], (err, user) => {
        res.json(user);
    });
});

// ================= LOST ITEMS =================
app.get('/api/lost-items', (req, res) => {
    db.all("SELECT * FROM lost_items ORDER BY id DESC", [], (err, rows) => {
        res.json(rows);
    });
});

app.post('/api/lost-items', auth, (req, res) => {
    const { item_name, category, description } = req.body;

    db.run(`
        INSERT INTO lost_items (user_id, item_name, category, description)
        VALUES (?, ?, ?, ?)
    `, [req.user.id, item_name, category, description]);

    res.json({ success: true });
});

// ================= FOUND ITEMS =================
app.get('/api/found-items', (req, res) => {
    db.all("SELECT * FROM found_items ORDER BY id DESC", [], (err, rows) => {
        res.json(rows);
    });
});

app.post('/api/found-items', auth, (req, res) => {
    const { item_name, category, description } = req.body;

    db.run(`
        INSERT INTO found_items (user_id, item_name, category, description)
        VALUES (?, ?, ?, ?)
    `, [req.user.id, item_name, category, description]);

    res.json({ success: true });
});

// ================= HEALTH =================
app.get('/api/health', (req, res) => {
    res.json({ status: "OK" });
});

// ================= START =================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);

    initDB();
    createDefaultAdmin();
});