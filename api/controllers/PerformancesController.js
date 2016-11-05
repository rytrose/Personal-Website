/**
 * PerformancesController
 *
 * @description :: Server-side logic for managing performances
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function(req, res, next){
		// Return performance thumbnails
		File.find({type: 'perThumb'}, function(err, thumbs){
			if(err) {
				req.session.flash = {
					err: err
				};
			}
	
			Performances.find(function(err, pers){
				if(err) {
					req.session.flash = {
						err: err
					};
				}
				
				res.view({
					thumbnails: thumbs,
					performances: pers	
				});
			});
		});
	},
	
	admin: function(req, res, next){
		// Get an array of all performances
		Performances.find(function foundPerformances(err, performances) {
			if (err) return next(err);
			// Pass array to /views/performances/index.ejs page
			res.view({
				performances: performances
			});
		});
	},
	
	new: function(req, res, next){
		res.view('performances/new');
	},
	
	create: function(req, res, next){
		Performances.create(req.params.all(), function performanceCreated(err, performance) {
			if(err) {
				req.session.flash = {
					err: err
				}
			}

			// If successful, return add success
			var addSuccessMessage = [{name: 'addSuccess', message: 'Performance added successfully!'}];
			req.session.flash = {
				err: addSuccessMessage
			}
			return res.redirect('/performances/new');
		});
	},
	
	edit: function(req, res, next){
		Performances.findOne(req.param('id'), function foundPerformance(err, performance){
			if(!performance){
				// If none, return error
				var noPerformanceError = [{name: 'noPerformance', message: 'No performance found'}];
				req.session.flash = {
					err: noPerformanceError
				}
				return res.redirect('/performances/admin');
			}

			return res.view({
				performance: performance
			});
		});
	},
	
	update: function(req, res, next){
		var perObj = {
			name: req.param('name'),
			type: req.param('type'),
			date: req.param('date'),
			link: req.param('link'),
			description: req.param('description')
		}
		
		Performances.update(req.param('id'), perObj, function performanceUpdated(err){
			if(err) {
				req.session.flash = {
					err: err
				}
				return res.redirect('/performances/edit' + req.param('id'));
			}

			return res.redirect('/performances/admin'); // TODO change to show
		});
	},
	
	show: function(req, res, next){
		Performances.findOne(req.param('id'), function foundPerformance(err, performance){
			if(!performance){
				// If none, return error
				var noPerformanceError = [{name: 'noPerformance', message: 'No performance found'}];
				req.session.flash = {
					err: noPerformanceError
				}
				return res.redirect('/performances/admin');
			}

			return res.view({
				performance: performance
			});
		});
	},
	
	destroy: function(req, res, next){
		Performances.findOne(req.param('id'), function foundPerformance(err, performance) {
			if (err) return next(err);
			if (!performance) return next("Performance does not exist.");

			Performances.destroy(req.param('id'), function performanceDestroyed(err) {
				if (err) return next(err);
			});

			res.redirect('/performances/admin');
		});
	},
	
};

