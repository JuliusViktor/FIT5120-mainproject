const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const https = require("https");
const fs = require("fs");
const app = express();
const port = 443; // Change to 443 for HTTPS
const pool = require("./database");

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use the express-session middleware to manage sessions
app.use(
    session({
        secret: "secret_key",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }, // Set to true if using HTTPS
    })
);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle login requests
app.post("/login", (req, res) => {
    const { password } = req.body;
    const correctPassword = "pwdta25";

    if (password === correctPassword) {
        req.session.authenticated = true;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.authenticated) {
        return next();
    } else {
        res.redirect("/");
    }
}

// Serve the protected homepage
app.get("/homepage.html", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "homepage.html"));
});

// Example database api
app.get("/api/insight-data", async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(
            "SELECT * FROM public.industry_job_final LIMIT 3"
        );
        const data = result.rows;
        client.release();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// HTTPS options
const httpsOptions = {
    key: fs.readFileSync('private.key'),
    cert: fs.readFileSync('certificate.crt'),
    ca: fs.readFileSync('ca_bundle.crt')
};

// Create HTTPS server
const server = https.createServer(httpsOptions, app);

// Change app.listen to server.listen
server.listen(port, () => {
    console.log(`HTTPS Server running on https://localhost:${port}`);
});