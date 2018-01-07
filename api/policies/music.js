/**
 * music
 *
 * @module      :: Policy
 * @description :: Passes interactive music info back and forth
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {
    if(!req.session.music) {
        console.log("Creating new music state.");
        req.session.music = JSON.stringify({
            test: 1
        });
    }
    console.log("Music state: " + req.session.music);
    next();
};