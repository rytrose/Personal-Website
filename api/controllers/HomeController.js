/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function(req, res, next){
		// Return homepage images
		File.find({type: 'testType'}, function(err, filesMeta){
			if(err) {
				req.session.flash = {
					err: err
				};
			}
			res.view({
				filesMeta: filesMeta
			});
		});
	}
	
};
