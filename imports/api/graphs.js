import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:collection-helpers';

export const Graphs = new Mongo.Collection('graphs');

Graph = function(user, graphData, title, description) {

  this.userID = user._id;
  this.userName = user.userName;
  this.metaData = {}
  this.graphData = graphData;
  let currentTime = new Date().getTime();
  this.createTime = currentTime;
  this.lastEditTime = currentTime;
  this.title = title ? "" : "Untitled graph";
  this.description = description ? "" : "Untitled graph";

}

Graphs.helpers({
    example() {
        return this.findOne({id: "example-graph"});
    },
});
