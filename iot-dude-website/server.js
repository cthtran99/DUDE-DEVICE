if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
//const methodOverride = require('method-override')



const initializePassport = require('./passport-config')
const db = require('./database.js'); // Connect to Mongoose Database
db.connect();

initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)
const path = require('path'); 
const e = require('express')
const users = []
app.use(express.static(path.join(__dirname,"public")))


app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))



app.use(passport.initialize())
app.use(passport.session())
//app.use(methodOverride('_method'))


//once logged in change login to my Account
app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name, title: 'ACCOUNT'})
})


//renders login page if user is not logged in
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})



//if user is using correct credentials, when redirect to dashboard, if not back to login
app.post('/login', checkNotAuthenticated, passport.authenticate("local-login", {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


// if user is not loged in get redirected to register page
app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

//makes sure when user registers the correct page gets loaded
app.post('/register', passport.authenticate('local-signup', {session: false}), async (req, res) => {
  try {
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

//routes for all wepages

app.get('/home', (req, res) => {
  if(req.user == undefined)
    res.render('home.ejs', { name: req.user, title: 'LOGIN'})
  else
    res.render('home.ejs', { name: req.user, title: 'ACCOUNT'})
})

app.get('/products', (req, res) => {
  if(req.user == undefined)
    res.render('products.ejs', { name: req.user, title: 'LOGIN'})
  else
    res.render('products.ejs', { name: req.user, title: 'ACCOUNT'})
})

app.get('/support', (req, res) => {
  if(req.user == undefined)
    res.render('support.ejs', { name: req.user, title: 'LOGIN'})
  else
    res.render('support.ejs', { name: req.user, title: 'ACCOUNT'})
})

app.get('/cart', (req, res) => {
  if(req.user == undefined)
    res.render('cart.ejs', { name: req.user, title: 'LOGIN'})
  else
    res.render('cart.ejs', { name: req.user, title: 'ACCOUNT'})
})


app.get('/temp', (req, res) => {
  if(req.user == undefined)
    res.render('temp.ejs', { name: req.user, title: 'LOGIN'})
  else
    res.render('temp.ejs', { name: req.user, title: 'ACCOUNT'})
})

app.get('/frontDistance', (req, res) => {
  if(req.user == undefined)
    res.render('frontDistance.ejs', { name: req.user, title: 'LOGIN'})
  else
    res.render('frontDistance.ejs', { name: req.user, title: 'ACCOUNT'})
})


app.get('/humidity', (req, res) => {
  if(req.user == undefined)
    res.render('humidity.ejs', { name: req.user, title: 'LOGIN'})
  else
    res.render('humidity.ejs', { name: req.user, title: 'ACCOUNT'})
})

app.get('/backDistance', (req, res) => {
  if(req.user == undefined)
    res.render('backDistance.ejs', { name: req.user, title: 'LOGIN'})
  else
    res.render('backDistance.ejs', { name: req.user, title: 'ACCOUNT'})
})


//html site routes

app.get('/styles.css', function(req, res){
  res.sendFile(__dirname + '/styles.css');
})
app.get('/products', function(req,res){
  res.sendFile(__dirname + '/products');
})

app.get('/register.html', function(req,res){
  res.sendFile(__dirname + '/register.html');
})

app.get('/support', function(req,res){
  res.sendFile(__dirname + '/support');
})

app.get('/forgot.html', function(req,res){
  res.sendFile(__dirname + '/forgot.html');
})

app.get('/reset.html', function(req,res){
  res.sendFile(__dirname+'/reset.html');
})

app.get('/cart.ejs', function(req,res){
  res.sendFile(__dirname+'/cart.ejs');
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

app.get('/app.js', function(req,res){
  res.sendFile(__dirname+'/app.js');
})

app.get('product=page-styles.css', function(req,res){
  res.sendFile(__dirname+'/product=page-styles.css');
})

app.get('/download.html', function(req,res){
  res.sendFile(__dirname+'/download.html');
})

app.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/home');
  });
});

//sets starting point 
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/home')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}



app.listen(3000)

