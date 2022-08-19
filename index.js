const express = require("express");
const path = require("path");
const server = express();
const getColors = require("get-image-colors");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 5001;

// server.use(function (req, res,next) {
//   // Website you wish to allow to connect
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "*"
//   );
  // Request methods you wish to allow
  // res.setHeader(
  //   "Access-Control-Allow-Methods",
  //   "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  // );

  // Request headers you wish to allow
  // res.setHeader(
  //   "Access-Control-Allow-Headers",
  //   "X-Requested-With,content-type"
  // );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);
// });

// const corsOptions = {
//   origin: [
//     "http://127.0.0.1:5501",
//     "https://stellar-hotteok-ee8d14.netlify.app",
//   ],
//   methods: ["GET", "PUT", "POST"],
// };
server.use(cors());
server.use(bodyParser.json({ limit: "10mb" }));
server.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

const options = {
  count: 7,
  type: "image/jpeg",
};

let hslValuesArray = [];
let hexArray = [];

let notes = [];
let palette = [];

function getPalette(colors) {
  palette.push(colors);
}

function getNotes(hslArr) {
  console.log("hslArr", hslArr);
  if (0 <= hslArr[0] && hslArr[0] <= 29) {
    notes.push("F4");
  } else if (30 <= hslArr[0] && hslArr[0] <= 59) {
    notes.push("F4");
  } else if (60 <= hslArr[0] && hslArr[0] <= 89) {
    notes.push("G4");
  } else if (90 <= hslArr[0] && hslArr[0] <= 119) {
    notes.push("Gs4");
  } else if (120 <= hslArr[0] && hslArr[0] <= 149) {
    notes.push("A4");
  } else if (150 <= hslArr[0] && hslArr[0] <= 179) {
    notes.push("As4");
  } else if (180 <= hslArr[0] && hslArr[0] <= 209) {
    notes.push("B4");
  } else if (210 <= hslArr[0] && hslArr[0] <= 239) {
    notes.push("C5");
  } else if (240 <= hslArr[0] && hslArr[0] <= 269) {
    notes.push("Cs5");
  } else if (270 <= hslArr[0] && hslArr[0] <= 299) {
    notes.push("D5");
  } else if (300 <= hslArr[0] && hslArr[0] <= 329) {
    notes.push("Ds5");
  } else if (330 <= hslArr[0] && hslArr[0] <= 359) {
    notes.push("E5");
  }
}

server.post("/delete-image", (req, res) => {
  const filePath = "./out.jpeg";
  const fs = require("fs");

  fs.unlink(filePath, (err) => {
    if (err && err.code == "ENOENT") {
      console.info("Error! File doesn't exist.");
    } else if (err) {
      console.error("Something went wrong. Please try again later.");
    } else {
      console.info(`Successfully removed file with the path of ${filePath}`);
    }
  });
});
server.post("/upload-image", (req, res) => {
  console.log("REQUEST BODY", req.body);
  notes = [];
  palette = [];
  let base64Data = req.body.file.replace(
    /^data:image\/(png|jpg|jpeg);base64,/,
    ""
  );

  require("fs").writeFile("out.jpeg", base64Data, "base64", function (err) {
    getColors(path.join(__dirname, "out.jpeg"), options).then((colors) => {
      hexArray = colors.map((color) => color.hex());
      for (let i = 0; i < hexArray.length; i++) {
        getPalette(hexArray[i]);
      }
      hslValuesArray = colors.map((color) => color.hsl());
      for (let i = 0; i < hslValuesArray.length; i++) {
        getNotes(hslValuesArray[i]);
      }
      res.json({ notes });
    });
  });
});

server.get("/getnotes", (req, res) => {
  res.json({ notes });
});

server.get("/getPalette", (req, res) => {
  res.json({ palette });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

server.get("/getImage", (req, res) => {
  res.sendFile(__dirname + "/out.jpeg", function (err) {
    if (err) {
      // next(err);
    } else {
      console.log("Sent:");
    }
  });
});
