// route.js Handles the routing between login mechanisms.

const express = require('express');
const app = express();

const port = 5500;

// Parses URL encoded data from the body from the form.
app.use(express.urlencoded({extended: false}));

// Sending Homepage
app.get('/', function(req, res){
    res.sendFile(__dirname + '/login.html');
})

app.post('/login.html', function(req, res){
    let username = req.body.user_name;
    let password = req.body.pass_word;
    let test_username = 'test';
    let test_password = 'password';
    // Debug print
    // res.send(`Username: ${username} Password: ${password}`)

    // Stub function, needs to be replaced by accessing database via EF.
    if (username === test_username){
        if (password === test_password){
            res.send('Correct Password'); //TO DO: Later change it to redirect and add token.
        }else{
            res.send('Incorrect Password');
        }
    }else{
        res.send('Incorrect Username');
    }
})

app.get('failure.html', function(req,res){
    res.send('Failure');
})

app.get('sucess.html', function(req,res){
    res.send('Success');
})

app.listen(port, console.log(`Currently listening on port ${port}`));