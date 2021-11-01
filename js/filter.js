function init_filter(){
	APP.filter = {
		norepeat:true,
		type : {
			channelaftertouch : {				
				activ : true,
				name : 'Channel after touch'
			},
			channelmode : {
				activ : true,
				name : 'Channel mode'
			},
			controlchange : {				
				activ : true,
				name : 'Control change'
			},
			keyaftertouch : {
				activ : true,
				name : 'Key after touch'
			},
			noteoff : {				
				activ : false,
				name : 'Note off'
			},
			noteon : { 					
				activ : true,
				name : 'Note on'
			},
			pitchbend : {				
				activ : true,
				name : 'Pitch bend'
			},
			programchange : {				
				activ : true,
				name : 'Program change'
			},

			activesensing : {
				activ : true,
				name : 'Active sensing'
			},
			clock : {
				activ : false,
				name : 'Clock'
			},
			continue : {			
				activ : true,
				name : 'Continue'
			},
			reset : {
				activ : true,
				name : 'Reset'
			},
			songposition : {
				activ : true,
				name : 'Song position'
			},
			songselect : {
				activ : true,
				name : 'Song select'
			},
			start : {					
				activ : true,
				name : 'Start'
			},
			stop : {					
				activ : true,
				name : 'Stop'
			},
			sysex : {				
				activ : true,
				name : 'Sysex'
			},
			timecode : {					
				activ : true,
				name : 'Timecode'
			},
			tuningrequest : {
				activ : true,
				name : 'Tuning request'
			},
			unknownsystemmessage : {
				activ : false,
				name : 'Unknown msg'
			}
		},
		init : function(){
			npk('FILTER : INIT');
			APP.filter.create();

			//CLICK ON TYPE
			$("div.esptip input[type='checkbox']").change(function(){
				var t = $(this).attr('data-type');
				if( $(this).prop('checked')==true ){
					APP.filter.type[t].activ = true;
				} else {
					APP.filter.type[t].activ = false;
				}
				APP.update();
			});	

		},
		create : function(){
			npk('FILTER : CREATE');
			var t = "<h2>Device message filter</h2>";
			t += "<div class='esptip' id='espType'></div>";
			$("#p_filter_dev").html(t);	

			var t = "<h2>Channel message filter</h2>";
			t += "<div class='esptip' id='espType2'></div>";
			$("#p_filter_chan").html(t);

			//CREATE CHECKBOX TYPE
			var cpt=0;
			var c='';
			var espType=espType2=espType3=espType4='';
			$.each(APP.filter.type, function(i,o) {
				if( APP.filter.type[i].activ==true ){ c="checked='checked'"; } else { c=''; }
				var div = "<div>";
				div += "<input id='chkfil"+i+"' data-type='"+i+"' class='w3-check' type='checkbox' "+c+" > ";
				div += "<label for='chkfil"+i+"'> "+APP.filter.type[i].name+"</label>";
				div += "</div>";
	  			if(APP.filter.type[i].activ!='x'){
	  				if(cpt<8){
		  				espType2 += div;
		  			} else {
		  				espType += div;
		  			}
		  			cpt++;
	  			}
			});
			$("div#espType").html(espType+"<p class='clear'></p>");
			$("div#espType2").html(espType2+"<p class='clear'></p>");
		},

		removeListener : function(){
			npk('FILTER : REMOVE LISTENER');
			if (typeof APP.MidiInput.removeListener === "function") { APP.MidiInput.removeListener(); }
		},

		addListener : function(){
			npk('FILTER : ADD LISTENER');
			$.each(APP.filter.type, function(i,o) {
	  			if( APP.filter.type[i].activ===true ){ APP.MidiInput.addListener( i, APP.channel.a, APP.filter.cbListen ); }
			});
		},

		cbListen : function(e){
			npk('FILTER : CALLBACK');
			var d = e.target._midiInput.name;
			if(typeof e.channel === 'undefined'){
				var c = "";
			} else {
				var c = e.channel;
			}
			var t = e.type;
			var key = e.target._midiInput.id+c+t;
			var addTd='';
			switch(t){
				case 'noteoff':
					var note = e.note.name+e.note.octave;
					addTd+= "<div class='note'>Note : "+note+"</div>";
					key += note;
				break;
				case 'noteon' :
					var note = e.note.name+e.note.octave;
					var vel = e.rawVelocity;
					addTd+= "<div class='note'>Note : "+note+"</div><div class='vel'>Velocity : "+vel+"</div>";
					key += note;
				break;
				case 'controlchange' :
				case 'channelmode':
					var name = e.controller.name;
					var num = e.controller.number;
					var val = Math.round( (e.value*100) ) / 100;
					if(t=='controlchange'){ name = tabCC[num]; }
					addTd+= "<div>Num : "+num+"</div><div class='val'>Value : "+val+"</div><div>Name : "+name+"</div>";
					key += num;
				break;
				case 'programchange' :
				case 'pitchbend' :
				case 'channelaftertouch' :
					var val = Math.round( (e.value*100) ) / 100;
					addTd+= "<div class='val'>Value : "+val+"</div>";
				break;
				case 'keyaftertouch' :
					var note = e.note.name+e.note.octave;
					var val = Math.round( (e.value*100) ) / 100;
					addTd+= "<div class='note'>Note : "+note+"</div><div class='val'>Value : "+val+"</div>";
					key += note;
				break;
				case 'songselect' : 
					var s = e.song;
					addTd+= "<div class='song'>Song : "+s+"</div>";
				break;
				case 'sysex' :
				case 'timecode' :
				case 'songposition' : 
				case 'tuningrequest' :
				case 'clock' :
				case 'start' :
				case 'continue' :
				case 'stop' :
				case 'activesensing' :
				case 'reset' :
				case 'unknownsystemmessage' :
					var da = e.data;
					addTd+= "<div>Data : "+da+"</div>";
				break;
			}
			var trFirst = $("table#konsole tr").first();
			var firstKey = trFirst.next().attr('data-key');

			if( APP.filter.norepeat && firstKey==key  ){
				var c = trFirst.next();

				//maj R
				var cpt = Number(c.find("td[class='cpt']").html());
				if( !Number.isInteger(cpt) ){ cpt=1; }
				cpt++;
				c.find("td[class='cpt']").html(cpt);

				switch(t){
					case 'controlchange' :
					case 'channelmode' :
					case 'programchange' :
					case 'pitchbend' :
					case 'channelaftertouch' :
					case 'keyaftertouch' :
						c.find("div[class='val']").html("Value : "+val);
					break;

					//case 'noteoff' :
					case 'noteon' :
						c.find("div[class='vel']").html("Velocity : "+vel);
					break;
					
					case 'songselect' :
						c.find("div[class='song']").html("Song : "+s);
					break;

					case 'sysex' :
					case 'timecode' :
					case 'songposition' : 
					case 'tuningrequest' :
					case 'clock' :
					case 'start' :
					case 'continue' :
					case 'stop' :
					case 'activesensing' :
					case 'reset' :
					case 'unknownsystemmessage' :
						c.find("div[class='data']").html("Data : "+da);
					break;
				}
			} else {
				APP.konsole.nbrLine++;
				var tr='';
				tr+= "<tr data-key='"+key+"'>";
					tr+= "<td class='nbr'>"+APP.konsole.nbrLine+"</td>";
					tr+= "<td class='cpt'>&nbsp;</td>";
					tr+= "<td class='dev'>"+d+"</td>";
					tr+= "<td class='cha'>"+c+"</td>";
					tr+= "<td class='tip'>"+APP.filter.type[t].name+"</td>";
					tr+= "<td>"+addTd+"</td>";
				tr+= "</tr>";
				trFirst.after(tr);

				if( $("table#konsole tr").length>1000 ){
					$("table#konsole tr:last-child").remove();
				}
			}
		}
	}

	APP.filter.init();
}