import moment from "moment/moment.js";
import { db } from "./../connect.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const getComments = (req, res) => {
  const q = `SELECT c.*, u.user_id, name, profile_picture FROM comments AS c JOIN user_account AS u ON (u.user_id = c.user_id_comment) WHERE c.post_id_comment = ? ORDER BY c.createdAt DESC`;

  db.query(q, [req.query.post_id_comment], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, process.env.KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid.");

    const q =
      "INSERT INTO comments (`text`, `createdAt`, `user_id_comment`, `post_id_comment`) VALUES (?)";

    const values = [
      req.body.text,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.post_id_comment,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created.");
    });
  });
};
