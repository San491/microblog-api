import moment from "moment/moment.js";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const user_id = req.query.user_id;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid.");

    const q = user_id
      ? `SELECT p.*, u.user_id, name, profile_picture FROM posts AS p JOIN user_account as u ON (u.user_id = p.user_id_post) WHERE p.user_id_post = ? ORDER BY p.createdAt DESC`
      : `SELECT p.*, u.user_id, name, profile_picture FROM posts AS p JOIN user_account as u ON (u.user_id = p.user_id_post) 
      LEFT JOIN relationships AS r ON (p.user_id_post = r.followed_userid) WHERE r.follower_userid = ? OR p.user_id_post = ?
      ORDER BY p.createdAt DESC`;

    const values = user_id ? [user_id] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid.");

    const q =
      "INSERT INTO posts (`caption`, `image`, `createdAt`, `user_id_post`) VALUES (?)";

    const values = [
      req.body.caption,
      req.body.image,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid.");

    const q =
      "DELETE FROM posts WHERE `post_id`= ? AND `user_id_post` = ?";


    db.query(q, [req.params.post_id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can only delete your own post!");
    });
  });
};