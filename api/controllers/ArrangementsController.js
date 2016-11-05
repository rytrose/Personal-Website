/**
 * ArrangementsController
 *
 * @description :: Server-side logic for managing arrangements
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	index: function(req, res, next){
		// Return arrangement thumbnails
		File.find({type: 'arrThumb'}, function(err, thumbs){
			if(err) {
				req.session.flash = {
					err: err
				};
			}
	
			Arrangements.find(function(err, arrs){
				if(err) {
					req.session.flash = {
						err: err
					};
				}
				
				res.view({
					thumbnails: thumbs,
					arrangements: arrs	
				});
			});
		});
	},

	admin: function(req, res, next){
		// Get an array of all arrangements
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
				return res.redirect('/arrangements/admin');
			}

			return res.view({
				arrangement: arrangement
			});
		});
	},

	update: function(req, res, next){
		var arrObj = {
			title: req.param('title'),
			instrumentation: req.param('instrumentation'),
			originalArtist: req.param('originalArtist'),
			description: req.param('description')
		}
		
		Arrangements.update(req.param('id'), arrObj, function arrangementUpdated(err){
			if(err) {
				req.session.flash = {
					err: err
				}
				return res.redirect('/arrangements/edit' + req.param('id'));
			}

			return res.redirect('/arrangements/admin'); // TODO change to show
		});
	},

	show: function(req, res, next){
		var arrangement;
		var pdf;
		
		Arrangements.findOne(req.param('id'), function foundArrangement(err, arr){
			if(!arr){
				// If none, return error
				var noArrangementError = [{name: 'noArrangement', message: 'No arrangement found'}];
				req.session.flash = {
					err: noArrangementError
				}
			}
			
			// Get pdf
			File.find({type: 'pdf', filename: arr.title + '.pdf'}, function(err, pdfFile){
				
				if(err) {
					req.session.flash = {
						err: err
					};
				}
				
				pdf = pdfFile;
				
				
				// Get mp3
				File.find({type: 'mp3', filename: arr.title + '.mp3'}, function(err, mp3){
				if(err) {
					req.session.flash = {
						err: err
					};
				}
				
				
				return res.view({
					arrangement: arr,
					pdf: pdf,
					mp3: mp3
				});
				
				});
			});
		});
	},

	destroy: function(req, res, next){
		Arrangements.findOne(req.param('id'), function foundArrangement(err, arrangement) {
			if (err) return next(err);
			if (!arrangement) return next("Arrangement does not exist.");

			Arrangements.destroy(req.param('id'), function arrangementDestroyed(err) {
				if (err) return next(err);
			});

			res.redirect('/arrangements');
		});
	},

};
