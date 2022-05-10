const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/authorization')

  
  router.get("/", authorization, async(req, res) => {
    try {
      const movies = await pool.query(
        "SELECT * FROM movies JOIN users ON movies.user_id = users.user_id  WHERE movies.user_id = $1",
        [req.user]
      )
      res.json(movies.rows);
    } catch (error) {
      console.error(error.message)
    }
  })


  router.get("/movie/:name", async(req, res) => {
    try {
      const {name} = req.params
      const movie = await pool.query(
        "SELECT * FROM movies WHERE movie_name = $1", [name]
      )
      res.json(movie.rows)
    } catch (error) {
      console.error(error.message)
    }
  })
  
  router.post("/", authorization, async(req, res) => {
    try {
      const {movieName,movieDescription, movieImage} = req.body
      const newMovie = await pool.query("INSERT INTO movies (movie_name, movie_description, movie_image, user_id) VALUES($1, $2, $3, $4) RETURNING *",
      [movieName, movieDescription, movieImage, req.user]
      );
      res.json(newMovie.rows[0])
    } catch (error) {
      console.error(error.message)
    }
  })

  router.delete("/:id",  async(req, res) => {
    try {
        const {id} = req.params
        await pool.query("DELETE FROM movies WHERE movie_id = $1", [id])
        res.json("movie deleted")
    } catch (error) {
        console.error(error.message)
    }
})
  
  router.put("/:id", authorization, async(req, res) => {
    try {
      const {id} = req.params
      const {movieName, movieDescription, movieImage} = req.body
      const updatedMovie = await pool.query("UPDATE movies SET movie_name = $1, movie_description = $2, movie_image = $3 WHERE movie_id = $4", 
        [movieName, movieDescription, movieImage, id])
        res.json("Movie updated")
    } catch (error) {
      console.error(error.message)
    }
  })

module.exports = router;