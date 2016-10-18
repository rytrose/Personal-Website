/**
 * FollowersController
 *
 * @description :: Server-side logic for managing followers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	'new': function(req, res){
		res.view();
	},

	// Creates a follower
	create: function(req, res, next){
		// Create a follower with form results in new.ejs
		Followers.create(req.params.all(), function followerCreated(err, follower) {

			// On error
			if(err) {
				console.log(err);
				req.session.flash = {
					err: err
				}

				// Redirect back to signup page
				return res.redirect('/followers/new');
			}

			// If successful, redirect to show action
			res.redirect('followers/confirmation/'+follower.id);
		});
	},

	// Confirmation that you are now a follower
	confirmation: function(req, res, next){
		Followers.findOne(req.param('id'), function foundFollower(err, follower) {
			if (err) return next(err);
			if (!follower) return next();
			res.view({
				follower: follower
			});
		});
	},

	index: function(req, res, next){

		// Get an array of all followers
		Followers.find(function foundFollowers(err, followers) {
			if (err) return next(err);
			// Pass array to /views/followers/index.ejs page
			res.view({
				followers: followers
			});
		});
	},

	destroy: function(req, res, next){
		Followers.findOne(req.param('id'), function foundFollower(err, follower) {
			if (err) return next(err);
			if (!follower) return next("Follower does not exist.");

			Followers.destroy(req.param('id'), function followerDestroyed(err) {
				if (err) return next(err);
			});

			res.redirect('/followers');
		});
	}
};
