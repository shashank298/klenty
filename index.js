const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');
const bodyParser = require('body-parser');
const config = require('./settings.json').app;
const expressSession = require('express-session')({
    secret: config.sessionSecret,
    resave: config.resaveSession,
    saveUninitialized: config.saveUninitializedSession
});
const port = process.env.PORT || config.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);
app.use(cors());

app.listen(port, () => console.log('App listening on port ' + port));
app.use(passport.initialize());
app.use(passport.session());
module.exports = app;