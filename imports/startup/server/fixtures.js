import { Meteor } from 'meteor/meteor';
import { Graphs } from '/imports/api/graph-maker.js';

// If the database is empty on server start, create some sample data.
Meteor.startup(() => {
    // Load the data here after models are set up.
    const graph_data = Graphs.find();
    // const graph_data = Graphs.example();
    // const graph_data = Graphs.findOne({id: 'example-graph'});
    console.log("LOOK AT ME! THIS IS THE SERVER SIDE!");
    console.log(graph_data);
    if (graph_data.count() === 0) {
        console.log("No data. Sorry.");
    }
    else {
        console.log("Pa-ching! Data found!");
    }
});
