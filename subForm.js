//I can't remember if this worked well or not -Anton

let form = document.getElementById("userInfo");


let sBtn = document.getElementById("subUsrPass");
let ooo = document.getElementById("aba");
let myForm = document.getElementById("userInfo");


async function myRequest (e) {
    console.log(e);
    e.preventDefault();
    let userJson = document.getElementById("username").value;
    let ppp = document.getElementById("password");
    let passJson = ppp.value; 
    ppp.innerHTML = "";
    //ooo.innerHTML = 'woof';
    let brainchild = {
        username : userJson,
        password : passJson
    }
    console.log(brainchild);
    //alert(userJson + " --- " + passJson);

    fetch('http://localhost:8000', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(brainchild)
    })
    .then(response => response.json())
    .then(data => {
        //console.log('data sent: ', brainchild);
        //ooo.innerHTML ="output: " + brainchild;
        alert("hi");
    })
    .catch((e) => {
        //console.error('error in subForn.js: ', e);
        ooo.innerHTML = 'error in subForn.js: ' + e;
        console.log(e);
        alert("hoe");
    });
    return false;
};
