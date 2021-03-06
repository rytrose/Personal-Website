/**
 * Mthauz.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
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
        },

        choreCount: {
            type: 'integer',
            required: true
        }
    },

    rotateChores: function() {
        Mthauz.find(function foundMthauzers(err, people) {
            if (err) return next(err);
            var idOrder = new Array(people.length);
            var newChores = new Array(people.length);
            var newChoreCount = new Array(people.length);

            // Shuffle!
            _.each(people, function(person, i) {
                idOrder[i] = person.slackId;
                if ((i + 1) == newChores.length) {
                    newChores[0] = person.chore;
                    newChoreCount[0] = person.choreCount;
                }
                else {
                    newChores[i + 1] = person.chore;
                    newChoreCount[i + 1] = person.choreCount;
                }
            });

            // Update newChores
            _.each(idOrder, function(id, i) {
                updatedChore = newChores[i];
                updatedChoreCount = newChoreCount[i];


                Mthauz.update({ slackId: id }, { chore: updatedChore, choreCount: updatedChoreCount }, function personUpdated(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    },

    addChores: function(newChores) {

        var assignChore = function(newChores, ind) {
            var highestCount = 0;
            var slackIdToAddTo = "";
            var prevChores = "";

            Mthauz.find(function foundMthauzers(err, ret) {
                var people = ret;
                assign(people);
            });

            var assign = function(people) {
                if (ind == newChores.length) return;
                newChore = newChores[ind];

                console.log("New Chore: " + newChore);

                _.each(people, function(person) {
                    if (person.choreCount > highestCount) {
                        highestCount = person.choreCount;
                    }
                });

                _.every(people, function(person, i) {
                    if (person.choreCount < highestCount) {
                        highestCount = person.choreCount + 1;
                        slackIdToAddTo = person.slackId;
                        prevChores = person.chore;
                        return false;
                    }
                    else if (person.choreCount == highestCount && i == people.length - 1) {
                        highestCount = person.choreCount + 1;
                        slackIdToAddTo = person.slackId;
                        prevChores = person.chore;
                        return false;
                    }
                    return true;
                });

                if (prevChores == "") {
                    prevChores = newChore;
                }
                else {
                    prevChores = prevChores + " AND " + newChore;
                }

                console.log("Updating " + slackIdToAddTo + " to " + prevChores);
                Mthauz.update({ slackId: slackIdToAddTo }, { chore: prevChores, choreCount: highestCount }, function(err) {
                    if (err) {
                        console.log(err)

                    }
                    else {
                        assignChore(newChores, ind + 1);
                    }
                });
            }

        }

        assignChore(newChores, 0);

    },

    weeklyChores: function() {
        Mthauz.rotateChores();

        sails.mthauz.choreDate = new Date(Date.now());

        var text = "*CHORES FOR THE WEEK OF " + (sails.mthauz.choreDate.getMonth() + 1) + "/" + sails.mthauz.choreDate.getDate() + "*\n\n";

        var callback = function(choreString) {
            text += choreString;

            sails.mthauz.web.chat.postMessage(sails.mthauz.CHORES_CHANNEL, text, function(err, res) {
                if (err) {
                    console.log(err);
                }
            });
        };
        
        Mthauz.getChoreString(callback);
    },

    runChoreReminder: function() {

        var text = "*CHORES REMINDER!*\n";
        text += "_All chores are due by 11:59PM on Saturday!_\n\n";

        var callback = function(choreString) {
            text += choreString;

            sails.mthauz.web.chat.postMessage(sails.mthauz.CHORES_CHANNEL, text, function(err, res) {
                if (err) {
                    console.log(err);
                }
            });
        };
        
        Mthauz.getChoreString(callback);
    },

    getChoreString: function(cb) {
        var text = "";

        Mthauz.find(function foundMthauzers(err, people) {
            if (err) return next(err);
            _.each(people, function(person) {
                text += person.name + " (<@" + person.slackUsername + "|" + person.slackUsername + ">) your chores are: " + person.chore + "\n\n";
            });

            cb(text);
        });
    },

};
