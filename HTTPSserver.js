// import https from 'https';
// import fs from 'fs';
// import express from 'express';


const fs = require('fs');
const express = require('express');
// const https = require('https');


const app = express();

// https.createServer(app).listen(8002, () => {
//     console.log('server running on port 8002');
// });
let server = app.listen(8002, () => {
    console.log('server running on port 8002');
});

app.use(express.static('aa')); 

app.get('/', (req,res)=>{
    //res.json() or res.sendFile() to send respective type
    fs.readFile('index.html', (err, data) => {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
});