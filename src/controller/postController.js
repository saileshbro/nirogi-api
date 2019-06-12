const pool = require("../database/database");
module.exports.getPosts = async (req, res) => {
  // here send response according to query params
  // send particular post related informations
  try {
    const results = await pool.query(
      "select post_id,user_id,category_id,title,body,views,vote_count,comment_count,updated_at from posts"
    );
    if (results.length == 0) {
      return res.status(404).json({ error: "No posts found" });
    }
    return res.json(results);
  } catch (error) {
    return res.status(500).json({ error: "Internal server eror" });
  }
};
module.exports.createPost = async (req, res) => {
  const post_title = req.body.title;
  const category_id = req.body.category_id;
  const post_body = req.body.body;
  try {
    const result = await pool.query(
      "INSERT INTO posts SET user_id=?,category_id=?,title=?,body=?",
      [req.user.user_id, category_id, post_title, post_body]
    );
    if (result) {
      return res.json({
        post_id: result.insertId,
        title: post_title,
        body: post_body,
        category_id: category_id
      });
    } else {
      return res.status(500).json({ error: "Unable to create a post." });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};
module.exports.viewPost = async (req, res) => {
  try {
    const post_id = req.params.post_id;
    const post = await pool.query(
      "UPDATE posts SET views=views+1 WHERE post_id=?",
      [post_id]
    );
    const result = await pool.query(
      `SELECT DISTINCT  posts.post_id,
      posts.title,
      posts.body,
      posts.updated_at,
      posts.views,
      posts.vote_count,
      posts.comment_count,
      users.name,
      users.imageUrl,
      category.category_id,
      category.category
       FROM posts JOIN users ON
       posts.post_id=? AND
       posts.user_id=users.user_id
       JOIN category ON
       posts.post_id =? AND
       posts.category_id = category.category_id`,
      [post_id, post_id]
    );
    if (result.length == 0) {
      return res.status(404).json({ error: "Post not found." });
    }
    if (!(post && result)) {
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.json({ ...result[0] });
  } catch (error) {
    return res.status(500).json({ error: "Inteddrnal server error." });
  }
};
module.exports.upVotePost = async (req, res) => {
  const post_id = req.params.post_id;
  try {
    const ifPostExists = await pool.query(
      "SELECT * FROM posts WHERE post_id=?",
      [post_id]
    );
    if (ifPostExists.length == 0) {
      return res.status(403).send({ error: "Post not found" });
    }
    const result = await pool.query(
      "SELECT * FROM votes WHERE post_id=? AND user_id=?",
      [post_id, req.user.user_id]
    );
    if (result.length == 0) {
      const insert = await pool.query(
        "INSERT INTO votes SET post_id=?,user_id=?,value=?",
        [post_id, req.user.user_id, 1]
      );
      if (insert) {
        await pool.query(
          "UPDATE posts SET vote_count=vote_count+1 WHERE post_id=?",
          [post_id]
        );
        return res.send({ message: "Upvoted" });
      } else {
        return res.status(403).send({ error: "Unable to upvote" });
      }
    } else {
      if (result[0].value == 1) {
        return res.status(403).send({ error: "Already upvoted." });
      } else if (result[0].value == -1) {
        const update = await pool.query(
          "UPDATE votes SET value=? WHERE post_id=? AND user_id=?",
          [1, post_id, req.user.user_id]
        );
        if (update) {
          await pool.query(
            "UPDATE posts SET vote_count=vote_count+2 WHERE post_id=?",
            [post_id]
          );
          return res.send({ message: "Upvoted" });
        } else {
          return res.status(403).send({ error: "Unable to upvote" });
        }
      }
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};
module.exports.downVotePost = async (req, res) => {
  const post_id = req.params.post_id;
  try {
    const ifPostExists = await pool.query(
      "SELECT * FROM posts WHERE post_id=?",
      [post_id]
    );
    if (ifPostExists.length == 0) {
      return res.status(403).send({ error: "Post not found" });
    }
    const result = await pool.query(
      "SELECT * FROM votes WHERE post_id=? AND user_id=?",
      [post_id, req.user.user_id]
    );
    console.log(result);

    if (result.length == 0) {
      const insert = await pool.query(
        "INSERT INTO votes SET post_id=?,user_id=?,value=-1",
        [post_id, req.user.user_id, -1]
      );
      if (insert) {
        await pool.query(
          "UPDATE posts SET vote_count=vote_count-1 WHERE post_id=?",
          [post_id]
        );
        return res.send({ message: "Downvoted" });
      } else {
        return res.status(403).send({ error: "Unable to upvote" });
      }
    } else {
      if (result[0].value == -1) {
        return res.status(403).send({ error: "Already downvoted." });
      } else if (result[0].value == 1) {
        console.log("heh");

        const update = await pool.query(
          "UPDATE votes SET value=? WHERE post_id=? AND user_id=?",
          [-1, post_id, req.user.user_id]
        );

        if (update) {
          await pool.query(
            "UPDATE posts SET vote_count=vote_count-2 WHERE post_id=?",
            [post_id]
          );
          return res.send({ message: "Downvoted" });
        } else {
          return res.status(403).send({ error: "Unable to upvote" });
        }
      }
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};
module.exports.updatePost = async (req, res) => {
  const post_id = req.params.post_id;
  const post_title = req.body.title;
  const post_body = req.body.body;
  const user_id = req.user.user_id;
  try {
    const result = await pool.query(
      "UPDATE posts SET title=?,body=? WHERE post_id=? AND user_id=?",
      [post_title, post_body, post_id, user_id]
    );
    if (!result) {
      return res.status(404).send({ error: "Post not found." });
    }
    if (result.affectedRows == 0) {
      return res.status(403).send({ error: "Unable to update a post." });
    }
    if (result.affectedRows == 1) {
      return res.json({ message: "Sucessfully updated." });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};
module.exports.deletePost = async (req, res) => {
  const post_id = req.params.post_id;

  try {
    const result = await pool.query(
      "DELETE FROM posts WHERE post_id=? AND user_id=?",
      [post_id, req.user.user_id]
    );
    if (!result) {
      return res.status(404).send({ error: "Post not found." });
    }
    if (result.affectedRows == 0) {
      return res.status(403).send({ error: "Unable to delete a post." });
    }
    if (result.affectedRows == 1) {
      return res.json({ message: "Sucessfully deleted." });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};
