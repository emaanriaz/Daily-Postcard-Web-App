"use strict";

// Unicode characters we will use
const diamond = "\u27e1";
const cross = "\u2756";

// querySelector returns the first element that matches the 
// given CSS selector; in this case, the first span with id "fonts"
let currentFontIcon = document.querySelector("#fonts span");

// add event listeners
document.querySelectorAll("#fonts input").forEach(i => {
  // if status of one button changes, this will be called
  i.addEventListener("change", () => {
    // because these are radio buttons, i.checked is true for 
    // the one selected
    if (i.checked) {
      console.log("checked");
      // change diamonds
      // put the crossed diamond in front of this choice
      i.previousElementSibling.textContent = cross;
      // put the regular diamond in front of the last choice
      currentFontIcon.textContent = diamond;
      // and remember that this is the current choice
      currentFontIcon = i.previousElementSibling;

      document.querySelector("#message").className = i.value;
    }
  });
});

//CHANGE COLOR

const colors = [
  "#EC867F  ",
  "#ECAC7F  ",
  "#ECCB7F  ",
  "#F7EA89  ",
  "#BCDC82  ",
  "#7DA06D  ",
  "#44A08E  ",
  "#5ACFD5  ",
  "#64BEDE  ",
  "#4C72D7  ",
  "#6B52B4  ",
  "#BAA0DE  ",
  "#FCCDEF  ",
  "#FCCDD1  "
];

// querySelectorAll returns a list of all the elements with class color-box
const colorBoxes = document.querySelectorAll(".color-box");

colorBoxes.item(0).style.border = "1px solid black";
let currentColor = colorBoxes.item(0);

colorBoxes.forEach((b, i) => {
  b.style.backgroundColor = colors[i];

  
  b.addEventListener("click", () => {
    // colorBoxes.forEach((d) => {
    //   d.style.border = 'none'; })
    currentColor.style.border = "none";
    b.style.border = "1px solid black";
    document.querySelector(".postcard").style.backgroundColor = colors[i];
    currentColor = b;
  });

  b.addEventListener("mouseover", () => {
    b.style.border = "1px dashed black";
    document.querySelector(".postcard").style.backgroundColor = colors[i];
  });
  b.addEventListener("mouseout", () => {
    if (b != currentColor) {
      b.style.border = "none";
      document.querySelector(".postcard").style.backgroundColor =
        currentColor.style.backgroundColor;
    } else {
      b.style.border = "1px solid black";
    }
  });
});


// checks if DB exists when http response is loaded 
function checkDB() {
  let url = "/checkDB";
  let xhr = new XMLHttpRequest();
  xhr.open("GET",url);
  xhr.addEventListener("load", function() {
      let responseStr = xhr.responseText; 
  });
  xhr.send();
}

// UPLOAD postcard data
// When the user hits the button...
document.querySelector('#save').addEventListener('click', () => {
  let msg = document.querySelector('#message');
  let img = document.querySelector('#cardImg');
  let data = {
    image: img.src,
    color: currentColor.style.backgroundColor,
    font: msg.className,
    message: msg.innerText
  }
  console.log(data);
  
  // new HttpRequest instance 
  var xmlhttp = new XMLHttpRequest();   
  xmlhttp.open("POST", '/saveDisplay', true);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // setup callback function
  xmlhttp.onloadend = function(e) {
    console.log(xmlhttp.responseText);
    let responseStr = xmlhttp.responseText;
    let postCardLink = "https://daily-postcard-app.glitch.me/display.html?id="+responseStr;
    let x = postCardLink.link(postCardLink)
    document.getElementById("shareLink").innerHTML= "<a href=" + postCardLink + " target=\"_blank\">"+ postCardLink+ "</a>";
    on();
  }
  // all set up!  Send off the HTTP request
  xmlhttp.send(JSON.stringify(data));
})

// UPLOAD IMAGE
document.querySelector('#imgUpload').addEventListener('change', () => {
  
    // get the file with the file dialog box
    const selectedFile = document.querySelector('#imgUpload').files[0];
    // store it in a FormData object
    const formData = new FormData();
    formData.append('newImage',selectedFile, selectedFile.name);
  
    let button = document.querySelector('.btn');

    // build an HTTP request data structure
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload", true);
    xhr.onloadend = function(e) {
        // Get the server's response to the upload
        console.log(xhr.responseText);
        let newImage = document.querySelector("#cardImg");
        newImage.src = "https://daily-postcard-app.glitch.me/images/" +selectedFile.name;
        newImage.style.display = 'block';
        document.querySelector('.image').classList.remove('upload');
        button.textContent = 'Replace Image';
    }
  
    button.textContent = 'Uploading...';
    // actually send the request
    xhr.send(formData);
});


function sendGetRequest() {
  var image;
  let xhr = new XMLHttpRequest;
  xhr.open("GET","sendUploadToAPI");
  
  xhr.addEventListener("load", function() {
    let newImage = document.getElementById("serverImage");
    newImage.src = "http://ecs162.org:3000/images/eriaz/" + xhr.responseText;
    image = "http://ecs162.org:3000/images/eriaz/" + xhr.responseText; 
  });
  // Actually send request to server
  xhr.send();
}

function on() {
  document.getElementById("pop-up").style.display = "block";
}

function off() {
  document.getElementById("pop-up").style.display = "none";
}

var modal = document.getElementById("pop-up");
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}