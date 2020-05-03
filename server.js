const express = require("express");
const app = express();
app.use(express.json());


// not needed now, but may be useful?
const assets = require("./assets");

// Multer is a module to read and handle FormData objects, on the server side
const multer = require("multer");

// Make a "storage" object that explains to multer where to store the images...in /images
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + "/images");
  },
  // keep the file's original name
  // the default behavior is to make up a random string
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

// Use that storage object we just made to make a multer object that knows how to
// parse FormData objects and store the files they contain
let uploadMulter = multer({ storage: storage });

// First, server any static file requests
app.use(express.static("public"));

// Next, serve any images out of the /images directory
app.use("/images", express.static("images"));

// Next, serve images out of /assets (we don't need this, but we might in the future)
app.use("/assets", assets);

// Next, if no path is given, assume we will look at the postcard creation page
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

// Next, handle post request to upload an image
// by calling the "single" method of the object uploadMulter that we made above
app.post("/upload", uploadMulter.single("newImage"), function(
  request,
  response
) {
  // file is automatically stored in /images
  console.log(
    "Recieved",
    request.file.originalname,
    request.file.size,
    "bytes"
  );
  // the file object "request.file" is truthy if the file exists
  if (request.file) {
    // Always send HTTP response back to the browser.  In this case it's just a quick note.
    response.end("Server recieved " + request.file.originalname);
  } else throw "error";
});

app.post("/shareInfo", function(req, res) {
  const fs = require("fs");
  let body = req.body;
  let data = JSON.stringify(body);
  fs.writeFile("./postcardData.json", data, function(err){
    if (err) throw err;   
  })
  
  res.send('Got a POST request')

});


app.get("/postcardData", function(req, res){
  const fs = require("fs");
  let text = fs.readFileSync("./postcardData.json");
  res.writeHead(200, {"Content-Type": "application/json"});
  res.write(text);
  if(res.body){
    res.end("server sent" + res.body);
  }
  else throw 'error:req.body undefined';
  res.send(text);
});

// listen for HTTP requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
