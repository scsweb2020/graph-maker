import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './app-land.css';
import './app-land.html';

var logger = new Logger('Client:land');

Logger.setLevel('Client:land', 'trace');
// Logger.setLevel('Client:land', 'debug');
// Logger.setLevel('Client:land', 'info');
// Logger.setLevel('Client:land', 'warn');

Template.landingPage.onCreated(function() {
  this.autorun(function() {
    // this.subscribe('myUsers');
  });
});

Template.landingPage.events({
    'click .continue' : function() {
        var userName = $('#userName').val();
        logger.trace("User " + userName + " clicked continue");
        userID = UserManager.loginUser(userName);
        Router.go("GraphBrowser", {'userID': userID});
        // if (Meteor.user()) {
        //     logger.trace("Sending user to tutorial");
        //     Router.go("Tutorial");
        // } else {
        //     alert("Please sign in or create an account (in the menu in the top right-hand corner of the page) before continuing");
        // }
    },
    'keyup input#userName': function (evt) {
      if(evt.keyCode==13) {
        //console.log("enter released, clicking continue");
        $('#nextPage').click();
      }
    },
});
