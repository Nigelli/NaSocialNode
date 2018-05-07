var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var auth = require('./auth');
var jwt = require('jwt-simple');
var User = require('./models/User.js');
var Post = require('./models/Post.js');

app.use(cors());
app.use(bodyParser.json());

app.get('/posts/:id', async (req, res) => {
    var author = req.params.id;
    var posts = await Post.find({author});
    res.send(posts);
});

app.post('/post', auth.checkAuthenticated, (req, res) => {
    postData = req.body;
    postData.author = req.userId;

    var post = new Post(postData);

    post.save((err, result) => {
        if (err) {
            console.error('error saving post');
            return res.sendStatus(500).send({message: 'error saving post'});
        }
        res.sendStatus(200);
    })
})

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

mongoose.connect('mongodb://test:test@ds119268.mlab.com:19268/angularapp101', (err) => {
    if (!err) {
        console.log('connected to database');
    }
});

app.use('/auth', auth.router);

app.listen(process.env.PORT || 3000);
