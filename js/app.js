var WM;
var APP;
var displayNpk=true;

/******* ONLOAD *******/
$(function() {
	WM = WebMidi;
	var prom = checkMidi();
	prom.then(initApp, errorMidi);
});

/*
/** CHECK MIDI 
/***/
function checkMidi() {
    return new Promise((resolve, reject) => {
    	WM.enable(function (err) {
    		var sup = '<span class="warn">No</span>';
    		if(WM.supported){ sup = '<span class="good">Yes</span>'; }
    		var sys = '<span class="warn">No</span>';
    		if(WM.sysexEnabled){ sys = '<span class="good">Yes</span>'; }

			if (err) {
				var t = '';
				t+= "<p>WebMidi could not be enabled !</p>";
				t+= "<p class='wmapi'>Web MIDI API : "+sup+"</p>";
				t+= "<p>"+err+"</p>";
				t+= "<p>To use WebMidi.js on Safari, Firefox and Internet Explorer, you will first need to install Jazz-Plugin. Simply <a href='http://jazz-soft.net/download/Jazz-Plugin/' target='_blank'>download the plugin</a> and run the installer.</p>";
				t+= "<p><br /><a href='https://github.com/djipco/webmidi#using-webmidijs-with-the-jazz-plugin' target='_blank'>More information about this problem...</a></p>";
				t+= "<p><br /></p>";
				$("div#infoConek").html(t);
				reject();
			} else {
				var t = '';
				t+= "<p>WebMidi enabled !</p>";
				t+= "<p class='wmapi'>Web MIDI API : "+sup+"</p>";
				t+= "<p class='wmapi'>Sysex enabled : "+sys+"</p>";
				$("div#infoConek").html(t);
				update_inOut();
				resolve();
			}
		}, true);
	})	
}

/*
/** ERROR MIDI 
/***/
function errorMidi(){
	npk('Error midi');
}

/*
/** INIT APP
/***/
function initApp(){
	APP = new app();
	
	//INIT CLOSE MODAL
	$(".modal").click(function(e){
		if( e.target.className=='modal'){
			$(".modal").hide();
			$("main").show();
		}
	});


	//INIT WARNING
	APP.dispWarning = function(t, timelect=1234){
		var c=$("header");
		c.find('#msg').html(t);
		c.css('opacity', 1).show();
		setTimeout(function(){
			APP.device.update();
			c.animate({
				opacity: 0,
			}, 500, function(){ c.hide(); c.find('#msg').html("&nbsp;");  });
		}, timelect);
	}

	APP.init();
	npk(APP);

	setTimeout(function(){
		$("#midiCheckerModal").hide();
		$("main").show();
	}, 10);



	$.ajax({
		method: "POST",
		url: "js/some.php",
		data: { name: "John", location: "Boston" }
	})
	.done(function( msg ) {
		alert( "Data Saved: " + msg );
	});


}

function npk(x){
	if(displayNpk){
		console.log(x);
	}
}

function update_inOut(){
	npk('f : update_inOut');
	var liIn=liOut='';

	$.each(WM.inputs, function( index, value ) {
		liIn+= "<li>";
			liIn+= "<div class='key'>N°"+index+"</div>";
			liIn+= "<div class='n'>"+value['name']+"</div>";
			liIn+= "<div class='m'>"+value['manufacturer']+"</div>";

			var c= "warn";
			if(value['state']=='connected'){ c= "good"; }
			liIn+= "<div class='s'>State : <span class='"+c+"'>"+value['state']+"</span></div>";

			var c= "warn";
			if(value['connection']=='open'){ c= "good"; }
			liIn+= "<div class='c'>Connection : <span class='"+c+"'>"+value['connection']+"</span></div>";

			liIn+= "<div class='v'>Version : "+value['_midiInput']['version']+"</div>";
			liIn+= "<div class='i'>ID : "+value['id']+"</div>";
		liIn+= "</li>";
	});

	$.each(WM.outputs, function( index, value ) {
		liOut+= "<li>";
			liOut+= "<div class='key'>N°"+index+"</div>";
			liOut+= "<div class='n'>"+value['name']+"</div>";
			liOut+= "<div class='m'>"+value['manufacturer']+"</div>";

			var c= "warn";
			if(value['state']=='connected'){ c= "good"; }
			liOut+= "<div class='s'>State : <span class='"+c+"'>"+value['state']+"</span></div>";

			var c= "warn";
			if(value['connection']=='open'){ c= "good"; }
			liOut+= "<div class='c'>Connection : <span class='"+c+"'>"+value['connection']+"</span></div>";

			liOut+= "<div class='v'>Version : "+value['_midiOutput']['version']+"</div>";
			liOut+= "<div class='i'>ID : "+value['id']+"</div>";

		liOut+= "</li>";
	});

	$titIn = 'Inputs';
	if( WM.inputs.length<2 ){ $titIn = 'Input'; }
	$titOut = 'Outputs';
	if( WM.outputs.length<2 ){ $titOut = 'Output'; }

	var t='';

	t+= "<h2>"+$titIn+"</h2>";
	t+= "<ul class='in'>"+liIn+"</ul>";
	t+= "<h2>"+$titOut+"</h2>";
	t+= "<ul class='out'>"+liOut+"</ul>";

	$("div#inout").html(t);
}

/*************************************************/

function app(){
	this.dir = 'in',
	this.MidiInput = '',  
	this.d = {},

	this.init = function(){
		init_device();
		init_channel();
		init_filter();
		init_konsole();
		init_engine();
		init_menu();
	},

	this.update = function(){
		APP.filter.removeListener();
		APP.device.update();
		APP.channel.update();
		if(APP.engine.on){
			APP.filter.addListener();
		}
	},

	this.animIt = function(that){
		$( that ).css("background-color", "#4BAC3F44");
		setTimeout(function(){
			$( that ).css("background-color", "#4BAC3F");
		}, 400);
	}
}

function init_engine(){
	APP.engine = {
		on : false
	}
}

function init_menu(){
	APP.menu = {
		init : function(){
			$("button#btMenu").click(function(){
				$("#midiCheckerModal").show();
			});
		}
	}
	APP.menu.init();
}