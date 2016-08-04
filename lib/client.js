

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

		require(['composer', 'string'], function(composer, String) {
			S = String;

			$(window).on('action:composer.loaded', function(event, data) {
				setTimeout( function(){
					//console.log($(".form-control.category-list")[0]);
					//console.log($($(".form-control.category-list")[0]).is(":disabled"));
				  if( $(".tags") && $(".row.category-tag-row") && $(".form-control.category-list")[0] && !$($(".form-control.category-list")[0]).is(":disabled") )
					{
						//$(".tags-container.col-sm-9").css("width", "50%");
						//$(".row.category-tag-row").css("display", "inline");
						//$(".title-container").append("<div class='composer-list col-lg-3 col-md-6 col-sm-6 col-xs-6'><select id='tagsSelector' class='form-control category-list' onchange='addTag()'></select></div>");

						//$(".category-list-container").append("<select id='tagsSelector' class='form-control category-list' onchange='addTag()'></select>");
						$(".title-container").append("<div class='composer-list col-lg-3 col-md-12 col-sm-12 col-xs-12'><select id='tagsSelector' class='form-control category-list' style='-moz-appearance: none; -webkit-appearance:none; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGhlaWdodD0iNTEycHgiIGlkPSJMYXllcl8xIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjUxMnB4IiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48cGF0aCBkPSJNOTguOSwxODQuN2wxLjgsMi4xbDEzNiwxNTYuNWM0LjYsNS4zLDExLjUsOC42LDE5LjIsOC42YzcuNywwLDE0LjYtMy40LDE5LjItOC42TDQxMSwxODcuMWwyLjMtMi42ICBjMS43LTIuNSwyLjctNS41LDIuNy04LjdjMC04LjctNy40LTE1LjgtMTYuNi0xNS44djBIMTEyLjZ2MGMtOS4yLDAtMTYuNiw3LjEtMTYuNiwxNS44Qzk2LDE3OS4xLDk3LjEsMTgyLjIsOTguOSwxODQuN3oiLz48L3N2Zz4=); background-size: 16px; background-position: 97% 50%;  background-repeat: no-repeat;'onchange='addTag()'></select></div>");
						$(".composer-list select").css("padding", "5px 5px 5px 10px");
						$(".composer-list select").css("height", "30px");
						//$("html.composing.mobile .composer .title-container .composer-list").css("border-top","1px solid #eee");
						for(var i=0;i<specialTags.length;i++)
						{
							$("#tagsSelector").append(new Option(specialTags[i], i));
						}
						//$(".composer-list option").css("background-color", "white");
						//$(".composer-list option").css("color", "black");
						//$(".composer-list option").css("background-color", "#3b8ec2");
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
