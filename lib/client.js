

(function(TagsTitle) {

	var specialTags = [	"Elige las etiquetas/prefijos", "[TemaSerio]", "[Plataforma]", "[Peña]",
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

		require(['composer', 'string'], function(composer, String) {
			S = String;
			
			$(window).on('action:composer.loaded', function(event, data) {
				setTimeout( function(){
					console.log($(".form-control.category-list")[0]);
					console.log($($(".form-control.category-list")[0]).is(":disabled"));
				  	if( $(".tags") && $(".row.category-tag-row") && $(".form-control.category-list")[0] && !$($(".form-control.category-list")[0]).is(":disabled") )
					{	$(".tags-container.col-sm-9").css("width", "50%");
						$(".row.category-tag-row").css("display", "inline");
						$(".title-container").append("<div class='composer-list col-lg-3 col-md-6 col-sm-6 col-xs-6'><select id='tagsSelector' class='form-control category-list' onchange='addTag()'></select></div>");
						for(var i=0;i<specialTags.length;i++)
						{
							$("#tagsSelector").append(new Option(specialTags[i], i));
						}
					}
				}, 100); // Hay que dar tiempo a que se muestre para poder desactivar bien ..
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
