

(function(TagsTitle) {
	
	function initialise() {
		$(window).on('action:ajaxify.contentLoaded', function () {
			// Arreglar el bug de "+"
			app.processPageCopy = app.processPage;

			app.processPage = function()
			{
				try{
					app.processPageCopy();
				}catch(e)
				{
					console.log(e);
				}
			};
		});
	}

	initialise();

})(window.TagsTitle);
