const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "admin",
  database: "mini_twitter",
  port: 5432,
});

const getUsers = async (req, res) => {
  const response = await pool.query("SELECT * FROM users");
  res.status(200).json(response.rows);
};

const getUserByUsername = async (req, res) => {
  const { username, password } = req.body;

  try {
    const response = await pool.query(
      "SELECT * FROM users where username = $1 AND password = $2 limit 1",
      [username, password]
    );
    if (response.rowCount === 0) return res.send({ message: "user is not exist" });
    
    res.send({
      token: "loginToken",
      username: response.rows[0].username,
      message: "",
    });
  } catch (e) {
    res.send({ message: "user is not exist" });
  }
};

const createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, password]
    );
    res.send({ message: "" });
    
  } catch (e) {
    res.send({ message: "user already exist" });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { password } = req.body;

  try {
    const response = await pool.query(
      "UPDATE users SET password = $1 WHERE userid = $2",
      [password, id]
    );
    res.json("Password Updated Succesfully");
  } catch (e) {
    res.json(e.message);
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await pool.query("DELETE FROM users WHERE userid = $1", [
      id,
    ]);
    res.json(`User ${id} User deleted succesfully`);
  } catch (e) {
    res.json(e.message);
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserByUsername,
  deleteUser,
  updateUser,
};
