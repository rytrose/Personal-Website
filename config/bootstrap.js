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

    var web = new WebClient(token);
    var listChannelsIds = function() {
      web.channels.list(function(err, info) {
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
    var idToName = new Map();
    var idToUser = new Map();
    var idToChores = new Map();
    var chores = [
      'vacuum and clean the common room',
      'clean the kitchen area (counters, shelves, fridge if need be)',
      'wipe kitchen stove and take out garbage',
      'clean the common room bathroom',
      'clean outside area'
    ];
    var choreAssignment;
    var flag = true;
    var choreDate;
    var CHORES = 'C6TM6QK88';

    var initModel = function(cb) {
      web.users.list(function(err, info) {
        if (err) {
          console.log('Error:', err);
        }
        else {
          var users = info.members;
          var humanIndex = -1;
          for (var i = 0; i < users.length; i++) {
            if (!users[i].is_bot && users[i].name != 'slackbot') {
              humanIndex++;
              idToName.set(humanIndex, users[i].real_name);
              idToUser.set(humanIndex, users[i].name);
              idToChores.set(humanIndex, "")
            }
          }
          cb();
        }
      });
    }

    var postInit = function() {
      choreAssignment = new Array(idToName.size);
      for (var i = 0; i < choreAssignment.length; i++) {
        choreAssignment[i] = i;
      }
      var rotate = schedule.scheduleJob('0 0 * * 0', rotateChores); // '0 0 * * 0' Rotate chores on Sunday just after midnight
      var remind = schedule.scheduleJob('0 11 * * 3,6', runChoreReminder); // '0 11 * * 3,6' Remind people of chores at 11AM on Wed/Sat
    }
    
    var rotateChores = function() {
      runChoreAssignment(choreAssignment);
      
      choreDate = new Date(Date.now());
      
      var text = "*CHORES FOR THE WEEK OF " + (choreDate.getMonth() + 1) + "/" + choreDate.getDate() + "*\n\n";
      text += getChoreString();
      
      web.chat.postMessage(CHORES, text, function(err, res){
        if(err) {
          console.log(err);
        }
      });
    }
    
    var getChoreString = function() {
      var text = "";
      for (var i = 0; i < idToName.size; i++) {
        text += idToName.get(i) + " (<@" + idToUser.get(i) + "|" + idToUser.get(i) + ">) your chores are: ";
        text += idToChores.get(i).slice(0, -5) + "\n\n";
      }
      return text;
    }

    var runChoreReminder = function() {

      var text = "*CHORES REMINDER!*\n";
      text += "_All chores are due by 11:59PM on Saturday!_\n\n";

      text+= getChoreString();

      web.chat.postMessage(CHORES, text, function(err, res){
        if(err) {
          console.log(err);
        }
      });
    }

    var runChoreAssignment = function(choreAssignment) {
      rotate(choreAssignment);
      
      for (var i = 0; i < idToChores.size; i++) {
        idToChores.set(i, "");
      }

      for (var i in chores) {
        var assignedIndex = i % choreAssignment.length;
        var id = choreAssignment[assignedIndex];
        idToChores.set(id, idToChores.get(id) + chores[i] + " AND ");
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
