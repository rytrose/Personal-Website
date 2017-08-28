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
    // Your post-lift startup code here
    var WebClient = require('@slack/client').WebClient;
    var token = process.env.MTHAUZ_SLACK_APP_OAUTH;
    sails.mthauz = {};

    sails.mthauz.web = new WebClient(token);
    var listChannelsIds = function() {
      sails.mthauz.web.channels.list(function(err, info) {
        if (err) {
          console.log('Error:', err);
        }
        else {
          for (var i in info.channels) {
            console.log(info.channels[i].name + ": " + info.channels[i].id);
          }
        }
      });
    }

    var schedule = require('node-schedule');
    sails.mthauz.idToName = new Map();
    sails.mthauz.idToUser = new Map();
    sails.mthauz.idToChores = new Map();
    sails.mthauz.slackIdToId = new Map();
    sails.mthauz.chores = [
      'vacuum and clean the common room',
      'clean the kitchen area (counters, shelves, fridge if need be)',
      'wipe kitchen stove and take out garbage',
      'clean the common room bathroom',
      'clean outside area'
    ];
    sails.mthauz.choreAssignment = [];
    sails.mthauz.choreDate = null;
    sails.mthauz.CHORES_CHANNEL = 'C6TM6QK88';
    sails.mthauz.TESTING_CHANNEL = 'C6UPY77C4';

    var initModel = function(cb) {
      sails.mthauz.web.users.list(function(err, info) {
        if (err) {
          console.log('Error:', err);
        }
        else {
          var users = info.members;
          var humanIndex = -1;
          for (var i = 0; i < users.length; i++) {
            if (!users[i].is_bot && users[i].name != 'slackbot') {
              humanIndex++;
              sails.mthauz.slackIdToId.set(users[i].id, humanIndex);
              sails.mthauz.idToName.set(humanIndex, users[i].real_name);
              sails.mthauz.idToUser.set(humanIndex, users[i].name);
              sails.mthauz.idToChores.set(humanIndex, "");
            }
          }
          cb();
        }
      });
    }

    var postInit = function() {
      sails.mthauz.choreAssignment = new Array(sails.mthauz.idToName.size);
      for (var i = 0; i < sails.mthauz.choreAssignment.length; i++) {
        sails.mthauz.choreAssignment[i] = i;
      }
      rotateChores();
      var rotate = schedule.scheduleJob('0 0 * * 0', rotateChores); // '0 0 * * 0' Rotate chores on Sunday just after midnight
      var remind = schedule.scheduleJob('0 11 * * 3,6', runChoreReminder); // '0 11 * * 3,6' Remind people of chores at 11AM on Wed/Sat
    }
    
    var rotateChores = function() {
      runChoreAssignment(sails.mthauz.choreAssignment);
      
      sails.mthauz.choreDate = new Date(Date.now());
      
      var text = "*CHORES FOR THE WEEK OF " + (sails.mthauz.choreDate.getMonth() + 1) + "/" + sails.mthauz.choreDate.getDate() + "*\n\n";
      text += getChoreString();
      
      sails.mthauz.web.chat.postMessage(sails.mthauz.CHORES_CHANNEL, text, function(err, res){
        if(err) {
          console.log(err);
        }
      });
    }
    
    var getChoreString = function() {
      var text = "";
      for (var i = 0; i < sails.mthauz.idToName.size; i++) {
        text += sails.mthauz.idToName.get(i) + " (<@" + sails.mthauz.idToUser.get(i) + "|" + sails.mthauz.idToUser.get(i) + ">) your chores are: ";
        text += sails.mthauz.idToChores.get(i).slice(0, -5) + "\n\n";
      }
      return text;
    }

    var runChoreReminder = function() {

      var text = "*CHORES REMINDER!*\n";
      text += "_All chores are due by 11:59PM on Saturday!_\n\n";

      text+= getChoreString();

      sails.mthauz.web.chat.postMessage(sails.mthauz.CHORES_CHANNEL, text, function(err, res){
        if(err) {
          console.log(err);
        }
      });
    }

    var runChoreAssignment = function(choreAssignment) {
      rotate(choreAssignment);
      
      for (var i = 0; i < sails.mthauz.idToChores.size; i++) {
        sails.mthauz.idToChores.set(i, "");
      }

      // Assign chores
      for (var i in sails.mthauz.chores) {
        var assignedIndex = i % sails.mthauz.choreAssignment.length;
        var id = choreAssignment[assignedIndex];
        sails.mthauz.idToChores.set(id, sails.mthauz.idToChores.get(id) + sails.mthauz.chores[i] + " AND ");
      }
    }

    var rotate = function(array) {
      var temp = array.shift();
      array.push(temp);
    }

    initModel(postInit);

    listChannelsIds();

  });

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
