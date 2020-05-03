"use strict";

getInfoFromServer();

function getInfoFromServer() {
  let url = "postcardData";
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  // event listener for when http response is loaded
  xhr.addEventListener("load", function() {
    if (xhr.status == 200) {
      // success
      
      let jsonData = JSON.parse(xhr.responseText);
      let text = document.getElementById("editWriting");
      let postcard = document.getElementById("postcard");
      let im = document.getElementById("serverImage");
      
      text.style.fontFamily = jsonData.font;
      text.textContent = jsonData.message;
      postcard.style.backgroundColor = jsonData.color;
      im.src = jsonData.image;
      console.log("good");
    }
    else{
      console.log(xhr.responseText);
    }
  });
  xhr.send();
}

