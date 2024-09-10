const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const port = 3000;

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use the express-session middleware to manage sessions
app.use(
    session({
        secret: "secret_key",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Set to true if using HTTPS
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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
