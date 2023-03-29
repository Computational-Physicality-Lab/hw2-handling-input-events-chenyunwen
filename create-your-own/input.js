/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/

const body = document.querySelector("body");
const targets = document.querySelectorAll(".target");

let clickOn = false;            // can do click or not
let isMouseDown = false;
let mouseX = 0, mouseY = 0;     // position when mouse down
let oriX = 0, oriY = 0;         // top-left position of target
let difX = 0, difY = 0;         // diff. between mouse pos and top-left of target
let targetID = -1;              // idx of currently interacting target
let oriWidth = 0, oriHeight = 0;

body.addEventListener("click", (event) => {
    if(!clickOn) return;
    console.log("Event: click");
    targets.forEach(target => { target.style.backgroundColor = "red";});
    const isTarget = event.target.classList.contains('target');
    // change the color of clicked target 
    if(isTarget) event.target.style.backgroundColor = "#00f";
    clickOn = false;
}, false);

body.addEventListener("mousemove", (e) => {
    if(!isMouseDown) return;
    if(e.clientX != mouseX && e.clientY != mouseY) clickOn = false;
    targets[targetID].style.top = (e.clientY - difY) + "px";
    targets[targetID].style.left = (e.clientX - difX) + "px";
}, false);

targets.forEach((target, index) => {
    target.addEventListener("mousedown", (e) => {
        console.log("Event: mousedown");
        clickOn = true;
        isMouseDown = true;
        targetID = index;
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
        isMouseDown = false;
    }, false);

    target.addEventListener("dblclick", (e) => {
        console.log("Event: dblclick");
    }, false);
    
});
