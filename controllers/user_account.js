import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const user_id = req.params.user_id;
  const q = "SELECT * FROM user_account WHERE user_id = ?";

  db.query(q, [user_id], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid.");

    const q =
      "UPDATE user_account SET `name` = ?, `location` = ?, `website` = ?, `profile_picture` = ?, `cover_picture` = ? WHERE `user_id` = ?";

    db.query(q, [
      req.body.name,
      req.body.location,
      req.body.website,
      req.body.coverPic,
      req.body.profilePic,
      userInfo.id,
    ]),
      (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can only update your own profile!");
      };
  });
  return res.status(200).json("SIGNAL RECEIVED");
};
