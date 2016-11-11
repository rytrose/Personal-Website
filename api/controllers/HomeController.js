/**
 * HomeController
 *
 * @description :: Server-side logic for managing homes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function(req, res, next){
		// Return homepage items
		File.find({type: 'arrThumb'}, function(err, arrThumbs){
			if (err) return next(err);
			
			// arrThumbs
			
			Arrangements.find(function(err, arrs){
				if (err) return next(err);
				
				// arrs
				
				Performances.find(function foundPerformances(err, pers) {
					if (err) return next(err);
					
					// pers
					
					res.view({
						arrThumbs: arrThumbs,
						arrs: arrs,
						pers: pers
					});
				});
			});
		});
	},
	
};
