const mongoose = require('mongoose')

const {dbHost, dbName, dbPort, dbUser, dbPass} = require('../app/config')

// mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`, 
// {useNewUrlParser:true, useUnifiedTopology : true, useFindAndModify: false}
// );

mongoose.connect(`mongodb://heroku_9vf716br:rTUc3BwTU7bgK3@@ds127300.mlab.com:27300/heroku_9vf716br`, 
{useNewUrlParser:true, useUnifiedTopology : true, useFindAndModify: false}
);
const db = mongoose.connection;

module.exports = db