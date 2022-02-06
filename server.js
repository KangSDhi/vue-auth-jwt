const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/auth-jwt');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.post('/signup', (req, res, next) => {
    const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 10)
    });
    newUser.save(err => {
        if (err) {
            return res.status(400).json({
                title: 'error',
                error: 'email in use'
            });
        }
        return res.status(200).json({
            title: 'signup success'
        });
    })
});

app.post('/login', (req, res, next) => {
    User.findOne({email: req.body.email}, (err, user) => {
        // console.log(user);
        if(err) return res.status(500).json({
            title: 'server error',
            error: err
        });
        if (!user) {
            return res.status(401).json({
                title: 'user not found',
                error: 'invalid credentials'
            });
        }
        // incorrect password
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'login failed',
                error: 'invalid credentials'
            });
        }
        // If All Is Good create a token and send to frontend
        let token = jwt.sign({ userId: user._id }, 'secretkey');
        return res.status(200).json({
            title: 'login success',
            token: token
        });
        
    })
});

//grabbing user info
app.get('/user', (req, res, next) => {
    let token = req.headers.token;
    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) return res.status(401).json({
            title: 'unauthorized'
        })
        //token is valid
        User.findOne({ _id: decoded.userId }, (err, user) => {
            if(err) return console.log(err);
            return res.status(200).json({
                title: 'user grabbed',
                user: {
                    email: user.email,
                    name: user.name
                }
            });
        })
    })
})


const port = process.env.PORT || 5000;

app.listen(port, (err) => {
    if (err) return console.log(err);
    console.log('server running on port ' + port);
})