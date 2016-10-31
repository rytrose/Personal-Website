/**
 * ArrangementsController
 *
 * @description :: Server-side logic for managing arrangements
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function(req, res, next){
		// Get an array of all filess
		Arrangements.find(function foundArrangements(err, arrangements) {
			if (err) return next(err);
			// Pass array to /views/arrangements/index.ejs page
			res.view({
				arrangements: arrangements
			});
		});
	},

	new: function(req, res, next){
		res.view('arrangements/new');
	},

	create: function(req, res, next){
		Arrangements.create(req.params.all(), function arrangementCreated(err, arrangement) {
			if(err) {
				req.session.flash = {
					err: err
				}
			}

			// If successful, return add success
			var addSuccessMessage = [{name: 'addSuccess', message: 'Arrangement added successfully!'}];
			req.session.flash = {
				err: addSuccessMessage
			}
			return res.redirect('/arrangements/new');
		});
	},

	edit: function(req, res, next){
		Arrangements.findOne(req.param('id'), function foundArrangement(err, arrangement){
			if(!arrangement){
				// If none, return error
				var noArrangementError = [{name: 'noArrangement', message: 'No arrangement found'}];
				req.session.flash = {
					err: noArrangementError
				}
				return res.redirect('/arrangements');
			}

			return res.view({
				arrangement: arrangement
			});
		});
	},

	update: function(req, res, next){
		Arrangements.update(req.param('id'), req.params.all(), function arrangementUpdated(err){
			if(err) {
				req.session.flash = {
					err: err
				}
			}

			return res.redirect('/arrangements/show/' + req.param('id'));
		});
	},

	show: function(req, res, next){
		Arrangements.findOne(req.param('id'), function foundArrangement(err, arrangement){
			if(!arrangement){
				// If none, return error
				var noArrangementError = [{name: 'noArrangement', message: 'No arrangement found'}];
				req.session.flash = {
					err: noArrangementError
				}
			}

			// GET MP3

			return res.view({
				arrangement: arrangement
			});
		});
	},

	destroy: function(req, res, next){
		Arrangements.findOne(req.param('id'), function foundArrangement(err, arrangement) {
			if (err) return next(err);
			if (!arrangement) return next("Arrangement does not exist.");

			File.destroy(req.param('id'), function arrangementDestroyed(err) {
				if (err) return next(err);
			});

			res.redirect('/arrangement');
		});
	},

};
