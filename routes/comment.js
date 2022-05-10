const router = require('express').Router()
const pool = require('../db')
const authorization = require('../middleware/authorization')

router.get("/:movie", async(req,res) => {
    try {
        const{movie} = req.params
        const comments = await pool.query(
"SELECT * FROM comments INNER JOIN  users ON comments.user_id = users.user_id INNER JOIN movies ON comments.movie_id = movies.movie_id WHERE movie_name = $1",
       [movie] )
       res.json(comments.rows)
    } catch (error) {
        console.error(error.message)
    }
})

router.get("/id/:movie", async (req, res) => {
    try {
        const { movie } = req.params
        const movieId = await pool.query("SELECT movie_id FROM movies WHERE movie_name = $1", [movie])
         res.json(movieId.rows[0])
        console.log(roles)
    } catch (error) {
        console.error(error.message)
    }
})

router.post("/", authorization, async(req, res) => {
    try {
        const {commentText, filmId} = req.body
        const newComment = await pool.query("INSERT INTO comments (comment_text, movie_id, user_id) VALUES($1, $2, $3) RETURNING *",
        [commentText, filmId, req.user])
        res.json(newComment.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

router.delete("/:id", async(req, res) => {
    try {
        const{id} = req.params
        await pool.query("DELETE FROM comments WHERE comment_id = $1", [id] )
        res.json("Comment deleted")
    } catch (error) {
        console.error(error.message)
    }
})

module.exports = router;