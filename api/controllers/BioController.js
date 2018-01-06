/**
 * BioController
 *
 * @description :: Server-side logic for managing bios
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res, next){
		// Return bio images
		File.find({type: 'img'}, function(err, filesMeta){
			if(err) {
				req.session.flash = {
					err: err
				};
			}
			
			File.find({type: 'bioThumb'}, function(err, bioThumbs){
				if(err) {
					req.session.flash = {
						err: err
					};
				}
				
				res.view({
					bioThumbs: bioThumbs,
					filesMeta: filesMeta
				});
			});
		});
	}
};

