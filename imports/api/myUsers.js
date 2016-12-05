import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session'

// Configure logger for event logging
var logger = new Logger('Managers:Users');
// Comment out to use global logging level
Logger.setLevel('Managers:Users', 'trace');
//Logger.setLevel('Managers:Users', 'debug');
// Logger.setLevel('Managers:Users', 'info');
//Logger.setLevel('Managers:Users', 'warn');

export const MyUsers = new Mongo.Collection('myUsers');

MyUser = function(userName) {
    this.userName = userName;
}

UserManager = (function() {
    return {
        loginUser: function(userName) {
            returnUser = MyUsers.findOne({userName: userName});
            if (returnUser) {
                logger.debug("Logging in return user " + returnUser.userName +
                    " with id: " + returnUser._id);
                Session.set("currentUser", returnUser);
                // EventLogger.logBegin();
                return returnUser._id;
            } else {
                var newUser = new MyUser(userName);
                var newUserID = MyUsers.insert(newUser);
                var loggedInUser = MyUsers.findOne({_id: newUserID});
                logger.debug("Logging in new user " + loggedInUser.userName +
                    " with id: " + loggedInUser._id);
                Session.set("currentUser", loggedInUser);
                // EventLogger.logBegin();
                return newUserID;
            }

        },
    };
}());
