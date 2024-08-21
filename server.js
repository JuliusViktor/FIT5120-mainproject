const express = require('express');
const pool = require('./database');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

async function testGet(){
    const res = await pool.query("select * from public.user;")
    console.log(res.rows)
}

testGet()

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});