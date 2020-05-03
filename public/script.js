// Always include at top of Javascript file
"use strict";

function sendInfo() {
  console.log("sending info");
  const xhr = new XMLHttpRequest();

  let info = {
    image: document.getElementById("serverImage").src,
    color: document.getElementById("postcard").style.backgroundColor,
    font: document.getElementById("editWriting").style.fontFamily,
    message: document.getElementById("editWriting").textContent
  };

  var postCardJSON = JSON.stringify(info);
  xhr.open("POST", "/shareInfo", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onloadend = function(e) {
    console.log("Success\n");
  };
  xhr.send(postCardJSON);
}

// UPLOAD IMAGE using a post request
// Called by the event listener that is waiting for a file to be chosen

var chooseLabel = document.getElementById("chooseImage");
function uploadFile() {
  const selectedFile = document.getElementById("fileChooser").files[0];
  const formData = new FormData();
  formData.append("newImage", selectedFile, selectedFile.name);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload", true);
  chooseLabel.innerHTML = "Uploading...";

  xhr.onloadend = function(e) {
    console.log(xhr.responseText);
    let newImage = document.getElementById("serverImage");
    newImage.src = "../images/" + selectedFile.name;
    chooseLabel.innerHTML = "Replace Image";
  };

  // actually send the request
  xhr.send(formData);
}

function changeFont() {
  // changes font of text
  var text = document.getElementById("editWriting");

  document.getElementById("font1").addEventListener("click", function() {
    text.style.fontFamily = "'Indie Flower', sans-serif";
  });

  document.getElementById("font2").addEventListener("click", function() {
    text.style.fontFamily = "'Dancing Script', sans-serif";
  });

  document.getElementById("font3").addEventListener("click", function() {
    text.style.fontFamily = "'Long cang', sans-serif";
  });

  document.getElementById("font4").addEventListener("click", function() {
    text.style.fontFamily = "'Homemade Apple', sans-serif";
  });
}

function changeColor(newColor, id) {
  var card = document.getElementById("postcard");
  card.style.backgroundColor = newColor;

  // document.getElementById(id).style.border= "1px solid";

  for (let i = 1; i < 10; i++) {
    if (toString(i) == id) {
      document.getElementById(id).style.outline = "1px solid";
    }
  }
}

// Add event listener to the file input element
document.getElementById("fileChooser").addEventListener("change", uploadFile);

document.getElementById("sharebutton").addEventListener("click", function() {
  sendInfo();
  window.location.href = "display.html";
});
changeFont();
