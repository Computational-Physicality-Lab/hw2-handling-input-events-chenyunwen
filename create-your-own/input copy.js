/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/

const body = document.querySelector("body");
const targets = document.querySelectorAll(".target");

let isClick = true;             // can do click or not
let isMoved = false;            // drag or dbclick
let isMouseDown = false;        // drag or not
let isDoubleClick = false;
let changeSize = false;         // change size or not
// for target
let moveX = 0, moveY = 0;               // position when mouse down on target
let target_X = 0, target_Y = 0;         // top-left position of target
let target_difX = 0, target_difY = 0;   // diff. between mouse pos and top-left of target
let targetID = -1;                      // idx of currently interacting target

// for Selected
let SelectedID = -1;                    // idx of currently selecting target
let selected_X = 0, selected_Y = 0;     // top-left position of selecting target
let selected_W = 0, selected_H = 0;     // W & H of selecting target
let zoom_X1 = 0, zoom_X2 = 0;           // position of two-finger zooming
let zoom_Y1 = 0, zoom_Y2 = 0;
let zoom_difX = 0, zoom_difY = 0;       // diff. between two fingers

let touchStart = false;

body.addEventListener("click", (event) => {
    console.log("Event: click");
        console.log(isClick);
        const isTarget = event.target.classList.contains('target');
        if(!isMoved && isClick && !isTarget) {
            // console.log(isClick);
            // click background
            if(targets[SelectedID]) targets[SelectedID].style.backgroundColor = "red";
            SelectedID = -1;
        }
        isMoved = false;
        isClick = true;
        isDoubleClick = false;
}, false);

body.addEventListener("mousemove", (e) => {
    if(isMouseDown || isDoubleClick){
        isMoved = true;
        console.log("isMouseDown: " + isMouseDown);
        console.log("isDoubleClick: " + isDoubleClick);
        console.log("targetID: " + targetID);
        targets[targetID].style.top = (e.clientY - target_difY) + "px";
        targets[targetID].style.left = (e.clientX - target_difX) + "px";
    }
}, false);

document.onkeydown = (e) => {
    if(e.keyCode == 27) {
        console.log("Event: ESC");
        if(isMoved){
            targets[targetID].style.top = target_Y + "px";
            targets[targetID].style.left = target_X + "px";
            if(isDoubleClick){
                isClick = true;
            } else {
                isClick = false;
            }
            isMouseDown = false;
            touchStart = false;
            isDoubleClick = false;
            isMoved = false;
            
        }
    }
};

let TimeOut;
function stopChangeSize(){
    console.log("stopChangeSize");
    changeSize = false;
}

body.addEventListener("touchstart", (e) => {
    console.log("Event: document.touchstart");
    
    if (e.touches.length === 1) { // first finger
        if(SelectedID < 0) return;
        console.log("first finger");
        if(isDoubleClick) return;
        changeSize = true;
        TimeOut = setTimeout(stopChangeSize, 100);
        zoom_X1 = e.targetTouches[0].clientX;
        zoom_Y1 = e.targetTouches[0].clientY;
    } else if (e.touches.length === 2) { //second finger
        console.log("document second finger");
        if(changeSize){
            clearTimeout(TimeOut);
            console.log("clearTimeout: " + changeSize);
            zoom_X2 = e.targetTouches[1].clientX;
            zoom_Y2 = e.targetTouches[1].clientY;
            zoom_difX = Math.abs(zoom_X2 - zoom_X1);
            zoom_difY = Math.abs(zoom_Y2 - zoom_Y1);
        } else if(isMoved){
            targets[targetID].style.top = target_Y + "px";
            targets[targetID].style.left = target_X + "px";
            if(SelectedID == targetID){
                selected_X = target_X;
                selected_Y = target_Y;
            }
            
            isMouseDown = false;
            touchStart = false;
            isDoubleClick = false;
            isMoved = false;
            targetID = -1;
        }
    } else {
        if(changeSize){
            targets[SelectedID].style.left = selected_X + "px";
            targets[SelectedID].style.top = selected_Y + "px";
            targets[SelectedID].style.width = selected_W + "px";
            targets[SelectedID].style.height = selected_H + "px";
        }
        changeSize = false;
    }
});

body.addEventListener("touchend", (e) => {
    console.log("Event: body.touchend");
    if(e.targetTouches.length == 0 && changeSize){
        // targetID = -1;
        if(targets[SelectedID]){
            selected_X = targets[SelectedID].style.left.split("px")[0];
            selected_Y = targets[SelectedID].style.top.split("px")[0];
            selected_W = targets[SelectedID].style.width.split("px")[0];
            selected_H = targets[SelectedID].style.height.split("px")[0];
        }
        
        changeSize = false;
    }
    
});

body.addEventListener("touchmove", (e) => {
    if(changeSize){
        if(!targets[SelectedID]) return;
        if(e.targetTouches.length < 2) return;
        console.log("e.targetTouches[1].clientX: " + e.targetTouches[1].clientX);
        let new_width = Number(selected_W) + (Math.abs(e.targetTouches[0].clientX - e.targetTouches[1].clientX) - zoom_difX);
        console.log("new_widt: " + new_width);
        if(new_width > 10){
            targets[SelectedID].style.left = (selected_X - ((new_width - selected_W) / 2)) + "px";
            targets[SelectedID].style.width = new_width + "px";
        }
        
    } else if(touchStart || isDoubleClick){
        console.log("touchmove");
        isMoved = true;
        targets[targetID].style.top = (e.touches[0].clientY - target_difY) + "px";
        targets[targetID].style.left = (e.touches[0].clientX - target_difX) + "px";
    } 
});

targets.forEach((target, index) => {
    target.addEventListener("click", (e) => {
        if(!isMoved && isClick){
            if(targets[SelectedID]) targets[SelectedID].style.backgroundColor = "red";
            SelectedID = index;
            target.style.backgroundColor = "#00f";
            selected_X = targets[SelectedID].style.left.split("px")[0];
            selected_Y = targets[SelectedID].style.top.split("px")[0];
            selected_W = targets[SelectedID].style.width.split("px")[0];
            selected_H = targets[SelectedID].style.height.split("px")[0];
        }
        isMoved = false;
        isClick = true;
    }, false);

    target.addEventListener("mousedown", (e) => {
        if(isDoubleClick) return;

        console.log("Event: mousedown");
        isMouseDown = true;
        targetID = index;
        target_X = e.target.style.left.split("px")[0];
        target_Y = e.target.style.top.split("px")[0];
        moveX = e.clientX;
        moveY = e.clientY;
        target_difX = moveX - target_X;
        target_difY = moveY - target_Y;
    }, false);

    target.addEventListener("mouseup", (e) => {
        console.log("Event: mouseup");
        if(isDoubleClick) isDoubleClick = false;
        // if(isMouseDown && isMoved) targetID = -1;
        isMouseDown = false;
        if(isMoved) isClick = false;
        isMoved = false;
    }, false);

    target.addEventListener("dblclick", (e) => {
        console.log("Event: dblclick");
        isDoubleClick = true;
        isMoved = true;
    }, false);
    
    // for touchscreen devices
    target.addEventListener("touchstart", (e) => {
        console.log("Event: touchstart");
        if (e.touches.length === 1) { // first finger
            console.log("first finger");
            touchStart = true;
            targetID = index;
            target_X = e.target.style.left.split("px")[0];
            target_Y = e.target.style.top.split("px")[0];
            moveX = e.targetTouches[0].clientX;
            moveY = e.targetTouches[0].clientY;
            console.log("moveX: " + moveX);
            target_difX = moveX - target_X;
            target_difY = moveY - target_Y;
            console.log("target_difX: " + target_difX);
            console.log("target_difY: " + target_difY);
        } 
        // else if (e.touches.length === 2) { //second finger
        //     console.log("second finger");
        //     if(isMoved/*isMouseDown || isDoubleClick*/){
        //         targets[targetID].style.top = oriY + "px";
        //         targets[targetID].style.left = oriX + "px";
        //         isMouseDown = false;
        //         touchStart = false;
        //         isDoubleClick = false;
        //         // isMoved = false;
        //     }
        // }
    });
    target.addEventListener("touchend", (e) => {
        console.log("Event: touchend");
        touchStart = false;
        if(targets[SelectedID]){
            selected_X = targets[SelectedID].style.left.split("px")[0];
            selected_Y = targets[SelectedID].style.top.split("px")[0];
            selected_W = targets[SelectedID].style.width.split("px")[0];
            selected_H = targets[SelectedID].style.height.split("px")[0];
        }
        if(isDoubleClick) {
            isClick = false;
            isDoubleClick = false;
        }
        else isMoved = false;
    });
});
