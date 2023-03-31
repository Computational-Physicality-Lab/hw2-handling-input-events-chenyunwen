/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/

const body = document.querySelector("body");
const targets = document.querySelectorAll(".target");

let mode = 0;                   // 0 = mouse, 1 = touch

let isMoved = false;            // can do click or not
let isMouseDown = false;
let isDoubleClick = false;
let mouseX = 0, mouseY = 0;     // position when mouse down
let oriX = 0, oriY = 0;         // top-left position of target
let difX = 0, difY = 0;         // diff. between mouse pos and top-left of target
let SelectedID = -1;            // idx of currently selecting target
let targetID = -1;              // idx of currently interacting target
let oriWidth = 0, oriHeight = 0;

let touchStart = false;

document.addEventListener("click", (event) => {
    console.log("Event: click");
    // console.log(event.detail);
    /*if(mode == 0){
        // mouse mode
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
    } else {*/
        // touch mode
        const isTarget = event.target.classList.contains('target');
        if(!isMoved && !isTarget ) {
            // click background
            if(targets[SelectedID]) targets[SelectedID].style.backgroundColor = "red";
            SelectedID = -1;
            // targets.forEach(target => { target.style.backgroundColor = "red";});
        }
        isMoved = false;
    // }
    
}, false);

document.addEventListener("mousemove", (e) => {
    if(!isMouseDown && !isDoubleClick) return;
    isMoved = true;
    targets[targetID].style.top = (e.clientY - difY) + "px";
    targets[targetID].style.left = (e.clientX - difX) + "px";
}, false);

document.onkeydown = (e) => {
    if(e.keyCode == 27) {
        console.log("Event: ESC");
        if(isMoved/*isMouseDown || isDoubleClick*/){
            targets[targetID].style.top = oriY + "px";
            targets[targetID].style.left = oriX + "px";
            isMouseDown = false;
            touchStart = false;
            isDoubleClick = false;
            // isMoved = false;
        }
    }
};

document.addEventListener("touchstart", (e) => {
    mode = 1;
    console.log("Event: document.touchstart");
    // if (e.touches.length === 1) { // first finger
    //     console.log("first finger");
    // } else 
    if (e.touches.length === 2) { //second finger
        console.log("document second finger");
        if(isMoved/*isMouseDown || isDoubleClick*/){
            targets[targetID].style.top = oriY + "px";
            targets[targetID].style.left = oriX + "px";
            isMouseDown = false;
            touchStart = false;
            isDoubleClick = false;
            isMoved = false;
        }
    }
});

document.addEventListener("touchmove", (e) => {
    // mode = 1;
    if(!touchStart && !isDoubleClick) return;
    console.log("Event: touchmove");
    
    isMoved = true;
    // console.log("top: " + targets[targetID].style.top);
    // console.log("e.clientY - difY = " + (e.changedTouches[0].clientY - difY));
    targets[targetID].style.top = (e.changedTouches[0].clientY - difY) + "px";
    targets[targetID].style.left = (e.changedTouches[0].clientX - difX) + "px";
});

function stopTouchClick(){
    touchStart = false;
}

targets.forEach((target, index) => {
    target.addEventListener("click", (e) => {
        if(!isMoved) {
            // change the color of clicked target 
            if(targets[SelectedID]) targets[SelectedID].style.backgroundColor = "red";
            SelectedID = index;
            target.style.backgroundColor = "#00f";
        }
        isMoved = false;
    }, false);

    target.addEventListener("mousedown", (e) => {
        if(isDoubleClick) return;
        mode = 0;
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
    
    // for touchscreen devices
    target.addEventListener("touchstart", (e) => {
        mode = 1;
        console.log("Event: touchstart");
        if (e.touches.length === 1) { // first finger
            console.log("first finger");
            touchStart = true;
            // const TimeOut = setTimeout(stopTouchClick, 500);
            targetID = index;
            oriX = e.target.style.left.split("px")[0];
            oriY = e.target.style.top.split("px")[0];
            mouseX = e.changedTouches[0].clientX;
            mouseY = e.changedTouches[0].clientY;
            difX = mouseX - oriX;
            difY = mouseY - oriY;
            oriWidth = toString(e.target.style.width.split("px")[0]);
            oriHeight = toString(e.target.style.height.split("px")[0]);
        } else if (e.touches.length === 2) { //second finger
            console.log("second finger");
            if(isMoved/*isMouseDown || isDoubleClick*/){
                targets[targetID].style.top = oriY + "px";
                targets[targetID].style.left = oriX + "px";
                isMouseDown = false;
                touchStart = false;
                isDoubleClick = false;
                // isMoved = false;
            }
        }
    });
    target.addEventListener("touchend", (e) => {
        // mode = 1;
        console.log("Event: touchend");
        // if(touchStart) console.log("touch click");
        // else console.log("touch w/o click");
        touchStart = false;
    });
});
