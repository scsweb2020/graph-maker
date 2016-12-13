import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import '../components/hello.js';
import '../components/info.js';
import './app-body.css';
import './app-body.html';

// Template.App_body.onCreated(function appBodyOnCreated() {});
Template.App_body.helpers({
  loggedIn: function() {
    console.log("Logged in?")
    let user = Session.get("currentUser")
    console.log(user);
    if (!user) {
      console.log('no user is logged in');
      return false;
    } else {
      return true;
    }
  },
  currentUserName: function() {
    if (Session.get("currentUser")) {
      console.log("User " + Session.get("currentUser").userName + " is logged in");
      return Session.get("currentUser").userName;
    } else {
      return "Anonymous";
    }
  },
  isGraphMaker: function() {
    return Session.get("isGraphMaker");
  }
})
