// NOTE: The variable "shirts" is defined in the shirts.js file as the full list of shirt offerings
//       You can access this variable here, and should use this variable here to build your webpages

let initProducts = () => {
    // To see the shirts object, run:
    // console.log(shirts);

    // Your Code Here
    console.log(shirts.length);
    for(var i = 0; i < shirts.length; i++){
        var colorNum = (shirts[i].colors) ? Object.keys(shirts[i].colors).length : null;
        if(!colorNum) {
            console.log("No color");
            continue;
        }
        var v = Object.values(shirts[i].colors)[0];
        console.log(v.front);
        var temp = (colorNum > 1) ? "colors" : "color";
        var pic = (v.front) ? v.front : "shirt_images/not-found.png"
        var name = shirts[i].name ? shirts[i].name : "Not Found :("; 
        document.getElementById('t-shirt-container').innerHTML += 
        '<div class="t-shirt-block"> \
            <a href="./details.html?type=' + i + '" style="height: auto; width: auto; "><img src="./' + pic + '" alt="shirt"></a> \
            <p class="t-shirt-title"> ' + name + '</p> \
            <p class="t-shirt-text">Available in ' + colorNum + ' ' + temp + '</p> \
            <div class="container" style="margin: 10px; flex-direction: row; justify-content: space-evenly;"> \
                <button type="button" onclick="open_quick(' + i +')" class="product-btn">Quick View</button> \
                <a href="./details.html?type=' + i + '" class="product-btn"> \
                <span>See Page</span> \
                </a> \
            </div> \
        </div>'
    }
};

let initDetails = () => {
    // To see the shirts object, run:
    // console.log(shirts);

    // Your Code Here
    var vars = window.location.search.substring(1).split("=");
    var shirt = shirts[Number(vars[1])];
    document.getElementById('shirt-name').innerHTML = shirt.name ? shirt.name : "Not Found :(";
    document.getElementById('shirt-price').innerHTML = shirt.price ? shirt.price : "$9999";
    document.getElementById('t-shirt-description').innerHTML = shirt.description ? shirt.description : "Nothing QQ";
    
    var v = Object.values(shirt.colors)[0].front;
    var pic = (v) ? v : "shirt_images/not-found.png";
    document.getElementById('shirt-img').src = pic;
    var clen = Object.keys(shirt.colors).length;
    for(var i = 0; i < clen; i++){
        document.getElementById('color-btn-container').innerHTML += 
            '<button type="button" onclick="change_img(\''+ Object.keys(shirt.colors)[i] +'\')" class="t-shirt-choose-btn choose-color" style="background: '+ Object.keys(shirt.colors)[i] +';">'
            + Object.keys(shirt.colors)[i] +'</button>';
    }
    
    localStorage.setItem('type_id', Number(vars[1]));
    localStorage.setItem('color', Object.keys(shirt.colors)[0]);
    localStorage.setItem('fb', 'front');
};


let change_img = (values) => {
    var type_id = localStorage.getItem('type_id');
    var color = localStorage.getItem('color');
    if(values === "front"){
        localStorage.setItem('fb', 'front');
        var v = shirts[type_id].colors[color].front;
        var pic = (v) ? v : "shirt_images/not-found.png";
        document.getElementById('shirt-img').src = pic;

    } else if(values === "back"){
        console.log(type_id);
        localStorage.setItem('fb', 'back');
        var v = shirts[type_id].colors[color].back;
        var pic = (v) ? v : "shirt_images/not-found.png";
        document.getElementById('shirt-img').src = pic;

    } else {
        // change color
        var fb = localStorage.getItem('fb');
        localStorage.setItem('color', values);
        color = values;
        var v = (localStorage.getItem('fb') == 'front') ? shirts[type_id].colors[color].front : shirts[type_id].colors[color].back;
        var pic = (v) ? v : "shirt_images/not-found.png";
        document.getElementById('shirt-img').src = pic;
    }

    console.log(localStorage.getItem('type_id'));
    console.log(localStorage.getItem('color'));
    console.log(localStorage.getItem('fb'));
    
}

let open_quick = (t_shirt_id) =>{
    var shirt = shirts[t_shirt_id];
    var Name = shirt.name ? shirt.name : "Not Found :(";
    var Price = shirt.price ? shirt.price : "$9999";
    var Description = shirt.description ? shirt.description : "Nothing QQ";
    var v = Object.values(shirt.colors)[0];
    var front_pic = (v.front) ? v.front : "shirt_images/not-found.png";
    var back_pic = (v.back) ? v.back : "shirt_images/not-found.png";

    document.getElementById('quick-div').innerHTML = 
    '<div id="quick-view-window" style="height: 250px; width: auto; background-color: whitesmoke"> \
    <div class="container" style="flex-direction: row; height: 100%; margin-left: 50px; margin-right: 50px;"> \
      <a href="./details.html?type=' + t_shirt_id + '" style="height: 80%;"><img src="./' + front_pic + '" style="height: 100%;" alt="shirt"></a>\
      <a href="./details.html?type=' + t_shirt_id + '" style="height: 80%;"><img src="./' + back_pic + '" style="height: 100%;" alt="shirt"></a> \
      <div style="height: 80%; margin-left: 30px; margin-right: 30px;"> \
        <p id="quick-name">' + Name + '</p> \
        <p id="quick-price">' + Price + '</p> \
        <p id="quick-description">' + Description + '</p>\
        <button type="button" onclick="close_quick()" class="t-shirt-choose-btn" style="margin: 0px; margin-top: 10px; margin-bottom: 10px;">Close</button>\
      </div>\
    </div>\
  </div>';
  jump_window();
}

function jump_window(){
    document.getElementById("quick-div").scrollIntoView({behavior: 'smooth'});
}


let close_quick = () =>{
    document.getElementById('quick-view-window').style.display = "none";    
}