

(function(TagsTitle) {

	var specialTags = [	"Elige los prefijos", "[TemaSerio]", "[Plataforma]", "[Peña]",
						"[Tutorial]", "[Debate]", "[Info]","[Noticia]",
						"[Review]", "[Encuesta]",
						"[Duda]", "[Importante]","[Chollo]",
						"+GORE", "+nsfw", "+nsfl",
						"+18", "+hd", "+prv"];

	function initialise() {
		$(window).on('load', function () {
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

	$(window).on('action:composer.loaded', function(e, data) {
			require(['composer', 'string'], function(composer, String) {
				S = String;
				if( $(".tags") && $(".row.category-tag-row") && 
					$(".form-control.category-list")[0] &&
					 !$($(".form-control.category-list")[0]).is(":disabled") )
					{

						if($("#tagsSelector").length==0){
							$(".title-container").append("<div class='category-list-container col-lg-3 col-md-12 col-sm-12 col-xs-12'><select id='tagsSelector' class='form-control category-list' onchange='addTag()'></select></div>");
							
							for(var i=0;i<specialTags.length;i++)
							{
								$("#tagsSelector").append(new Option(specialTags[i], i));
							}
						}
					}
			});
		});
	}

	addTag = function()
	{
		var specialT = $("#tagsSelector").val();
		if( specialTags[specialT].indexOf("+") === 0 )
		{
			$(".title.form-control").val($(".title.form-control").val()+" "+specialTags[$("#tagsSelector").val()]);
		}
		else if(specialT > 0)
		{
			$(".title.form-control").val(specialTags[$("#tagsSelector").val()]+" "+$(".title.form-control").val());
		}
	}

	initialise();

})(window.TagsTitle);
