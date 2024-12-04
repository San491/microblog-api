import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const register = (req, res) => {
  //CHECK IF USER EXISTS
  const q = "SELECT * FROM user_account WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists.");

    // ^ data.length instead of data.length > 1

    //CREATE A NEW USER
    //Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO user_account (`username`, `email`, `password`, `name`) VALUE (?)";

    // "INSERT INTO user_account (`username`, `email`, `password`, `name`) VALUE (?)";

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];

    if (
      req.body.username != "" &&
      req.body.email != "" &&
      req.body.password != ""
    ) {
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been created. You can now sign in.");
      });
    }
  });
};

//LOGIN USER
export const login = (req, res) => {
  const q = "SELECT * FROM user_account WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkPassword)
      return res.status(400).json("Wrong password or username.");

    const token = jwt.sign({ id: data[0].user_id }, process.env.KEY); // JWT TOKEN

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json(others);
  });
};

//LOGOUT USER
export const logout = (req, res) => {
  return res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};
