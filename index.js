require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser =require('body-parser');
const app = express();


const catSchema = mongoose.Schema({
    name:  String,
    age: Number,
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    color:   String,
    weight: Number
});

const Cat = mongoose.model('cat', catSchema);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/subscribe?authSource=admin`)
    .then(() => {
        console.log('Connection established to db');
    })
    .then(() => appListen())
    .catch((e) => {
        console.log('Connection to db failed because:', e);
    });

app.post('/cats', (req, res) => {
    Cat.create(req.body).then((cat) => {
        res.send(cat);
    });
});
app.get('/cats', (req, res, err) => {
    Cat.find({
        age: {$gte: 10},
        weight: {$gte: 10},
        gender: 'Male',
    }).then((cat) => {
       res.send(cat);
    }).catch(err);
});

function appListen() {
    app.listen(3000);
}

