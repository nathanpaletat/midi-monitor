function init_konsole(hide=false){
	APP.konsole = {
		nbrLine : 0,
		init : function(){
			npk('KONSOLE : INIT');
			APP.konsole.create();

			//CLICK ENGINE BUTTON
			$("div#ctrlEngine button").click(function(){
				
				if( APP.engine.on==true ){
					$(this).css("background-color", '#4BAC3F');
					$(this).find('span').html('START');
					$("#konsole th").css('opacity',0.5);
					APP.filter.removeListener();
					APP.engine.on = false;
					
				} else {
					$(this).css("background-color", '#d23838');
					$(this).find('span').html('STOP');
					$("#konsole th").css('opacity',1);
					APP.engine.on = true;
					APP.update();
				}
			});

			//CLICK ON NO REPEAT
			$("input#chkfilter").click(function(){
				APP.filter.norepeat=$(this).prop('checked');
			});

			//CLICK ON ERASE
			$("button#erase_a").click(function(){
				APP.animIt( $(this) );
				$("table#konsole tr[data-key]").remove();
				APP.konsole.nbrLine=0;
			});
			
		},
		create : function(){
			npk('KONSOLE : CREATE');
			var t = "<h2>Console</h2>";
			t += "<div id='ctrlEngine'>";
				t += "<button class='oneShot' type='button' data-val='true'><span>START</span> ENGINE</button>";
			t += "</div>";
			t += "<div id='norep'>";
				t += "<input id='chkfilter' checked='checked' type='checkbox'> <label for='chkfilter'> No repeat entries</label>";
			t += "</div>";
			t += "<div id='eraa'>";
				t += "<button class='oneShot' id='erase_a' title='Erase all'>Erase all entries</button>";
			t += "</div>";

			$("#konsole th").css('opacity',0.5);	
			$("#p_konsole").html(t);


			var t = "<table id='konsole'>";
				t += "<tr>";
					t += "<th class='nbr'>#</th>";
					t += "<th class='cpt'>R</th>";
					t += "<th class='dev'>Device</th>";
					t += "<th class='cha'>Channel</th>";
					t += "<th class='tip'>Type</th>";
					t += "<th>Data</th>";
				t += "</tr>";
			t += "</table>";
			$("#esp_konsole").html(t);	
		}
	}
	APP.konsole.init();
}		