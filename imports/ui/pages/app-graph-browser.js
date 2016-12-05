import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import { Graphs } from '/imports/api/graphs.js';

import './app-graph-browser.css';
import './app-graph-browser.html';

Template.App_graphBrowser.onCreated(function() {

});

Template.App_graphBrowser.helpers({
  userGraphs: function() {
    let currentUser = Session.get("currentUser");
    console.log(currentUser);
    console.log(Graphs.find().fetch());
    if (currentUser.userName === "ADMIN") {
      return Graphs.find();
    } else {
      return Graphs.find({userID: currentUser._id});
    }
  }
});

Template.App_graphBrowser.events({
  'click #createNewGraph': function() {
    let currentUser = Session.get("currentUser");
    let newGraph = new Graph(currentUser, "EMPTY");
    let newGraphID = Graphs.insert(newGraph);
    Router.go("App.graphMaker", {'userID': currentUser._id, 'graphID': newGraphID});
  }
});
