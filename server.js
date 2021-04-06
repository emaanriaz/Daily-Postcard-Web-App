// server.js
// where your node app starts

// include modules
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");
const sql = require("sqlite3").verbose();

// This creates an interface to the file if it already exists, and makes the file if it does not.
const postDB = new sql.Database("postcard.db");
let cmd =
  " SELECT name FROM sqlite_master WHERE type='table' AND name='PostCardTable' ";
postDB.get(cmd, function(err, val) {
  console.log(err, val);
  if (val == undefined) {
    console.log("No database file - creating one");
    createPostCardDB();
  } else {
    console.log("Database file found");
  }
});

function createPostCardDB() {
  const cmd =
    "CREATE TABLE PostCardTable ( queryString TEXT PRIMARY KEY, font TEXT, color TEXT, image TEXT, message TEXT)";
  postDB.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure", err.message);
    } else {
      console.log("Created database");
    }
  });
}

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + "/images");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
// let upload = multer({dest: __dirname+"/assets"});
let upload = multer({ storage: storage });

// begin constructing the server pipeline
const app = express();

// Serve static files out of public directory
app.use(express.static("public"));

// Also serve static files out of /images
app.use("/images", express.static("images"));

// Handle GET request to base URL with no other route specified
// by sending creator.html, the main page of the app
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/creator.html");
});

// Handle a post request to upload an image.
app.post("/upload", upload.single("newImage"), function(request, response) {
  console.log(
    "Recieved",
    request.file.originalname,
    request.file.size,
    "bytes"
  );
  if (request.file) {
    // file is automatically stored in /images,
    // even though we can't see it.
    // We set this up when configuring multer
    response.end("recieved " + request.file.originalname);
  } else throw "error";
});

// Handle a post request containing JSON
app.use(bodyParser.json());

// data now gets saved as a row of the database
app.post("/saveDisplay", function(req, res) {
  console.log("Server recieved", req.body);
  let font = req.body.font;
  let color = req.body.color;
  let image = req.body.image;
  let message = req.body.message;
  let r = Math.random()
    .toString(36)
    .substring(2);
  let queryString = r;
  let cmd =
    "INSERT INTO PostCardTable (queryString, font, color, image, message) VALUES(?, ?, ?, ?, ?)";
  postDB.run(cmd, queryString, font, color, image, message, function(err) {
    if (err) {
      console.log("DB insert error", err.message);
    } else {
      console.log("DB insert successful");
      res.send(queryString);
    }
  });
});

app.get("/sendUploadToAPI", function(request, response) {
  sendMediaStore("/images/" + request.file.originalname, request, response);
});

var imageName;

// function called when the button is pushed
// handles the upload to the media storage API
function sendMediaStore(filename, serverRequest, serverResponse) {
  let apiKey = process.env.ECS162KEY;
  if (apiKey === undefined) {
    serverResponse.status(400);
    serverResponse.send("No API key provided");
  } else {
    // we'll send the image from the server in a FormData object
    let form = new FormData();

    // we can stick other stuff in there too, like the apiKey
    form.append("apiKey", apiKey);
    // stick the image into the formdata object
    form.append("storeImage", fs.createReadStream(__dirname + filename));
    // and send it off to this URL
    form.submit(
      "http://ecs162.org:3000/images/eriaz/" + filename.name,
      function(err, APIres) {
        // did we get a response from the API server at all?
        if (APIres) {
          // OK we did
          console.log("API response status", APIres.statusCode);
          // the body arrives in chunks - how gruesome!
          // this is the kind stream handling that the body-parser
          // module handles for us in Express.
          let body = "";
          APIres.on("data", chunk => {
            body += chunk;
          });
          APIres.on("end", () => {
            // now we have the whole body
            if (APIres.statusCode != 200) {
              serverResponse.status(400); // bad request
              serverResponse.send(" Media server says: " + body);
            } else {
              serverResponse.status(200);
              serverResponse.send(body);
            }
          });
        } else {
          // didn't get APIres at all
          serverResponse.status(500); // internal server error
          serverResponse.send("Media server seems to be down.");
        }
      }
    );
  }
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

// gets row data based on query id
var rowData;
app.get("/getdb", function(request, response) {
  let queryID = '"' + request.query["id"] + '"';
  let cmd = "SELECT * FROM PostCardTable WHERE queryString = " + queryID;
  postDB.get(cmd, function(err, rowData) {
    if (err) {
      console.log("error: ", err.message);
      response.send("error - can't get data" + queryID);
    } else {
      console.log("row data = ", rowData);
      response.send(rowData);
    }
  });
});
