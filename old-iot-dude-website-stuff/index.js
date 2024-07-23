// route.js Handles the routing between login mechanisms.

const express = require('express');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const app = express();
const port = 5500;

// Login Session Code
// This code is used to maintain the session when a user is logged in.

const halfMinute = 1000 * 30; //keep cookie only active for 30 seconds

// Code to establish cookies
app.use(sessions({
    secret: "testSecret", //should be set via config.js but we'll be using this for now.
    saveUninitialized:true,
    cookie: {maxAge: halfMinute},
    resave: false
}));

app.use(cookieParser()); // So the system can parse using cookies

var session; //So we can save a parsed session.


// To do database stuff we'll need to import from the database
var database_handler = require('./database_handler.js');

// Parses URL encoded data from the body from the form.
app.use(express.urlencoded({extended: false}));

// Sending Homepage
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})

app.get('/index.html', function(req,res){
    res.sendFile(__dirname + '/index.html');
})


app.get('/styles.css', function(req, res){
    res.sendFile(__dirname + '/styles.css');
})

// Routing Other Webpages
app.get('/login.html', function(req,res){
    // Checks to see if the user is logged in, and if so, destroy the session.
    session = req.session;
    if(session.userid){
        console.log("Logging out user now.");
        console.log(req.session);
        req.session.destroy();
        res.sendFile(__dirname + '/login.html');
    }
    else{
        res.sendFile(__dirname + '/login.html');
    }
})

app.get('/products.html', function(req,res){
    res.sendFile(__dirname + '/products.html');
})

app.get('/register.html', function(req,res){
    res.sendFile(__dirname + '/register.html');
})

app.get('/support.html', function(req,res){
    res.sendFile(__dirname + '/support.html');
})

app.get('/forgot.html', function(req,res){
    res.sendFile(__dirname + '/forgot.html');
})

app.get('/reset.html', function(req,res){
    res.sendFile(__dirname+'/reset.html');
})

app.get('/cart.html', function(req,res){
    res.sendFile(__dirname+'/cart.html');
})

app.get('/cart.js', function(req,res){
    res.sendFile(__dirname+'/cart.js');
})

app.get('/products.js', function(req,res){
    res.sendFile(__dirname+'/products.js');
})

app.get('/store.js', function(req,res){
    res.sendFile(__dirname+'/store.js');
})

app.get('product=page-styles.css', function(req,res){
    res.sendFile(__dirname+'/product=page-styles.css');
})

app.get('/download.html', function(req,res){
    res.sendFile(__dirname+'/download.html');
})

// Login Function
app.post('/login.html',async function(req, res){
    let username = req.body.mail;
    let password = req.body.pass;
    // let test_username = 'test';
    // let test_password = 'password';
    // Debug print
    // res.send(`Username: ${username} Password: ${password}`)

    // Stub function, needs to be replaced by accessing database via EF.
    var test = await database_handler.checkUsername(username, password);
    if(test){
        // Grants a login session in cookies and tells the user that it has logged in.
        session = req.session;
        session.userid = username;
        console.log(req.session); // Debug Message
        res.send("Correct Password");
    } else if(!test){
        res.send("Incorrect Password");
    } else{
        res.send("Validation Timeout");
    }
})

// Forgot Password code.
app.post('/forgot.html',async function(req, res){
    let username = req.body.mail;
    // let test_username = 'test';
    // let test_password = 'password';
    // Debug print
    // res.send(`Username: ${username} Password: ${password}`)

    var resetToken = Math.floor(Math.random() * 1000); // I am aware this is a security risk. Fix this later.
    var test = await database_handler.generateToken(username, resetToken);
    await new Promise(r => setTimeout(r, 2000));
    console.log("External Token Check:", test);
    res.send(`You can now change the password. <p> Go to <a href="reset.html"> here </a> to reset the password. <p> Your token is "${resetToken}" without quotes.`)
})

app.post('/reset.html', async function(req, res){
    let username = req.body.mail;
    let token = req.body.salt_token;
    let password = req.body.pass;
    // Debug Message
    console.log(`Username: ${username} Token: ${token} Password: ${password}`);
    var test = await database_handler.checkRecovery(username, token);
    if(test){
        database_handler.updatePassword(username, password);
        res.send(`The user ${username} has been updated`);
    } else if(!test){
        res.send("Incorrect Token");
    } else{
        res.send("Validation Timeout");
    }
    console.log(`The user ${username} has been updated`);
})

// Download Database Code. (used for downloading things)

app.post('/download.html', async function(req, res){
    console.log("starting task");
    await database_handler.downloadDatabase();
    await new Promise(r => setTimeout(r, 15000));
    res.download(__dirname+'/export.json');
})

// Register Website code.
app.post('/register.html', async function(req, res){
    let username = req.body.mail;
    let password = req.body.pass;
    await database_handler.createUser(username, password);
    console.log(`The user ${username} has been created`);
    res.send(`The user ${username} has been created`);
})

app.get('failure.html', function(req,res){
    res.send('Failure');
})

app.get('sucess.html', function(req,res){
    res.send('Success');
})


// Image Processing Code
// Import library used for image processing.
const sharp = require("sharp");
const multer = require('multer');
const fs = require('fs')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './iot-dude-website/filter_image')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

// Routing Data for image process page.
app.get('/filter.html', function(req,res){
    res.sendFile(__dirname+'/filter.html');
})

app.post('/filter.html', upload.single("image-process"), async function(req, res, next){
    if(req.file){
        console.log("File uploaded. Processing.");
        console.log(req.file.path);
        fs.rename(req.file.path, __dirname+'/filter_image/process.png',(err) => console.log(err));
        sharp(__dirname+'/filter_image/process.png').greyscale().jpeg({quality:85}).toFile(__dirname+'/filter_image/output.jpg')
        await new Promise(r => setTimeout(r, 15000));
        res.download(__dirname+'/filter_image/output.jpg')
    } else{
        res.send("Please upload an actual file.");
    }
})

app.listen(port, console.log(`Currently listening on port ${port}`));