function init_device(){
	APP.device = {
		init : function(){
			npk('DEVICE : INIT');
			APP.device.create();

			APP.device.refresh();
			APP.device.update();
			

			APP.d.devSelect.change(function(){
				APP.update();
			});
			WM.addListener( 'connected', APP.device.konect );
			WM.addListener( 'disconnected', APP.device.dekonect );

			APP.d.devRefresh.click(function(){
				APP.animIt( $(this) );
				APP.device.refresh();
			});

		},
		create : function(){
			npk('DEVICE : CREATE');
			var t = "<h2>Device midi</h2>";
			t += "<div class='espConfig'>";
				t += "<div class='w3-row'>";
					t += "<div class='w3-col s9 m9 l9'><select id='mididevice'></select></div>";
					t += "<div id='espDevRefresh' class='w3-col s3 m3 l3'><button id='devRefresh' type='button' class='oneShot' title='Refresh' >Refresh</button></div>";
				t += "</div>";
			t += "</div>";
			
			$("#p_device").html(t);

			APP.d.devRefresh = $("button#devRefresh");
			APP.d.devSelect = $("select#mididevice");
			APP.d.devState = $("div#dispState span");
		},
		refresh : function(){
			npk('DEVICE : REFRESH');
			var opt='';
			var xputs;
			switch(APP.dir){
				case 'in' : xputs = WM.inputs; break;
				case 'out' : xputs = WM.outputs; break;
			}
			xputs.forEach(function(obj) { 
				opt+="<option value='"+obj.id+"' name='"+obj.name+"' data-manu='"+obj.manufacturer+"'>"+obj.name+" / "+obj.manufacturer+"</option>";
			});
			APP.d.devSelect.html(opt);
			update_inOut();
		},
		update : function(){
			npk('DEVICE : UPDATE');
			this.id = APP.d.devSelect.val();
			this.name = APP.d.devSelect.find("option:selected").attr('name');
			this.manu = APP.d.devSelect.find("option:selected").attr('data-manu');
			var error=false;
			var ghost;
			switch(APP.dir){
				case 'in' : ghost = APP.MidiInput = WM.getInputById( this.id ); break;
				case 'out' : ghost = APP.MidiOutput = WM.getOutputById( this.id ); break;
			}
			if(ghost===false){
				APP.dispWarning("Error ! Please click 'Refresh' !");
			}
		},
		panic : function(){
			npk('DEVICE : PANIC');
			APP.MidiOutput.sendChannelMode('allnotesoff');
			APP.MidiOutput.sendChannelMode('allsoundoff');
		},
		konect : function(e){
			npk('DEVICE : KONECT');
			npk('New device connected.');
			APP.device.refresh();
		},
		dekonect : function(e){
			npk('DEVICE : DEKONECT');
			if( e.port.id == APP.device.id ){
				APP.dispWarning("Your device is disconnected !");
			} else {
				APP.device.refresh();
			}
		}
	}
	APP.device.init();
}