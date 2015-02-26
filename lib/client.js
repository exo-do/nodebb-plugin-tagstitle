

(function(TagsTitle) {

	var specialTags = [	"[TemaSerio]", "[Plataforma]", "[Chupipandi]",
						"[Tutorial]", "[Debate]", "[Informacion]",
						"[Duda]", "[Solucionado]", "[Importante]", "[Gore]",
						"+18", "+hd", "+prv",
						"Limpiar lista de tags"];
	
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
					{	$(".tags").attr("disabled", true);
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
		if($(".tags") && $(".tags").val() == "")
		{
			$(".tags").val(specialTags[$("#tagsSelector").val()]);
		}
		else
		{
			$(".tags").val($(".tags").val()+","+specialTags[$("#tagsSelector").val()]);
		}
		$(".title.form-control").val($(".title.form-control").val()+specialTags[$("#tagsSelector").val()]);
		if( $("#tagsSelector").val() == specialTags.length-1 )
		{
			$(".tags").val("");
			$(".title.form-control").val("");
		}
		$(".ui-autocomplete-input").val($(".tags").val());
	}

	initialise();

})(window.TagsTitle);
