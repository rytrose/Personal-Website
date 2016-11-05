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
		var s3_config = sails.config.s3;
		var key = s3_config.key;
		var secret = s3_config.secret;

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

	destroy: function(req, res, next){
		var aws = require('aws-sdk');
		aws.config.loadFromPath('./config/s3config.json');
		var s3 = new aws.S3();
		
		
		
		File.findOne(req.param('id'), function foundFile(err, file) {
			if (err) return next(err);
			if (!file) return next("File does not exist.");
			
			var params = {
				Bucket: 'rytrose-personal-website',
				Key: file.fd
			};
			
			s3.deleteObject(params, function(err, data){
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
