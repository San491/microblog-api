import express from "express";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import likeRoutes from "./routes/likes.js";
import commentRoutes from "./routes/comments.js";
import userRoutes from "./routes/user_account.js";
import relationshipsRoutes from "./routes/relationships.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import "dotenv/config";

const app = express();

//middleware

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(
  cors({
    // origin: "http://localhost:5173",
    // origin: "https://microblog-git-main-san491s-projects.vercel.app",
    origin: "https://microblog-tawny.vercel.app/",
    credentials: true,
  })
);

// FILE UPLOAD THROUGH MULTER
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../blog-vite-project/public/upload"); //to be updated
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/user", userRoutes);
app.use("/api/relationships", relationshipsRoutes);

app.use("/api/test", (req, res) => {
  res.send("It works.");
});

app.listen(8800, () => {
  console.log("API is working!");
});
