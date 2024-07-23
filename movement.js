

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

        ["mousedown", "touchstart"].forEach(type => {
            this.target.addEventListener(type, this._onHoldStart.bind(this))
        });

        ["mouseup", "mouseleave", "mouseout", "touchend", "touchcancel"].forEach(type => {
            this.target.addEventListener(type, this._onHoldEnd.bind(this))
        });
    }


    doCallback(){
        this.callback();

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
const curHostName = 'postPlace';

const btnFor = document.querySelector(".btnForw");
const btnBack = document.querySelector(".btnBack");
const btnLeft = document.querySelector(".btnLeft");
const btnRight = document.querySelector(".btnRight");
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

