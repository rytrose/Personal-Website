/**
 * PerformancesController
 *
 * @description :: Server-side logic for managing performances
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    slack: function(req, res, next) {
        var fs = require('fs');
        var markov = require('markov');

        var event = req.body.event;

        if (event) {
            if (event.text) {
                if (event.text.match(/(mthauzbot|bot|shimon)((?!(mychore)).)*$/)) {
                    split = event.text.split(' ')[0];
                    console.log(split);
                    if (split == 'mthauzbot' || split == 'bot' || split == 'shimon') {

                        var randomInt = function(min, max) {
                            min = Math.ceil(min);
                            max = Math.floor(max);
                            return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
                        }

                        var m = markov(1);
                        var s = fs.createReadStream(__dirname + '/shimon.txt');
                        m.seed(s, function() {
                            var response = m.respond(event.text, randomInt(1, 9)).join(' ');
                            if (!response) {
                                console.log("Couldn't find key.");
                                response = m.respond("shimon");
                            }

                            sails.mthauz.web.chat.postMessage(event.channel, response, function(err, res) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        });
                    }
                }

                if (event.text.match(/(mthauzbot|bot|shimon) mychore/)) {
                    var text = "";

                    var id = sails.mthauz.slackIdToId.get(event.user)
                    var name = sails.mthauz.idToName.get(id);
                    var chores = sails.mthauz.idToChores.get(id).slice(0, -5);

                    text += "_" + name + "_, your chores are: *" + chores + "*";

                    sails.mthauz.web.chat.postMessage(event.channel, text, function(err, res) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            }
        }

        res.ok({ "challenge": req.body.challenge });
    },

    setupModel: function(req, res, next) {
        var WebClient = require('@slack/client').WebClient;
        var token = process.env.MTHAUZ_SLACK_APP_OAUTH;
        var web = new WebClient(token);
        var schedule = require('node-schedule');

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

        console.log("Hit setup model.");

        var initModel = function(cb) {
            web.users.list(function(err, info) {
                if (err) {
                    console.log('Error:', err);
                }
                else {
                    var users = info.members;
                    for (var i = 0; i < users.length; i++) {
                        if (!users[i].is_bot && users[i].name != 'slackbot') {
                            Mthauz.create({ name: users[i].real_name, slackId: users[i].id, slackUsername: users[i].name, chore: "" }, function(err, file) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                        }
                    }
                    cb();
                }
            });
        }

        var postInit = function() {
            Mthauz.find(function foundMthauzers(err, people) {
                if (err) return next(err);
                res.send({
                    people: people
                });
            });
        }

        initModel(postInit);

    },

    rotateChores: function(req, res, next) {
        Mthauz.rotateChores();

        Mthauz.find(function foundMthauzers(err, people) {
            if (err) return next(err);
            res.send({
                people: people
            });
        });
    },

    addChores: function(req, res, next) {
        console.log("Hit addChores.");
        Mthauz.addChores(req.params.chores);

        Mthauz.find(function foundMthauzers(err, people) {
            if (err) return next(err);
            res.send({
                people: people
            });
        });
    },
    
    getModel: function(req, res, next) {
        console.log("Hit getModel.");
        Mthauz.find(function foundMthauzers(err, people) {
            if (err) return next(err);
            res.send({
                people: people
            });
        });
    },


}
