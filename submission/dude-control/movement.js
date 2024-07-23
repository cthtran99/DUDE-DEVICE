// author: Anton Amstadt
/* movement.js uses custom class to set up events for buttons to send 
HTTP post request to tell car to move */

class HoldClick {
    /**
     * 
     * @param {EventTarget} target HTML element to apply the event to 
     * @param {*} callback run this callback on click and hold
     */
    constructor(target, callback){
        this.target = target;
        this.callback = callback;
        this.isHeld = false;
        this.activeHoldTimeoutId = null;

	// add add event listeners for the beginning of button press
        ["mousedown", "touchstart"].forEach(type => {
            this.target.addEventListener(type, this._onHoldStart.bind(this))
        });
	
	// add add event listeners for the end of button press
        ["mouseup", "mouseleave", "mouseout", "touchend", "touchcancel"].forEach(type => {
            this.target.addEventListener(type, this._onHoldEnd.bind(this))
        });
    }


    doCallback(){
        this.callback();

	// check if button is being held down 
        this.activeHoldTimeoutId = setInterval(() => {
            if (this.isHeld){
                this.callback();
            }
        }, 500)
    }

    _onHoldStart(){
        this.isHeld = true;
        this.doCallback();
    }

    _onHoldEnd(){
        this.isHeld = false;
        clearTimeout(this.activeHoldTimeoutId);
        
        fetch(curHostName, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({dir: 'stop'})
        })
        .then(response => response.json())
        .then(response => console.log(JSON.stringify(response)))
    
        console.log(0);
    }
}

/*
--use class ex)
const myButton = document.getElementById("myButton");
new ClickAndHold(myButton, () => {
    //do stuff here
});
*/
// Wrong: const curHostName = window.location.hostname;

// Right:
const curHostName = 'postPlace';


// button setup
const btnFor = document.querySelector(".btnForw");
const btnBack = document.querySelector(".btnBack");
const btnLeft = document.querySelector(".btnLeft");
const btnRight = document.querySelector(".btnRight");
const lightsOn = document.querySelector(".lightsOn");
const lightsOff = document.querySelector(".lightsOff");
const camDown = document.querySelector(".camDown");
const camUp = document.querySelector(".camUp");
const trafficOff = document.querySelector(".trafficOff");
const yellowOn = document.querySelector(".yellowOn");
const redOn = document.querySelector(".redOn");
const yellowBlink = document.querySelector(".yellowBlink");
const redBlink = document.querySelector(".redBlink");

// use custom class to set up events for buttons to send HTTP post request to tell car to move
new HoldClick(btnFor, () => {
    //do stuff here

    fetch(curHostName, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({dir: 'forward'})
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))

    console.log(1);
});

new HoldClick(btnBack, () => {
    //do stuff here

    fetch(curHostName, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({dir: 'back'})
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))

    console.log(2);
});

new HoldClick(btnLeft, () => {
    //do stuff here

    fetch(curHostName, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({dir: 'left'})
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))

    console.log(3);
});

new HoldClick(btnRight, () => {
    //do stuff here

    fetch(curHostName, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({dir: 'right'})
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))

    console.log(4);
});

new HoldClick(lightsOn, () => {
    //do stuff here

    fetch(curHostName, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({dir: 'lightsOn'})
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))

    console.log(5);
});

new HoldClick(lightsOff, () => {
    //do stuff here

    fetch(curHostName, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({dir: 'lightsOff'})
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))

    console.log(6);
});

new HoldClick(camUp, () => {
    //do stuff here

    fetch(curHostName, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({dir: 'camUp'})
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))

    console.log(7);
});

new HoldClick(camDown, () => {
    //do stuff here

    fetch(curHostName, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({dir: 'camDown'})
    })
    .then(response => response.json())
    .then(response => console.log(JSON.stringify(response)))
});
