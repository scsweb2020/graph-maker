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
      return Graphs.find({}, {sort: { lastEditTime : -1 }});
    } else {
      return Graphs.find({userID: currentUser._id}, {sort: { lastEditTime : -1 }});
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

Template.userGraphEntry.helpers({
  createTimeStr: function() {
    return toTimeStampStr(this.createTime);
  },
  lastEditTimeStr: function() {
    return toTimeStampStr(this.lastEditTime);
  },
  routeData: function() {
    let currentUser = Session.get("currentUser");
    return {userID: currentUser._id, graphID: this._id};
  }
})

Template.userGraphEntry.events({
  'click .open-graph': function(event) {
    let currentUser = Session.get("currentUser");
    let graph = $(event.target).parent().parent()[0];
    console.log(graph);
    Router.go("App.graphMaker", {'userID': currentUser._id, 'graphID': graph.id});
  },
  'click .delete-graph': function(event) {
    let graph = $(event.target).parent().parent()[0];
    // change to server-side for later
    let confirmDelete = confirm("Are you sure? This action cannot be undone.")
    if (confirmDelete) {
      Graphs.remove({_id: graph.id});
    }
  }
});

toTimeStampStr = function(time_stamp) {
  let date = new Date(time_stamp);
  let hours = date.getHours();
  let minutes = '0' + date.getMinutes();
  let day = date.getDay();
  let month = date.getMonth();
  let year = date.getFullYear();
  return hours + ":" + minutes.substr(-2) + ", " + date.toDateString();
}
