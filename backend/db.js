const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('connected to mango 👌');
})

db.on('error', (err) => {
    console.error('connected to error 😒: ', err);
})

db.on('disconnected', () => {
    console.log('disconnected from mango 👋');
})

module.exports = db;