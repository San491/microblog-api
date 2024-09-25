import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const getLikes = (req, res) => {
  const q = "SELECT user_id_like FROM likes WHERE post_id_like = ?";

  db.query(q, [req.query.post_id_like], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.map((like) => like.user_id_like));
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, process.env.KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid.");

    const q = "INSERT INTO likes (`user_id_like`, `post_id_like`) VALUES (?)";

    const values = [userInfo.id, req.body.post_id_like];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Like updated.");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, process.env.KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid.");

    const q = "DELETE FROM likes WHERE user_id_like = ? AND post_id_like = ?";

    db.query(q, [userInfo.id, req.query.post_id_like], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Like deleted.");
    });
  });
};
