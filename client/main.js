import '/imports/startup/client';
import '/imports/startup/both';

import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import '/client/head.html';

Template.header.helpers({
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
      return Session.get("currentUser").userName;
    } else {
      return "Anonymous";
    }
  },
})
//
// import './main.html';
//
// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });
//
// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });
//
// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });
