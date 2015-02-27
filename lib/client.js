

(function(TagsTitle) {

	var specialTags = [	"Elige las etiquetas/prefijos", "[TemaSerio]", "[Plataforma]", "[Chupipandi]",
						"[Tutorial]", "[Debate]", "[Informacion]", "[Encuesta]",
						"[Duda]", "[Solucionado]", "[Importante]", "[Gore]",
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
				  	if( $(".tags") && $(".row.category-tag-row") && !$(".title.form-control").is(":disabled") )
					{	$(".tags-container.col-sm-9").css("width", "50%");
						$(".row.category-tag-row").css("display", "inline");
						$(".row.category-tag-row").append("<b><select id='tagsSelector' style='width:20%' class='form-control category-list' onchange='addTag()'></select></b>");
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
		if( specialT > 11 )
		{
			$(".title.form-control").val($(".title.form-control").val()+" "+specialTags[$("#tagsSelector").val()]);
		}
		else
		{
			$(".title.form-control").val(specialTags[$("#tagsSelector").val()]+" "+$(".title.form-control").val());
		}
	}

	initialise();

})(window.TagsTitle);
