import { Mongo } from 'meteor/mongo';
import { Factory } from 'meteor/dburles:collection-helpers';

export const Graphs = new Mongo.Collection('graphs');

Graphs.helpers({
    example() {
        return this.findOne({id: "example-graph"});
    },
});
