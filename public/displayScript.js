// This code runs as soon as the page is loaded, when 
// the script tag in the HTML file is executed. 

let x = document.URL;
let url = "/getdb?" + x.split("?")[1];  // splits url on ? and gets queryID
let xhr = new XMLHttpRequest();
xhr.open("GET", url);

xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

// set up callback function that will run when the HTTP response comes back
xhr.onloadend = function(e) {
  console.log(xhr.responseText);
  let data = JSON.parse(xhr.responseText);
  let postcardImage = document.getElementById("cardImg");
  let postcardMessage = document.getElementById("message");
  
  postcardImage.style.display = 'block';
  postcardImage.src = data.image;
  postcardMessage.innerText = data.message; 
  postcardMessage.className = data.font;
  document.querySelector(".postcard").style.backgroundColor = data.color;
  
}

// send off request
xhr.send();


