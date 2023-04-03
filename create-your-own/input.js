/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/

const body = document.querySelector("body");
const targets = document.querySelectorAll(".target");

const StatesEnum = Object.freeze({"NONE":0, "MOUSE_DOWN":1, "MOVE":2, "DOUBLE_CLICK":3, "CHANGE_SIZE":4, "ESC":5});
// let mode = 0;                   // 0 = mouse, 1 = touch
let states = StatesEnum.NONE;

let isClick = true;
let isMoved = false;            // can do click or not
let isMouseDown = false;
let isDoubleClick = false;
let changeSize = false;

let mouseX = 0, mouseY = 0;     // position when mouse down
let mouseX_2 = 0, mouseY_2 = 0; // position when mouse down
let ori_touch_W = 0, ori_touch_H = 0;         // |mouse - mouse2|
let oriX = 0, oriY = 0;         // top-left position of target
let difX = 0, difY = 0;         // diff. between mouse pos and top-left of target
let SelectedID = -1;            // idx of currently selecting target
let targetID = -1;              // idx of currently interacting target
let oriWidth = 0, oriHeight = 0;

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
        // states = StatesEnum.NONE;
        isMoved = false;
        isClick = true;
}, false);

body.addEventListener("mousemove", (e) => {
    if(isDoubleClick){
        isMoved = true;
        targets[SelectedID].style.top = (e.clientY - difY) + "px";
        targets[SelectedID].style.left = (e.clientX - difX) + "px";
    } else if(isMouseDown){
        isMoved = true;
        targets[targetID].style.top = (e.clientY - difY) + "px";
        targets[targetID].style.left = (e.clientX - difX) + "px";
    }
    /*switch(states){
        case StatesEnum.MOUSE_DOWN:
            states = StatesEnum.MOVE;
            targets[targetID].style.top = (e.clientY - difY) + "px";
            targets[targetID].style.left = (e.clientX - difX) + "px";
            break;
        case StatesEnum.MOVE:
            targets[targetID].style.top = (e.clientY - difY) + "px";
            targets[targetID].style.left = (e.clientX - difX) + "px";
            break;
        case StatesEnum.DOUBLE_CLICK:
            targets[SelectedID].style.top = (e.clientY - difY) + "px";
            targets[SelectedID].style.left = (e.clientX - difX) + "px";
            break;
        default:
            return;
    }*/
    // if(states != StatesEnum.MOUSE_DOWN && states != StatesEnum.DOUBLE_CLICK) return;
    // if(states == StatesEnum.MOUSE_DOWN) 
    // states = StatesEnum.MOVE;
    // // isMoved = true;
    // targets[targetID].style.top = (e.clientY - difY) + "px";
    // targets[targetID].style.left = (e.clientX - difX) + "px";
}, false);

document.onkeydown = (e) => {
    if(e.keyCode == 27) {
        console.log("Event: ESC");
        if(isMoved){
            if(isDoubleClick){
                targets[SelectedID].style.top = oriY + "px";
                targets[SelectedID].style.left = oriX + "px";
                isClick = true;
            } else {
                targets[targetID].style.top = oriY + "px";
                targets[targetID].style.left = oriX + "px";
                isClick = false;
            }
            isMouseDown = false;
            touchStart = false;
            isDoubleClick = false;
            isMoved = false;
            
        }
        /*if(states == StatesEnum.MOVE){
            targets[targetID].style.top = oriY + "px";
            targets[targetID].style.left = oriX + "px";
            states = StatesEnum.ESC;

        } else if(states == StatesEnum.DOUBLE_CLICK){
            targets[SelectedID].style.top = oriY + "px";
            targets[SelectedID].style.left = oriX + "px";
            states = StatesEnum.ESC;
        }*/
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
        changeSize = true;
        TimeOut = setTimeout(stopChangeSize, 100);
    } else if (e.touches.length === 2) { //second finger
        console.log("document second finger");
        if(changeSize){
            clearTimeout(TimeOut);
            states = StatesEnum.CHANGE_SIZE;
            console.log("clearTimeout: " + changeSize);
            mouseX_2 = e.targetTouches[1].clientX;
            mouseY_2 = e.targetTouches[1].clientY;
            ori_touch_W = Math.abs(mouseX_2 - mouseX);
            ori_touch_H = Math.abs(mouseY_2 - mouseY);
        // } else if(states == StatesEnum.MOVE || states == StatesEnum.DOUBLE_CLICK){
        } else if(isMoved){
            if(isDoubleClick){
                targets[SelectedID].style.top = oriY + "px";
                targets[SelectedID].style.left = oriX + "px";
            } else {
                targets[targetID].style.top = oriY + "px";
                targets[targetID].style.left = oriX + "px";
            }
            
            isMouseDown = false;
            touchStart = false;
            isDoubleClick = false;
            isMoved = false;
            // states = StatesEnum.NONE;
            targetID = -1;
        }
    }
});

body.addEventListener("touchend", (e) => {
    console.log("Event: body.touchend");
    if(e.targetTouches.length == 0 && changeSize){
        // targetID = -1;
        // states = StatesEnum.NONE;
        changeSize = false;
    }
    
});

body.addEventListener("touchmove", (e) => {
    if(touchStart){
        isMoved = true;
        targets[targetID].style.top = (e.touches[0].clientY - difY) + "px";
        targets[targetID].style.left = (e.touches[0].clientX - difX) + "px";
    } else if(isDoubleClick){
        isMoved = true;
        targets[SelectedID].style.top = (e.touches[0].clientY - difY) + "px";
        targets[SelectedID].style.left = (e.touches[0].clientX - difX) + "px";
    } else if(changeSize){
        if(!targets[SelectedID]) return;
        console.log("e.targetTouches[1].clientX: " + e.targetTouches[1].clientX);
        let new_width = Number(oriWidth) + (Math.abs(e.targetTouches[0].clientX - e.targetTouches[1].clientX) - ori_touch_W);
        console.log("new_widt: " + new_width);
        targets[SelectedID].style.left = (oriX - ((new_width - oriWidth) / 2)) + "px";
        targets[SelectedID].style.width = new_width + "px";
    }
    /*
    switch (states){
        case StatesEnum.MOUSE_DOWN:
            states = StatesEnum.MOVE;
            targets[targetID].style.top = (e.touches[0].clientY - difY) + "px";
            targets[targetID].style.left = (e.touches[0].clientX - difX) + "px";
            break;

        case StatesEnum.MOVE:
            targets[targetID].style.top = (e.touches[0].clientY - difY) + "px";
            targets[targetID].style.left = (e.touches[0].clientX - difX) + "px";
            break;

        case StatesEnum.DOUBLE_CLICK:
            targets[SelectedID].style.top = (e.touches[0].clientY - difY) + "px";
            targets[SelectedID].style.left = (e.touches[0].clientX - difX) + "px";
            break;

        case StatesEnum.CHANGE_SIZE:
            if(!targets[SelectedID]) return;
            console.log("e.targetTouches[1].clientX: " + e.targetTouches[1].clientX);
            let new_width = Number(oriWidth) + (Math.abs(e.targetTouches[0].clientX - e.targetTouches[1].clientX) - oriW);
            console.log("new_widt: " + new_width);
            targets[SelectedID].style.left = (oriX - ((new_width - oriWidth) / 2)) + "px";
            targets[SelectedID].style.width = new_width + "px";
            break;

        default:
            return;
    }
    */
    // console.log("Event: touchmove");
});

targets.forEach((target, index) => {
    target.addEventListener("click", (e) => {
        if(!isMoved && isClick){
            if(targets[SelectedID]) targets[SelectedID].style.backgroundColor = "red";
            SelectedID = index;
            target.style.backgroundColor = "#00f";
        }
        isMoved = false;
        isClick = true;
        /*
        if(states == StatesEnum.NONE || states == StatesEnum.DOUBLE_CLICK) {
            if(targets[SelectedID]) targets[SelectedID].style.backgroundColor = "red";
            SelectedID = index;
            target.style.backgroundColor = "#00f";
        }
        states = StatesEnum.NONE;
        */
    }, false);

    target.addEventListener("mousedown", (e) => {
        if(isDoubleClick) return;

        // if(states != StatesEnum.NONE) return;
        console.log("Event: mousedown");
        // states = StatesEnum.MOUSE_DOWN;
        isMouseDown = true;
        targetID = index;
        // console.log(index);
        oriX = e.target.style.left.split("px")[0];
        oriY = e.target.style.top.split("px")[0];
        mouseX = e.clientX;
        mouseY = e.clientY;
        difX = mouseX - oriX;
        difY = mouseY - oriY;
        oriWidth = e.target.style.width.split("px")[0];
        oriHeight = e.target.style.height.split("px")[0];
    }, false);

    target.addEventListener("mouseup", (e) => {
        console.log("Event: mouseup");
        // console.log(index);
        if(isDoubleClick) isDoubleClick = false;
        targetID = -1;
        isMouseDown = false;
        if(isMoved) isClick = false;
        isMoved = false;
        // states = StatesEnum.ESC;
    }, false);

    target.addEventListener("dblclick", (e) => {
        console.log("Event: dblclick");
        // states = StatesEnum.DOUBLE_CLICK;
        isDoubleClick = true;
    }, false);
    
    // for touchscreen devices
    target.addEventListener("touchstart", (e) => {
        console.log("Event: touchstart");
        if (e.touches.length === 1) { // first finger
            console.log("first finger");
            // states = StatesEnum.MOUSE_DOWN;
            touchStart = true;
            targetID = index;
            oriX = e.target.style.left.split("px")[0];
            oriY = e.target.style.top.split("px")[0];
            mouseX = e.changedTouches[0].clientX;
            mouseY = e.changedTouches[0].clientY;
            difX = mouseX - oriX;
            difY = mouseY - oriY;
            oriWidth = toString(e.target.style.width.split("px")[0]);
            oriHeight = toString(e.target.style.height.split("px")[0]);
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
        // states = StatesEnum.NONE;
        touchStart = false;
        if(isDoubleClick) isClick = false;
        else isMoved = false;
        // if(!isDoubleClick) 
    });
});
