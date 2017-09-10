/**
 * Mthauz.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        id: {
            type: 'integer',
            autoIncrement: true
        },

        name: {
            type: 'string',
            required: false
        },

        slackId: {
            type: 'string',
            required: false
        },

        slackUsername: {
            type: 'string',
            required: true,
            unique: true,
        },

        chore: {
            type: 'string',
            required: false,
        }
    },

    rotateChores: function() {
        Mthauz.find(function foundMthauzers(err, people) {
            if (err) return next(err);
            var newChores = new Array(people.length);
            var i = 0;

            // Shuffle chores into newChores
            _.each(people, function(person) {
                if ((i + 1) == newChores.length) {
                    newChores[0] = person.chore;
                }
                else {
                    newChores[i + 1] = person.chore;
                }
                i++;
            });

            i = 0;

            // Update newChores
            _.each(people, function(person) {
                var update = person;
                update.chore = newChores[i];

                Mthuaz.update(person.id, update, function personUpdated(err) {
                    if (err) {
                        console.log(err);
                    }
                });
                i++;
            });
        });
    },

    addChores: function(newChores) {
        console.log("Hit addChores: " + newChores);
        Mthauz.find(function foundMthauzers(err, people) {
            if (err) console.log(err);
            _.each(newChores, function(newChore) {
                var idToAddTo = 0;
                var andCount = 0;
                var prevChores = "";
                _.each(people, function(person) {
                    var count = (person.chore.match(/ AND /g) || []).length;
                    if (count > andCount) {
                        idToAddTo = person.id;
                        prevChores = person.chore;
                    }
                });

                if (prevChores == "") {
                    prevChores = newChore;
                }
                else {
                    prevChores += " AND " + newChore;
                }

                Mthauz.update(idToAddTo, { chore: prevChores }, function(err) { if (err) { console.log(err) } });

            });

        });
    },

    getChoreString: function() {
        var text = "";

        Mthauz.find(function foundMthauzers(err, people) {
            if (err) return next(err);
            _.each(people, function(person) {
                text += person.name + " (<@" + person.slackUsername + "|" + person.slackUsername + ">) your chores are: " + person.chore + "\n\n";
            });
        });

        return text;
    },

    weeklyChores: function() {
        Mthauz.rotateChores();

        sails.mthauz.choreDate = new Date(Date.now());

        var text = "*CHORES FOR THE WEEK OF " + (sails.mthauz.choreDate.getMonth() + 1) + "/" + sails.mthauz.choreDate.getDate() + "*\n\n";
        text += getChoreString();

        sails.mthauz.web.chat.postMessage(sails.mthauz.CHORES_CHANNEL, text, function(err, res) {
            if (err) {
                console.log(err);
            }
        });
    },

    runChoreReminder: function() {

        var text = "*CHORES REMINDER!*\n";
        text += "_All chores are due by 11:59PM on Saturday!_\n\n";

        text += Mthauz.getChoreString();

        sails.mthauz.web.chat.postMessage(sails.mthauz.CHORES_CHANNEL, text, function(err, res) {
            if (err) {
                console.log(err);
            }
        });
    },

};
