// import express from "express";
// import ImageKit from "imagekit";

// const app = express();

// const imagekit = new ImageKit({
//   urlEndpoint: process.env.urlEndpoint,
//   publicKey: process.env.publicKey,
//   privateKey: process.env.privateKey,
// });

// // allow cross-origin requests
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// app.get("/auth", function (req, res) {
//   var result = imagekit.getAuthenticationParameters();
//   res.send(result);
// });

// app.listen(3001, function () {
//   console.log("Live at Port 3001");
// });
