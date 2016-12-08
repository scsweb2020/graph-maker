import { Meteor } from 'meteor/meteor';
import { Graphs } from '/imports/api/graphs.js';

// If the database is empty on server start, create some sample data.
Meteor.startup(() => {
    // Load the data here after models are set up.
    const graph_data = Graphs.find();

    if (graph_data.count() === 0) {
        console.log("No data found in MongoDB.");
    }
    else {
        console.log("Data found in MongoDB.");
    }
});
