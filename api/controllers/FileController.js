/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function(req, res, next){
		// Get an array of all filess
		File.find(function foundFiles(err, files) {
			if (err) return next(err);
			// Pass array to /views/file/index.ejs page
			res.view({
				files: files
			});
		});
	},

	new: function(req, res){
		res.view('file/new');
	},

	// Uploads a file(s) to the database
	create: function(req, res, next){
		var key = process.env.s3key;
		var secret = process.env.s3secret;

		req.file('toUpload').upload({
			adapter: require('skipper-better-s3'),
			key: key,
			secret: secret,
			bucket: 'rytrose-personal-website',
			s3params: { ACL: 'public-read' }
		}, function (err, files) {
			if (err) return res.serverError(err);
			for(var i = 0; i < files.length; i++) {
					var fd = files[i].fd;
					// Store filename and type in file model
					File.create({fd: fd, filename: req.param("filename"), type: req.param("type")}, function(err, file){
						if(err) {
							console.log(err);
							req.session.flash = {
								err: err
							}
						}
					});
			};
			// If successful, return files uploaded
			var uploadSuccessMessage = [{name: 'uploadSuccess', message: files.length + ' file(s) uploaded successfully!'}];
			req.session.flash = {
				err: uploadSuccessMessage
			}
			return res.redirect('/file/new');
		});
	},
	
	edit: function(req, res, next){
		File.findOne(req.param('id'), function foundFile(err, file){
			if(!file){
				// If none, return error
				var noFileError = [{name: 'noFile', message: 'No file found'}];
				req.session.flash = {
					err: noFileError
				}
				return res.redirect('/file');
			}

			return res.view({
				file: file
			});
		});
	},
	
	update: function(req, res, next){
		var fileObj = {
			filename: req.param('filename'),
			type: req.param('type')
		}
		
		File.update(req.param('id'), fileObj, function fileUpdated(err){
			if(err) {
				req.session.flash = {
					err: err
				}
				return res.redirect('/file/edit' + req.param('id'));
			}

			return res.redirect('/file'); // TODO change to show
		});
	},

	destroy: function(req, res, next){
		
		File.findOne(req.param('id'), function foundFile(err, file) {
			if (err) return next(err);
			if (!file) return next("File does not exist.");
			
			var options = {
				key: process.env.s3key,
				secret: process.env.s3secret,
				bucket: 'rytrose-personal-website'
			};
			
			var adapter = require('skipper-better-s3')(options);
			
			adapter.rm(file.fd, function(err, res){
				if(err) return next(err);
				else console.log('Deleted from s3.');
			});

			File.destroy(req.param('id'), function fileDestroyed(err) {
				if (err) return next(err);
			});

			res.redirect('/file');
		});
	},

};
