// python:
// mongodb+srv://dudagon:dudagon>@dude.0qxouen.mongodb.net/?retryWrites=true&w=majority

const express = require ('express');
const app = express ();
const mongoose = require ('mongoose');
const bodyParser = require ('body-parser');
const ejs = require ('ejs');
var Schema = mongoose.Schema
const {join} = require('path')
var url = "mongodb+srv://dudagon:dudagon@dude.0qxouen.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(url, {useNewUrlParser:true});

const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("UserData").collection("Users");
  // perform actions on the collection object



app.set("views", join(__dirname,"views"));
app.set ('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use (bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname));


var mySchema = new mongoose.Schema({
    username : String,
    password : String
});

var comments = mongoose.model ('UserData', mySchema);

app.get ('/', (req, res) => {
    res.render ('index');
});




app.post ('/', (req, res) =>{
    var info = {
        username: req.body.username,
        password: req.body.password
    };
    var me = new comments (info);
    me.save(function (err) {
        if (err) {
            console.log ('Error occurred');
        } else {
            console.log('Done:');
        }
    });
    res.render ('accountCreated');     
});



app.listen (3000,()=>console.log('Listening on 3000'));

client.close();
});
