var express = require('express');
var cors = require('cors');
var brcrypt = require('bcrypt-nodejs');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var app = express();

var User = require('./models/User.js');

var posts = [
    { message: 'hello'},
    { message: 'hi'}
]

app.use(cors());
app.use(bodyParser.json());

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.get('/users', async (req, res) => {
    try {
        var users = await User.find({}, '-password -__v');
        res.send(users);

    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'error occured getting users'})
    }
});

app.get('/profile/:id', async (req, res) => {
    try {
        var user = await User.findById(req.params.id, '-password -__v');
        
        res.send(user);

    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'error occured getting users'})
    }
});

app.post('/register', (req, res) => {
    var userData = req.body;
    var user = new User(userData);
    user.save((err, result) => {
        if (err) {
            console.log('error saving user');
            res.sendStatus(500);
        }
        res.sendStatus(200);
    })
});

app.post('/login', async (req, res) => {
    var loginData = req.body;

    var user = await User.findOne({ email: loginData.email });

    if (!user)
        return res.status(401).send({ message: 'Email or Password is invalid' });

    brcrypt.compare(loginData.password, user.password, (err, isMatch) => {
        if (isMatch) {
            return res.status(401).send({ message: 'Email or Password is invalid' });
        }
        var payload = {};
        var token = jwt.encode(payload, '123');
    
        res.status(200).send({token});
    })
    
});

mongoose.connect('mongodb://test:test@ds119268.mlab.com:19268/angularapp101', (err) => {
    if (!err) {
        console.log('connected to database');
    }
});

app.listen(3000);
