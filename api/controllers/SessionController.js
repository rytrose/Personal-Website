/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	'new': function(req, res){

		res.view('session/new');
	},

	create: function(req, res, next){

		// Check for password
		if(!req.param('password')){
			// Build a error for the flash message
			var passwordRequiredError = [{name: 'passwordRequired', message: 'You must enter a password.'}]

			req.session.flash = {
				err: passwordRequiredError
			}

			res.redirect('/session/new');
			return;
		}

		var bcrypt = require('bcrypt');
		var admin_config = sails.config.admin;
    var adminPassword = admin_config.password;

		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(adminPassword, salt, function passwordEncrypted(err, encryptedPassword) {

				// Validate incoming password
				bcrypt.compare(req.param('password'), encryptedPassword, function(err, valid){
					if(err) return next(err);

					// If passwords don't match
					if(!valid){
						var passwordMismatchError = [{name: 'passwordMismatch', message: 'Incorrect password.'}];
						req.session.flash = {
							err: passwordMismatchError
						}
						res.redirect('/session/new');
						return;
					}

					// If passwords do match
					req.session.authenticated = true;
					res.redirect('/');
					// res.redirect(req.session.path);
					return;
				});
	    });
		});
	},

	destroy: function(req, res, next) {
		// Logs out of admin
		req.session.destroy();
		res.redirect('/');
		return;
	}
};
