const pool = require("../database/database");
const timeago = require("../functions/timeAgo");
module.exports.viewPosts = async (req, res) => {
  const sort = req.query.sort;
  try {
    let sql = "";
    if (sort === "popular") {
      sql = `SELECT
      p.post_id,
      p.title,
      p.body,
      p.views,
      p.vote_count,
      p.comment_count,
      NOW()-p.created_at as created_at,
      cat.category_id,
      cat.category,
      u.user_id,
      u.name,
      u.address,
      u.imageUrl,
      v.value AS vote_status
      FROM posts AS p
      JOIN users AS u
      ON p.user_id=u.user_id
      LEFT join category as cat
      ON p.category_id = cat.category_id
      LEFT JOIN votes AS v
      ON v.post_id=p.post_id
      AND v.user_id=? AND v.comment_id=? ORDER BY p.views DESC`;
    } else {
      sql = `SELECT
      p.post_id,
      p.title,
      p.body,
      p.views,
      p.vote_count,
      p.comment_count,
      NOW()-p.created_at as created_at,
      cat.category_id,
      cat.category,
      u.user_id,
      u.name,
      u.address,
      u.imageUrl,
      v.value AS vote_status
      FROM posts AS p
      JOIN users AS u
      ON p.user_id=u.user_id
      LEFT join category as cat
      ON p.category_id = cat.category_id
      LEFT JOIN votes AS v
      ON v.post_id=p.post_id
      AND v.user_id=? AND v.comment_id=? ORDER BY p.created_at DESC`;
    }
    const results = await pool.query(sql, [req.user.user_id, 0]);
    if (results.length == 0) {
      return res.status(404).json({
        posts: []
      });
    }
    results.forEach(rslt => {
      rslt.can_modify_post = rslt.user_id === req.user.user_id;
      const category = {
        category: rslt.category,
        category_id: rslt.category_id
      };
      delete rslt.category;
      delete rslt.category_id;
      rslt.category = category;
      rslt.created_at = timeago(rslt.created_at);
    });
    return res.json({
      posts: results
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server eror"
    });
  }
};
module.exports.viewMyPosts = async (req, res) => {
  try {
    let sql = `SELECT
      p.post_id,
      p.title,
      p.body,
      p.views,
      p.vote_count,
      p.comment_count,
      NOW()-p.created_at as created_at,
      cat.category_id,
      cat.category,
      u.user_id,
      u.name,
      u.imageUrl,
      u.address,
      v.value AS vote_status
      FROM posts AS p
      JOIN users AS u
      ON p.user_id=u.user_id 
      AND u.user_id=?
      LEFT join category as cat
      ON p.category_id = cat.category_id
      LEFT JOIN votes AS v
      ON v.post_id=p.post_id
      AND v.user_id=? AND v.comment_id=? ORDER BY p.created_at DESC`;

    const results = await pool.query(sql, [
      req.user.user_id,
      req.user.user_id,
      0
    ]);
    if (results.length == 0) {
      return res.status(404).json({
        posts: []
      });
    }
    results.forEach(rslt => {
      rslt.can_modify_post = rslt.user_id === req.user.user_id;
      const category = {
        category: rslt.category,
        category_id: rslt.category_id
      };
      delete rslt.category;
      delete rslt.category_id;
      rslt.category = category;
      rslt.created_at = timeago(rslt.created_at);
    });
    return res.json({
      posts: results
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server eror"
    });
  }
};
module.exports.viewUserPosts = async (req, res) => {
  const user_id = req.params.user_id;
  try {
    let sql = `SELECT
      p.post_id,
      p.title,
      p.body,
      p.views,
      p.vote_count,
      p.comment_count,
      NOW()-p.created_at as created_at,
      cat.category_id,
      cat.category,
      u.user_id,
      u.name,
      u.imageUrl,
      v.value AS vote_status
      FROM posts AS p
      JOIN users AS u
      ON p.user_id=u.user_id 
      AND u.user_id=?
      LEFT join category as cat
      ON p.category_id = cat.category_id
      LEFT JOIN votes AS v
      ON v.post_id=p.post_id
      AND v.user_id=? AND v.comment_id=? ORDER BY p.created_at DESC`;

    const results = await pool.query(sql, [user_id, user_id, 0]);
    if (results.length == 0) {
      return res.status(404).json({
        posts: []
      });
    }
    results.forEach(rslt => {
      rslt.can_modify_post = rslt.user_id === req.user.user_id;
      const category = {
        category: rslt.category,
        category_id: rslt.category_id
      };
      delete rslt.category;
      delete rslt.category_id;
      rslt.category = category;
      rslt.created_at = timeago(rslt.created_at);
    });
    return res.json({
      posts: results
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server eror"
    });
  }
};
module.exports.viewCategoryPosts = async (req, res) => {
  const category_id = req.params.category_id;
  try {
    let sql = `SELECT
      p.post_id,
      p.title,
      p.body,
      p.views,
      p.vote_count,
      p.comment_count,
      NOW()-p.created_at as created_at,
      cat.category_id,
      cat.category,
      u.user_id,
      u.name,
      u.imageUrl,
      v.value AS vote_status
      FROM posts AS p
      JOIN users AS u
      ON p.user_id=u.user_id 
      INNER join category as cat
      ON p.category_id = cat.category_id 
      AND cat.category_id=?
      LEFT JOIN votes AS v
      ON v.post_id=p.post_id
      AND v.user_id=? AND v.comment_id=? ORDER BY p.created_at DESC`;

    const results = await pool.query(sql, [category_id, req.user.user_id, 0]);
    if (results.length == 0) {
      return res.status(404).json({
        posts: []
      });
    }
    results.forEach(rslt => {
      rslt.can_modify_post = rslt.user_id === req.user.user_id;
      const category = {
        category: rslt.category,
        category_id: rslt.category_id
      };
      delete rslt.category;
      delete rslt.category_id;
      rslt.category = category;
      rslt.created_at = timeago(rslt.created_at);
    });
    return res.json({
      posts: results
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server eror"
    });
  }
};
module.exports.createPost = async (req, res) => {
  const post_title = req.body.title;
  const category_id = req.body.category.category_id;
  const post_body = req.body.body;
  if (post_title.length == 0 || post_body.length == 0) {
    return res.status(403).send({
      error: "Unable to create a post."
    });
  }
  try {
    const result = await pool.query(
      "INSERT INTO posts SET user_id=?,category_id=?,title=?,body=?",
      [req.user.user_id, category_id, post_title, post_body]
    );

    if (result) {
      return res.json({
        message: "Sucessfully created."
      });
    } else {
      return res.status(500).json({
        error: "Unable to create a post."
      });
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
    const result = await pool.query(
      `SELECT
      p.post_id,
      p.title,
      p.body,
      p.views,
      p.vote_count,
      p.comment_count,
      NOW()-p.created_at as created_at,
      cat.category_id,
      cat.category,
      u.user_id,
      u.name,
      u.imageUrl,
      u.address,
      v.value AS vote_status
      FROM posts AS p
      JOIN users AS u
      ON p.user_id=u.user_id
      AND p.post_id=?
      LEFT join category as cat
      ON p.category_id = cat.category_id
      LEFT JOIN votes AS v
      ON v.post_id=p.post_id
      AND v.user_id=? AND v.comment_id=?`,
      [post_id, req.user.user_id, 0]
    );
    if (result.length == 0) {
      return res.status(404).json({
        error: "Post not found."
      });
    }
    if (!result) {
      return res.status(500).json({
        error: "Internal server error"
      });
    }
    let category = {};
    category.category_id = result[0].category_id;
    category.category = result[0].category;
    delete result[0].category_id;
    delete result[0].category;
    result[0].created_at = timeago(result[0].created_at);
    return res.json({
      ...result[0],
      can_modify_post: result[0].user_id === req.user.user_id,
      category
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error."
    });
  }
};
module.exports.incrementView = async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE posts SET views=views+1 WHERE post_id=?",
      [req.params.post_id]
    );
    if (result) {
      return res.send({ message: "increment" });
    } else {
      throw "Error occured";
    }
  } catch (error) {
    return res.setStatus(500).send({ error: error });
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
      return res.status(403).send({
        error: "Post not found"
      });
    }
    const result = await pool.query(
      "SELECT * FROM votes WHERE post_id=? AND user_id=? AND comment_id=?",
      [post_id, req.user.user_id, 0]
    );
    if (result.length == 0) {
      const insert = await pool.query(
        "INSERT INTO votes SET post_id=?,user_id=?,comment_id=?,value=?",
        [post_id, req.user.user_id, 0, 1]
      );
      if (insert) {
        await pool.query(
          "UPDATE posts SET vote_count=vote_count+1 WHERE post_id=?",
          [post_id]
        );
        return res.send({
          message: 1
        });
      } else {
        return res.status(403).send({
          error: "Unable to upvote"
        });
      }
    } else {
      if (result[0].value == 1) {
        return res.status(403).send({
          error: "Already upvoted."
        });
      } else if (result[0].value == -1) {
        const update = await pool.query(
          "UPDATE votes SET value=? WHERE post_id=? AND user_id=? AND comment_id=?",
          [1, post_id, req.user.user_id, 0]
        );
        if (update) {
          await pool.query(
            "UPDATE posts SET vote_count=vote_count+2 WHERE post_id=?",
            [post_id]
          );
          return res.send({
            message: 1
          });
        } else {
          return res.status(403).send({
            error: "Unable to upvote"
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
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
      return res.status(403).send({
        error: "Post not found"
      });
    }
    const result = await pool.query(
      "SELECT * FROM votes WHERE post_id=? AND user_id=? AND comment_id=?",
      [post_id, req.user.user_id, 0]
    );

    if (result.length == 0) {
      const insert = await pool.query(
        "INSERT INTO votes SET post_id=?,user_id=?,comment_id=?,value=?",
        [post_id, req.user.user_id, 0, -1]
      );
      if (insert) {
        await pool.query(
          "UPDATE posts SET vote_count=vote_count-1 WHERE post_id=?",
          [post_id]
        );
        return res.send({
          message: -1
        });
      } else {
        return res.status(403).send({
          error: "Unable to upvote"
        });
      }
    } else {
      if (result[0].value == -1) {
        return res.status(403).send({
          error: "Already downvoted."
        });
      } else if (result[0].value == 1) {
        const update = await pool.query(
          "UPDATE votes SET value=? WHERE post_id=? AND user_id=? AND comment_id=?",
          [-1, post_id, req.user.user_id, 0]
        );

        if (update) {
          await pool.query(
            "UPDATE posts SET vote_count=vote_count-2 WHERE post_id=?",
            [post_id]
          );
          return res.send({
            message: -1
          });
        } else {
          return res.status(403).send({
            error: "Unable to upvote"
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.updatePost = async (req, res) => {
  const post_id = req.params.post_id;
  const post_title = req.body.title;
  const post_body = req.body.body;
  const user_id = req.user.user_id;
  const category_id = req.body.category.category_id;
  if (!(post_title && post_body)) {
    return res.status(403).send({
      error: "Unable to update a post."
    });
  }
  try {
    const result = await pool.query(
      "UPDATE posts SET title=?,body=?,category_id=? WHERE post_id=? AND user_id=?",
      [post_title, post_body, category_id, post_id, user_id]
    );
    if (!result) {
      return res.status(404).send({
        error: "Post not found."
      });
    }
    if (result.affectedRows == 0) {
      return res.status(403).send({
        error: "Unable to update a post."
      });
    }
    if (result.affectedRows == 1) {
      return res.json({
        message: "Sucessfully updated."
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
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
      return res.status(404).send({
        error: "Post not found."
      });
    }
    if (result.affectedRows == 0) {
      return res.status(403).send({
        error: "Unable to delete a post."
      });
    }
    if (result.affectedRows == 1) {
      return res.json({
        message: "Sucessfully deleted."
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.getPostsVoteCount = async (req, res) => {
  const post_id = req.params.post_id;
  try {
    const result = await pool.query(
      "SELECT vote_count FROM posts WHERE post_id=?",
      [post_id]
    );
    if (result.length == 0) {
      return res.status(404).send({ error: "No post found" });
    } else return res.json({ message: result[0].vote_count });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};

module.exports.createComment = async (req, res) => {
  const post_id = req.params.post_id;
  const comment = req.body.comment;
  try {
    if (comment.length == 0) {
      return res.status(403).send({
        error: "Unable to comment."
      });
    }
    const result = await pool.query(
      "INSERT INTO comments SET post_id=?,user_id=?,comment=?",
      [post_id, req.user.user_id, comment]
    );
    if (result.affectedRows == 1) {
      await pool.query(
        "UPDATE posts SET comment_count=comment_count+1 WHERE post_id=?",
        [post_id]
      );
      return res.send({
        message: "Sucessfully created."
      });
    } else {
      return res.status(403).send({
        error: "Unable to comment."
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.getComment = async (req, res) => {
  const comment_id = req.params.comment_id;
  const post_id = req.params.post_id;
  try {
    const result = await pool.query(
      `SELECT
      u.user_id,
      u.name,
      u.imageUrl,
      u.address,
      p.post_id,
      c.comment_id,
      c.comment,
      c.vote_count,
      NOW()-c.created_at as created_at,
      v.value AS vote_status
      FROM comments AS c
      JOIN users AS u
      ON c.user_id=u.user_id
      AND c.comment_id=?
      JOIN posts AS p
      ON p.post_id=c.post_id
      AND p.post_id=?
      LEFT JOIN votes AS v
      ON v.comment_id=c.comment_id
      AND v.user_id=?`,
      [comment_id, post_id, req.user.user_id]
    );
    if (result.length == 0) {
      return res.status(404).send({
        error: "No comment found"
      });
    } else {
      result[0].created_at = timeago(result[0].created_at);
      return res.send(result[0]);
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error"
    });
  }
};
module.exports.getComments = async (req, res) => {
  const sort = req.query.sort;
  const post_id = req.params.post_id;
  let sql = "";
  try {
    if (sort === "time") {
      sql = `SELECT
      u.user_id,
      u.name,
      u.imageUrl,
      u.address,
      p.post_id,
      c.comment_id,
      c.comment,
      c.vote_count,
      NOW()-c.created_at as created_at,
      v.value AS vote_status
      FROM comments AS c
      JOIN users AS u
      ON c.user_id=u.user_id
      JOIN posts AS p
      ON p.post_id=c.post_id
      AND p.post_id=?
      LEFT JOIN votes AS v
      ON v.comment_id=c.comment_id
      AND v.user_id=? ORDER BY c.created_at DESC`;
    } else if (sort === "votes") {
      sql = `SELECT
      u.user_id,
      u.name,
      u.imageUrl,
      u.address,
      p.post_id,
      c.comment_id,
      c.comment,
      c.vote_count,
      NOW()-c.created_at as created_at,
      v.value AS vote_status
      FROM comments AS c
      JOIN users AS u
      ON c.user_id=u.user_id
      JOIN posts AS p
      ON p.post_id=c.post_id
      AND p.post_id=?
      LEFT JOIN votes AS v
      ON v.comment_id=c.comment_id
      AND v.user_id=? ORDER BY c.vote_count DESC`;
    }
    const result = await pool.query(sql, [post_id, req.user.user_id]);
    if (result.length == 0) {
      return res.status(404).json({
        comments: []
      });
    } else {
      result.forEach(rslt => {
        rslt.created_at = timeago(rslt.created_at);
        rslt.can_modify_comment = rslt.user_id === req.user.user_id;
      });
      return res.send({
        comments: result
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.editComment = async (req, res) => {
  const post_id = req.params.post_id;
  const comment_id = req.params.comment_id;
  const comment = req.body.comment;
  const user_id = req.user.user_id;
  try {
    const ifExist = await pool.query(
      "SELECT * FROM comments WHERE post_id=? AND comment_id=? AND user_id=?",
      [post_id, comment_id, user_id]
    );
    if (ifExist.length == 0) {
      return res.status(403).send({
        error: "Cannot edit comment."
      });
    }
    if (!comment) {
      return res.status(403).send({
        error: "Unable to update a comment."
      });
    }
    const result = await pool.query(
      "UPDATE comments SET comment=? WHERE post_id=? AND comment_id=?",
      [comment, post_id, comment_id]
    );
    if (result.affectedRows == 1) {
      return res.send({
        message: "Comment edited sucessfully."
      });
    } else {
      return res.status(403).send({
        error: "Cannot edit comment."
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.deleteComment = async (req, res) => {
  const user_id = req.user.user_id;
  const post_id = req.params.post_id;
  const comment_id = req.params.comment_id;
  try {
    const ifExists = await pool.query(
      "SELECT * FROM comments WHERE post_id=? AND user_id=? AND comment_id=?",
      [post_id, user_id, comment_id]
    );
    if (ifExists.length == 0) {
      return res.status(403).send({
        error: "Unable to delete a comment."
      });
    }
    const result = await pool.query(
      "DELETE FROM comments WHERE post_id=? AND user_id=? AND comment_id=?",
      [post_id, user_id, comment_id]
    );
    if (result.affectedRows == 1) {
      await pool.query(
        "UPDATE posts SET comment_count=comment_count-1 WHERE post_id=?",
        [post_id]
      );
      return res.send({
        message: "Sucessfully deleted."
      });
    } else {
      return req.status(404).send({
        error: "Unable to delete a comment."
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.upVoteComment = async (req, res) => {
  const post_id = req.params.post_id;
  const comment_id = req.params.comment_id;
  try {
    const ifCommentExists = await pool.query(
      "SELECT * FROM comments WHERE comment_id=?",
      [comment_id]
    );
    if (ifCommentExists.length == 0) {
      return res.status(403).send({
        error: "Comment not found"
      });
    }
    const result = await pool.query(
      "SELECT * FROM votes WHERE post_id=? AND user_id=? AND comment_id=?",
      [post_id, req.user.user_id, comment_id]
    );
    if (result.length == 0) {
      const insert = await pool.query(
        "INSERT INTO votes SET post_id=?,user_id=?,value=?,comment_id=?",
        [post_id, req.user.user_id, 1, comment_id]
      );
      if (insert) {
        await pool.query(
          "UPDATE comments SET vote_count=vote_count+1 WHERE comment_id=?",
          [comment_id]
        );
        return res.send({
          message: 1
        });
      } else {
        return res.status(403).send({
          error: "Unable to upvote"
        });
      }
    } else {
      if (result[0].value == 1) {
        return res.status(403).send({
          error: "Already upvoted."
        });
      } else if (result[0].value == -1) {
        const update = await pool.query(
          "UPDATE votes SET value=? WHERE post_id=? AND user_id=? AND comment_id=?",
          [1, post_id, req.user.user_id, comment_id]
        );
        if (update) {
          await pool.query(
            "UPDATE comments SET vote_count=vote_count+2 WHERE comment_id=?",
            [comment_id]
          );
          return res.send({
            message: 1
          });
        } else {
          return res.status(403).send({
            error: "Unable to upvote"
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.downVoteComment = async (req, res) => {
  const post_id = req.params.post_id;
  const comment_id = req.params.comment_id;
  try {
    const ifCommentExists = await pool.query(
      "SELECT * FROM comments WHERE comment_id=?",
      [comment_id]
    );
    if (ifCommentExists.length == 0) {
      return res.status(403).send({
        error: "Comment not found"
      });
    }
    const result = await pool.query(
      "SELECT * FROM votes WHERE post_id=? AND user_id=? AND comment_id=?",
      [post_id, req.user.user_id, comment_id]
    );
    if (result.length == 0) {
      const insert = await pool.query(
        "INSERT INTO votes SET post_id=?,user_id=?,value=?,comment_id=?",
        [post_id, req.user.user_id, -1, comment_id]
      );
      if (insert) {
        await pool.query(
          "UPDATE comments SET vote_count=vote_count-1 WHERE comment_id=?",
          [comment_id]
        );
        return res.send({
          message: -1
        });
      } else {
        return res.status(403).send({
          error: "Unable to downvote"
        });
      }
    } else {
      if (result[0].value == -1) {
        return res.status(403).send({
          error: "Already downvoted."
        });
      } else if (result[0].value == 1) {
        const update = await pool.query(
          "UPDATE votes SET value=? WHERE post_id=? AND user_id=? AND comment_id=?",
          [-1, post_id, req.user.user_id, comment_id]
        );
        if (update) {
          await pool.query(
            "UPDATE comments SET vote_count=vote_count-2 WHERE comment_id=?",
            [comment_id]
          );
          return res.send({
            message: -1
          });
        } else {
          return res.status(403).send({
            error: "Unable to downvote"
          });
        }
      }
    }
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error."
    });
  }
};
module.exports.getCommentVoteCount = async (req, res) => {
  const comment_id = req.params.comment_id;
  try {
    const result = await pool.query(
      "SELECT vote_count FROM comments WHERE comment_id=?",
      [comment_id]
    );
    if (result.length == 0) {
      return res.status(404).send({ error: "No comment found" });
    } else return res.json({ message: result[0].vote_count });
  } catch (error) {
    return res.status(500).send({ error: "Internal server error." });
  }
};
