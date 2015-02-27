

(function(TagsTitle) {

	var specialTags = [	"", "[TemaSerio]", "[Plataforma]", "[Chupipandi]",
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
					{	//$(".tags").attr("disabled", true);
						$(".row.category-tag-row").append("<b>Elige las etiquetas/prefijos: <select id='tagsSelector' style='width:200px' class='form-control category-list' onchange='addTag()'></select></b>");
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
		$(".title.form-control").val($(".title.form-control").val()+specialTags[$("#tagsSelector").val()]);
	}

	initialise();

})(window.TagsTitle);
