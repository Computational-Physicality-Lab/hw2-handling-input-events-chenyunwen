/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/

const body = document.querySelector("body");
const targets = document.querySelectorAll(".target");

let isMoved = false;            // can do click or not
let isMouseDown = false;
let isDoubleClick = false;
let mouseX = 0, mouseY = 0;     // position when mouse down
let oriX = 0, oriY = 0;         // top-left position of target
let difX = 0, difY = 0;         // diff. between mouse pos and top-left of target
let targetID = -1;              // idx of currently interacting target
let oriWidth = 0, oriHeight = 0;

body.addEventListener("click", (event) => {
    console.log("Event: click");
    console.log(event.detail);
    
    const isTarget = event.target.classList.contains('target');
    if(!isMoved && !isTarget ) {
        // click background
        targets.forEach(target => { target.style.backgroundColor = "red";});
    } else if(!isMoved && isTarget) {
        // change the color of clicked target 
        targets.forEach(target => { target.style.backgroundColor = "red";});
        event.target.style.backgroundColor = "#00f";
    }
    isMoved = false;
}, false);

body.addEventListener("mousemove", (e) => {
    if(!isMouseDown && !isDoubleClick) return;
    isMoved = true;
    targets[targetID].style.top = (e.clientY - difY) + "px";
    targets[targetID].style.left = (e.clientX - difX) + "px";
}, false);

document.onkeydown = (e) => {
    if(e.keyCode == 27) {
        console.log("Event: ESC");
        if(isMouseDown || isDoubleClick){
            targets[targetID].style.top = oriY + "px";
            targets[targetID].style.left = oriX + "px";
            isMouseDown = false;
            isDoubleClick = false;
        }
    }
};

// for touchscreen devices
document.addEventListener( "touchstart", (event) => {
    console.log("Event: touchstart");
    if (event.touches.length === 1) { // first finger
    //   …
    } else if (event.touches.length === 2) { //second finger
    //   …
    }
});   

targets.forEach((target, index) => {
    target.addEventListener("mousedown", (e) => {
        if(isDoubleClick) return;
        console.log("Event: mousedown");
        isMouseDown = true;
        targetID = index;
        console.log(index);
        oriX = e.target.style.left.split("px")[0];
        oriY = e.target.style.top.split("px")[0];
        mouseX = e.clientX;
        mouseY = e.clientY;
        difX = mouseX - oriX;
        difY = mouseY - oriY;
        oriWidth = toString(e.target.style.width.split("px")[0]);
        oriHeight = toString(e.target.style.height.split("px")[0]);
    }, false);

    target.addEventListener("mouseup", (e) => {
        console.log("Event: mouseup");
        console.log(index);
        if(isDoubleClick) isDoubleClick = false;
        isMouseDown = false;
    }, false);

    target.addEventListener("dblclick", (e) => {
        console.log("Event: dblclick");
        isDoubleClick = true;
    }, false);
    
});
