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
    }
}
