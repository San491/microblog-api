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
// List of allowed origins
// const allowedOrigins = [
//   "https://microblog-git-main-san491s-projects.vercel.app/",
//   "https://microblog-cfzlmmhvt-san491s-projects.vercel.app/",
//   "http://localhost:5174/",
// ];

// // CORS middleware configuration
// const corsConfig = {
//   credentials: true,
//   origin: true,
// };
// app.use(cors(corsConfig));
app.use(
  cors({
    origin: "https://microblog-git-main-san491s-projects.vercel.app/",
    credentials: true,
  })
);

app.options("*", cors());

//middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  //
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Origin",
    "https://microblog-git-main-san491s-projects.vercel.app/"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  //
  next();
});
app.use(express.json());
app.use(cookieParser());

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

app.listen(8800, () => {
  console.log("API is working!");
});
