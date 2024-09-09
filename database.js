const { Pool } = require("pg");

const pool = new Pool({
  host: "database-fit5120.che4qeumkfjy.eu-central-1.rds.amazonaws.com",
  port: 5432,
  user: "postgres",
  password: "g5C5N49z",
  database: "testdb",
});

pool
  .connect()
  .then(() => {
    console.log("Connected to aws postgres");
  })
  .catch(() => {
    console.log("Can't connect to aws postgres");
  });

module.exports = pool;
