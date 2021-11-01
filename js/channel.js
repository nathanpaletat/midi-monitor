function init_channel(){
	APP.channel = {
		a : [1],
		mod : 'solo',
		last : 1,
		
		init : function(){
			npk('CHANNEL : INIT');
			APP.channel.create();
			APP.d.chanBut = $("div#espChan button[data-chan]");

			//CLICK ON MODE
			$("div#p_channel div#devMode button").click(function(){
				APP.channel.select_mod(this);
			});

			//CLICK ON CHANNEL
			APP.d.chanBut.click(function(){
				APP.channel.last=$(this).attr('data-chan');
				switch(APP.channel.mod){
					case 'solo':
						APP.d.chanBut.attr('data-activ', 'off');
					case 'multi':
						if($(this).attr('data-activ')=='on'){
							if($("div#espChan button[data-activ='on']").length>1){
								$(this).attr('data-activ', 'off');
							}
						} else {
							$(this).attr('data-activ', 'on');
						}
					break;
					case 'all':
						APP.d.chanBut.attr('data-activ', 'on');
					break;
				}
				APP.update();
			});

		},
		create : function(){
			npk('CHANNEL : CREATE');
			var t = "<h2>Channels "+APP.dir+"</h2>";
			t += "<div id='devMode'>Mode <button class='onOff' data-activ='on' id='solo'>Solo</button><button class='onOff' id='multi' data-activ='off'>Multi</button><button class='onOff' id='all' data-activ='off'>All</button></div>";
			t += "<div id='espChan'><div>";
			var datactiv='on';
			for(var i=1; i<17; i++){
				t += "<div class='btChan'><button class='onOff w3-button w3-ripple' type='button' data-activ='"+datactiv+"' data-chan='"+i+"'>"+i+"</button></div>";
				if(i==8){
					t += "</div><div>";
				}
				datactiv='off';
			}			
			t += "</div></div>";
			$("#p_channel").html(t);	
		},

		update : function(){
			npk('CHANNEL : UPDATE');
			if(APP.channel.mod=='all'){
				APP.channel.a = 'all';
			} else {
				APP.channel.a = [];
				$("div#espChan button[data-activ='on']").each(function(){
					APP.channel.a[APP.channel.a.length] = $(this).attr('data-chan');
				});
			}
		},

		select_mod : function(that){
			npk('CHANNEL : SELECT MOD');
			$(that).parent().find('button').attr('data-activ', 'off');
			$(that).attr('data-activ', 'on');
			APP.channel.mod = $(that).attr('id');
			switch(APP.channel.mod){
				case 'solo':
					APP.d.chanBut.attr('data-activ', 'off');
					$("div#espChan button[data-chan='"+APP.channel.last+"']").attr('data-activ', 'on');
				break;
				case 'all':
					APP.d.chanBut.attr('data-activ', 'on');
				break;
			}
			APP.update();
		}
	}
	APP.channel.init();
}