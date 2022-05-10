const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/authorization')

router.get("/", authorization, async (req, res) => {
    try {
      const user = await pool.query(
        "SELECT (user_name) FROM users WHERE user_id = $1",
        [req.user] 
      );
     
      res.json(user.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

  router.get("/all", async(req, res) => {
    try {
      const movies = await pool.query("SELECT * FROM movies JOIN users ON movies.user_id = users.user_id")
      res.json(movies.rows)
    } catch (error) {
      console.error(error.message)
    }
  })

module.exports = router;