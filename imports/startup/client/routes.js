import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '../../ui/layouts/app-body.js';
import '../../ui/pages/app-not-found.js';

// Index is currently set to the Meteor installation test page
FlowRouter.route('/', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', { top: "hello", main: "info"});
    },
});

// the App_notFound template is used for unknown routes and missing lists
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
