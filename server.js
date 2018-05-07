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
app.use(express.static('dist'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
})

app.get('/api/posts/:id', async (req, res) => {
    var author = req.params.id;
    var posts = await Post.find({author});
    res.send(posts);
});

app.post('/api/post', auth.checkAuthenticated, (req, res) => {
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

app.get('/api/users', async (req, res) => {
    try {
        var users = await User.find({}, '-password -__v');
        res.send(users);

    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'error occured getting users'})
    }
});

app.get('/api/profile/:id', async (req, res) => {
    try {
        var user = await User.findById(req.params.id, '-password -__v');
        
        res.send(user);

    } catch (error) {
        console.error(error);
        res.status(500).send({message: 'error occured getting users'})
    }
});

app.use('/auth', auth.router);

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
})

mongoose.connect('mongodb://production:yK9HU4gzXkrDZL3sgd4fXfCUvz7g3rSExkTJbH3FtAkXrT8WrDGFhLMcA8Ns2yFc@ds119268.mlab.com:19268/angularapp101', (err) => {
    if (!err) {
        console.log('connected to database');
    }
});


app.listen(process.env.PORT || 3000);
