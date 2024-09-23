import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const getRelationships = (req, res) => {
  const q =
    "SELECT follower_userid FROM relationships WHERE followed_userid = ?";

  db.query(q, [req.query.followed_userid], (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json(data.map((relationship) => relationship.follower_userid));
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, process.env.KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid.");

    const q =
      "INSERT INTO relationships (`follower_userid`, `followed_userid`) VALUES (?)";

    const values = [userInfo.id, req.body.profile_userId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Following.");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, process.env.KEY, (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid.");

    const q =
      "DELETE FROM relationships WHERE follower_userid = ? AND followed_userid = ?";

    db.query(q, [userInfo.id, req.query.profile_userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Unfollowed.");
    });
  });
};
