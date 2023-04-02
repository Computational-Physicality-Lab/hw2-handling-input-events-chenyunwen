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
let changeSize = false;
let mouseX = 0, mouseY = 0;     // position when mouse down
let mouseX_2 = 0, mouseY_2 = 0; // position when mouse down
let oriW = 0, oriH = 0;         // |mouse - mouse2|
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

function stopChangeSize(){
    console.log("stopChangeSize");
    changeSize = false;
}
let TimeOut;
document.addEventListener("touchstart", (e) => {
    mode = 1;
    console.log("Event: document.touchstart");
    
    if (e.touches.length === 1) { // first finger
        console.log("first finger");
        changeSize = true;
        TimeOut = setTimeout(stopChangeSize, 100);
    } else 
    if (e.touches.length === 2) { //second finger
        console.log("document second finger");
        if(changeSize){
            clearTimeout(TimeOut);
            console.log("clearTimeout: " + changeSize);
            mouseX_2 = e.targetTouches[1].clientX;
            mouseY_2 = e.targetTouches[1].clientY;
            console.log("x2 " + mouseX_2);
            console.log("y2 " + mouseY_2);
            oriW = Math.abs(mouseX_2 - mouseX);
            oriH = Math.abs(mouseY_2 - mouseY);
        } else if(isMoved/*isMouseDown || isDoubleClick*/){
            targets[targetID].style.top = oriY + "px";
            targets[targetID].style.left = oriX + "px";
            isMouseDown = false;
            touchStart = false;
            isDoubleClick = false;
            isMoved = false;
        }
    }
});

body.addEventListener("touchmove", (e) => {
    // mode = 1;
    console.log("Event: touchmove_touchStart:" +touchStart);
    if(!touchStart && !isDoubleClick && !changeSize) return;
    console.log("Event: touchmove");
    if(!changeSize){
        isMoved = true;
        // console.log("top: " + targets[targetID].style.top);
        // console.log("e.clientY - difY = " + (e.changedTouches[0].clientY - difY));
        targets[targetID].style.top = (e.touches[0].clientY - difY) + "px";
        targets[targetID].style.left = (e.touches[0].clientX - difX) + "px";
    } else {
        console.log(e.targetTouches.length);
        console.log(e.changedTouches.length);
        if (e.targetTouches.length === 2 && e.changedTouches.length === 2) {
            console.log("e.targetTouches.length === 2 && e.changedTouches.length === 2");
            
            console.log(e.targetTouches.length);
            console.log(e.changedTouches.length);
            // const point1 = tpCache.findLastIndex(
            //     (tp) => tp.identifier === e.targetTouches[0].identifier
            // );
            const diff1 = Math.abs(
                mouseX_2 - e.targetTouches[1].clientX
            );
            
            //   const point2 = tpCache.findLastIndex(
            //     (tp) => tp.identifier === ev.targetTouches[1].identifier
            //   );
            // console.log(e.touches[0].clientX);
            // console.log(e.touches[1].clientX);
            // console.log(Math.abs(e.touches[0].clientX - e.touches[1].clientX));
            console.log(Math.abs(mouseX-mouseX_2));
        }
        if(!targets[targetID]) return;
        console.log("e.targetTouches[1].clientX: " + e.targetTouches[1].clientX);
        let new_width = Number(oriWidth) + (Math.abs(e.targetTouches[0].clientX - e.targetTouches[1].clientX) - oriW);
        console.log("new_widt: " + new_width);
        targets[targetID].style.left = (oriX - ((new_width - oriWidth) / 2)) + "px";
        targets[targetID].style.width = new_width + "px";
        // oriWidth = new_width;
    }
    
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
        oriWidth = e.target.style.width.split("px")[0];
        oriHeight = e.target.style.height.split("px")[0];
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
