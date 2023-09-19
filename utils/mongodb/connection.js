const mongoose = require('mongoose');
const env = require('@env');
const mongoUri = env.MONGOURI


const mongoConnect = () => {
    mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    mongoose.connection.on('connected', function () {
        console.log('connected to mongodb')
    });
    mongoose.connection.on('error', (err) => {
        console.log('Error:', err)
    });
}

module.exports = { mongoConnect }