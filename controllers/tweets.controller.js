const { Pool } = require("pg");

const dateNow = new Date();

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "admin",
  database: "mini_twitter",
  port: 5432,
});

const postTweet = async (req, res) => {
  const { tweet, username } = req.body;

  try {
    const userId = await pool.query(
      "SELECT * from users WHERE username = $1 limit 1",[username]
    );

    const response = await pool.query(
      `INSERT INTO tweets (userid, tweet, createdat, updatedat) 
        VALUES ($1, $2, $3, $4)
        RETURNING (
          SELECT username
          FROM users 
          WHERE userid = $1
        ) as username, tweetid, tweet, updatedat
      `,
      [userId.rows[0].userid, tweet, dateNow, dateNow]
    );
    res.json({
      message: "Tweet Succesfully",
      body: {
        username: response.rows[0].username,
        tweetid: response.rows[0].tweetid,
        tweet: response.rows[0].tweet,
        updatedat: response.rows[0].updatedat
      },
    });
  } catch (e) {
    res.json("failed to post a tweet");
  }
};

const getAllTweets = async (req, res) => {
  const response = await pool.query(
    `SELECT 
      u.username,
      t.tweetId,
      t.tweet,
      t.updatedat
    FROM tweets t
    JOIN users u ON t.userid = u.userid 
    order by t.tweetId desc, t.updatedat desc`
  );
  res.status(200).json(response.rows);
};

const updateTweet = async (req, res) => {
  const { tweet } = req.body;
  const id = req.params.id;

  try {
    const response = await pool.query(
      "UPDATE tweets SET tweet = $1, updatedat = $2 WHERE tweetid = $3",
      [tweet, dateNow, id]
    );
    res.json("success to update tweet");
  } catch (e) {
    res.json("failed to post a tweet");
  }
};

const deleteTweet = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await pool.query("DELETE FROM tweets WHERE tweetid = $1", [
      id,
    ]);
    res.json(`tweet ${id} deleted succesfully`);
  } catch (e) {
    res.json(e.message);
  }
};

module.exports = {
  postTweet,
  getAllTweets,
  updateTweet,
  deleteTweet,
};
