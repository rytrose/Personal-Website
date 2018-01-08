/**
 * InteractiveMusicController
 *
 * @description :: Server-side logic for updating interactive music state
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	update: function(req, res, next){
	    console.log("Music state update received.");
		req.session.music = req.param('music');
		req.session.save();
		return;
	},
}