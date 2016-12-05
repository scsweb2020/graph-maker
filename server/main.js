import '/imports/startup/server';
import '/imports/startup/both';

import { Graphs } from '/imports/api/graphs.js';
import { MyUsers } from '/imports/api/myUsers.js';

// import { Meteor } from 'meteor/meteor';
//
// Meteor.startup(() => {
//   // code to run on server at startup
// });

Meteor.publish('allGraphs', function() {
  return Graphs.find();
});

Meteor.publish('myUsers', function() {
  return MyUsers.find();
});
