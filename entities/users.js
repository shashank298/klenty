const UserDetails = require('./../models/userdetails.js');
const passport = require('passport');
const config = require('./../settings.json').rest;
passport.use(UserDetails.createStrategy());
passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());
class Users {

    Unautherised(req, res) {
        let responseMessage = config.failureMessage;
        responseMessage.message = config.unAuthorizedMessage;
        res.status(config.unauthorizedStatus).send(responseMessage);
    }

    FetchUser(req, res) {
        res.send({ user: req.user })
    }

    async createNewUser(request, response) {
        let responseMessage = config.failureMessage;
        request.body.active = false;
        let newUser = await UserDetails.register(request.body, request.body.password).catch((error) => {
            return error
        });
        if (newUser instanceof Error) {
            responseMessage.message = newUser.message
            response.status(config.baddataStatus).send(responseMessage)
            return;
        }
        responseMessage = config.successfullMessage;
        responseMessage.message = "new user registered successfully";
        response.send(responseMessage);
    }

    login(req, res, next) {
        passport.authenticate(config.authentication,
            (err, user, info) => {
                let responseMessage = config.failureMessage;
                if (err) {
                    return next(err);
                }

                if (!user) {
                    responseMessage.message = "UNAUTHERORISED";
                    res.status(config.unauthorizedStatus).send(responseMessage)
                    return;
                }

                req.logIn(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    responseMessage = config.successfullMessage;
                    responseMessage.message = "Login successful";
                    res.send(responseMessage)
                });

            })(req, res, next);
    }
}
module.exports = new Users();