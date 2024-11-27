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
import ImageKit from "imagekit";
import "dotenv/config";

const app = express();

//middleware

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  //IMAGEKIT ADDITIONS
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  //
  next();
});
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "https://microblog-tawny.vercel.app",
    credentials: true,
  })
);
// UPLOAD IMAGEKIT

const imagekit = new ImageKit({
  urlEndpoint: process.env.urlEndpoint,
  publicKey: process.env.publicKey,
  privateKey: process.env.privateKey,
});

app.get("/api/upload/auth", function (req, res) {
  var result = imagekit.getAuthenticationParameters();
  res.send(result);
});

//

// FILE UPLOAD THROUGH MULTER
//
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "../blog-vite-project/public/upload"); //to be updated
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname);
//   },
// });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// app.post("/api/upload", upload.single("file"), (req, res) => {
//   const file = req.file;
//   res.status(200).json(file.filename);
// });

// upload post images
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    // checking if file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // uploading to imagekit
    const response = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/posts",
    });

    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: response.url, // URL of the uploaded image
    });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// upload profile images
app.post("/api/upload_profile", upload.single("file"), async (req, res) => {
  try {
    // checking if file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // uploading to imagekit
    const response = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/profileImages",
      overwriteFile: true,
    });

    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: response.url, // URL of the uploaded image
    });
  } catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

//

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
