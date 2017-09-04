/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  sails.on('lifted', function() {

    var WebClient = require('@slack/client').WebClient;
    sails.mthauz.token = process.env.MTHAUZ_SLACK_APP_OAUTH;
    sails.mthauz.web = new WebClient(token);
    
    sails.mthauz.chores = [
      'vacuum and clean the common room',
      'clean the kitchen area (counters, shelves, fridge if need be)',
      'wipe kitchen stove and take out garbage',
      'clean the common room bathroom',
      'clean outside area'
    ];
    sails.mthauz.choreDate = null;
    sails.mthauz.CHORES_CHANNEL = 'C6TM6QK88';
    sails.mthauz.TESTING_CHANNEL = 'C6UPY77C4';
    
    var schedule = require('node-schedule');
    // var rotate = schedule.scheduleJob('1 0 * * 0', Mthauz.weeklyChores); // '0 0 * * 0' Rotate chores on Sunday just after midnight
    // var remind = schedule.scheduleJob('0 11 * * 3,6', Mthauz.runChoreReminder); // '0 11 * * 3,6' Remind people of chores at 11AM on Wed/Sat

  });

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
