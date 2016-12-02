import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import { Graphs } from '/imports/api/graph-maker.js';

import './app-graph-maker.css';
import './app-graph-maker.html';

Template.App_graphMaker.onCreated(function appGraphMakerOnCreated() {
    const graph_data = Graphs.find();
    // const graph_data = Graphs.example();
    // const graph_data = Graphs.findOne({id: 'example-graph'});
    console.log("LOOK AT ME! LOOK HERE! HEY HEY! I'm the CLIENT!!!");
    console.log(graph_data);
    if (graph_data.count() === 0) {
        console.log("No data. Sorry.");
    }
    else {
        console.log("Pa-ching! Data found!")
    }
});
