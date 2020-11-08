const mongoose = require('mongoose')

const {dbHost, dbName, dbPort, dbUser, dbPass, mongoUri} = require('../app/config')

// mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`, 
// {useNewUrlParser:true, useUnifiedTopology : true, useFindAndModify: false}
// );

mongoose.connect(mongoUri, 
{useNewUrlParser:true, useUnifiedTopology : true, useFindAndModify: false}
);
const db = mongoose.connection;

module.exports = db