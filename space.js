//
//	Uses Douglas Crockfords Object creation style
//	In preparation for ES6.
//

(function () {

	// Handles scroll events and attaches them to methods.
	var ScrollController = function () {
		var method;
		var interval;
		var repeatIntervalId;
		var $window = $(window);
		var lastScrollTop = 0;
		var lastScrollTime;
		var delayCount = 0;

		// ----- public methods ------
		// repeat function *func* every *interv*:nth millisecond
		var repeatOnScroll = function (func, interv) {
			method = func;
			interval = interv;

			window.onscroll = function () {
				if(!repeatIntervalId){
					startRepeat();
				};
			};
		};

		// ----- private methods ------
		
		// Tick forwards, check for scroll stop and run *method*.
		var update = function(){
			if(repeatIntervalId){
				// detect when to stop repeating
				var tmpScrollTop = $window.scrollTop();
				

				// delta stopped
				if(tmpScrollTop == lastScrollTop){
					// wait half a second extra to account for scroll easing
					if(++delayCount >= 30){
						delayCount = 0;
						stopRepeat();
					}
				};

				lastScrollTop = tmpScrollTop;

				// run the method
				method();
			};
		};

		var startRepeat = function(){
			repeatIntervalId = window.setInterval(update, interval);
		};

		var stopRepeat = function(){
			window.clearInterval(repeatIntervalId);
			repeatIntervalId = undefined;
		};


		return Object.freeze({
			repeatOnScroll:repeatOnScroll,
			getScrollTop: function () {
				return lastScrollTop;
			}
		});
	};

	// animation controller
	var SpaceController = function () {
		var $window = $(window);
		var windowHeight = $window.height();
		var scrollControl = ScrollController();
		var frames;
		var currentFrame = 0;
		var frameSelector = ".space-frame";

		// Todo: make these modular from the <element>, e.g:
		// e.g. <section class="frame depth-scale depth-opacity"></section>

		var transitions = {
			scaleIn: {'scale':{from:0, to:1}},
			fadeIn: {'opacity':{from:0, to:1}},
			scaleOut: {'scale':{from:1, to:1.5}},
			fadeOut: {'opacity':{from:1, to:0}},
			rotateQuarterRight: {'rotate':{from:0, to:90}},
			rotateInQuarterClockwise: {'rotate':{from:-90, to:0}},
			zoomOut:{
				'scale': {from: 1, to: 0}
			},
			slideInBottom: {
				'translate3d':{
					from:{y:700},
					to: {y:0}
				}
			},
			slideOutDown: {
				'translate3d':{
					from:{y:0},
					to: {y:700}
				}
			},
			slideOutLeft: {
				'translate3d':{
					from:{x:0},
					to: {x:-700}
				}
			},
			slideOutRight: {
				'translate3d':{
					from:{x:0},
					to: {x:700}
				}
			},
			slideInRight: {
				'translate3d':{
					from:{x:700},
					to: {x:0}
				}
			},
			slideOutUp: {
				'translate3d':{
					from:{y:0},
					to: {y:-700}
				}
			},
			slideInTop: {
				'translate3d':{
					from:{y:-700},
					to: {y:0}
				}
			},
			slideInLeft: {
				'translate3d':{
					from:{x:-700},
					to: {x:0}
				}
			},
			slideBottomRight: {
				'translate3d':{
					from:{x:0, y:0},
					to: {x:500, y:500}
				}
			},
			rotate360: {
				'rotate':{from:0, to:360}
			},
			rotate3dOut: {
				'rotate3d':{
					from:{x:0, y:0, z:0, angle:0},
					to: {x:1, y:-1,z:0, angle:90}
				}
			}
		};

		var defaultTransition = {
			all: [transitions.scaleOut, transitions.fadeOut],
			enter: [],
			exit:[]
		};

		// ----- public methods ------
		var init = function () {
			// compensate speed scrolling on touch screens
			var touchScreenCompensation = (isMobile() ? 0.3 : 1);

			var simulatedBodyHeight = 0;

			// Set up frames
			frames = $('.space-frame').map(function(index, frame){

				// Duration for current frame, default is one.
				// Other is read from html-element attribute data-duration
				var duration = (frame.dataset.duration || 1) * touchScreenCompensation;

				// simulated document height, to get a scrollbar and height
				var simulatedHeight = duration * windowHeight;
				var distanceTo = simulatedBodyHeight;
				simulatedBodyHeight+= simulatedHeight;


				// give each frame an id
				var frameId = "frame-"+index;
				frame.id = frameId;

				// look for a custom transition to override the default one
				var customTransition = frame.dataset.transition;
				var customEnter = frame.dataset.enter;
				var customExit = frame.dataset.exit;

				if(customTransition || customEnter || customExit){
					var newTransition = {all:[],enter:[],exit:[]};

					var toTransition = function(arr){return arr.split(/\s+/).map(function(t){return transitions[t];})};

					newTransition.all = customTransition ? toTransition(customTransition) : [];
					newTransition.enter = customEnter ? toTransition(customEnter) : [];
					newTransition.exit = customExit ? toTransition(customExit) : [];

					return {selector:"#"+frameId, duration:simulatedHeight, distanceTo:distanceTo, transition:newTransition};
				};

				return {selector:"#"+frameId, duration:simulatedHeight, distanceTo:distanceTo};
			});

			// set fake body height
			$('body').height(simulatedBodyHeight);


			// show the first frame
			$(frames[currentFrame].selector).show();

			// initiate scroll controller with animate method
			scrollControl.repeatOnScroll(animate, 1000/60);
		};

		// ----- private methods ------

		var animate = function () {
			window.requestAnimationFrame(function(){
				setCurrentFrame();
				animateFrame();
			});
		};

		// compare scrolled distance with frames and select the correct one
		var setCurrentFrame = function(){
			var top = scrollControl.getScrollTop();
			var trigger = frames[currentFrame].distanceTo;

			// check if we are not in the interval of the current frame
			if(top < trigger){ // prev frame
				$('.space-frame').hide();
				currentFrame--;
				if (currentFrame < 0){currentFrame = 0};
				$(frames[currentFrame].selector).show();
			}else if(top > (trigger + frames[currentFrame].duration)){ // next frame
				$('.space-frame').hide();
				currentFrame++;
				$(frames[currentFrame].selector).show();
			};
		};

		function propValueToCssFormat (prop, val) {
			switch (prop){
				case "scale":
					return 'scale('+val+')';
				case "rotate":
					return 'rotate('+val+'deg)';
				case "translate3d":
					return 'translate3d(' + 
						(val.x ? val.x+'px' : 0)+','+
						(val.y ? val.y+'px' : 0)+','+
						(val.z ? val.z+'px' : 0)+')';
				case "rotate3d":
					return 'rotate3d(' + 
						(val.x ? val.x : 0)+','+
						(val.y ? val.y : 0)+','+
						(val.z ? val.z : 0)+','+
						(val.angle ? val.angle+'deg' : 0)+')';
				default:
					return val;
			};
		}

		// Update css values of the current frame to their delta-value in the scroll progress
		var animateFrame = function () {
			var scrollInElement = (scrollControl.getScrollTop() - frames[currentFrame].distanceTo);

			var props = {'transform':''};

			// custom or default transition
			var frameTransition = frames[currentFrame].transition || defaultTransition;

			frameTransition.all.forEach(function (trans) {
				for(var property in trans){
					if (property == 'scale' || property == 'translate3d' || property == 'rotate' || property == 'rotate3d'){
						props['transform'] += propValueToCssFormat(property, deltaValue(trans, scrollInElement, property));
					}else{
						props[property] = propValueToCssFormat(property, deltaValue(trans, scrollInElement, property));
					};
				};
			});

			if(scrollInElement <= (frames[currentFrame].duration / 2)){
				frameTransition.enter.forEach(function (trans) {
					for(var property in trans){
						if (property == 'scale' || property == 'translate3d' || property == 'rotate' || property == 'rotate3d'){
							props['transform'] += propValueToCssFormat(property, deltaValue(trans, scrollInElement*2, property));
						}else{
							props[property] = propValueToCssFormat(property, deltaValue(trans, scrollInElement*2, property));
						};
					};
				});
			}else{
				frameTransition.exit.forEach(function (trans) {
					for(var property in trans){
						if (property == 'scale' || property == 'translate3d' || property == 'rotate' || property == 'rotate3d'){
							props['transform'] += propValueToCssFormat(property, deltaValue(trans, (scrollInElement - (frames[currentFrame].duration / 2))*2, property));
						}else{
							props[property] = propValueToCssFormat(property, deltaValue(trans, (scrollInElement - (frames[currentFrame].duration / 2))*2, property));
						};
					};
				});
			}
			props['-webkit-transform'] = props['transform'];
			props['-moz-transform'] = props['transform'];
			$(frames[currentFrame].selector).css(props);
		};

		var deltaValue = function(animation, delta, property) {
		  var value = animation[property];

		  var frameDuration = frames[currentFrame].duration;

		  var frameProgress = delta/frameDuration; // decimal percent

		  if(property == 'translate3d' || property == 'rotate3d'){
		  		var trans = {};
		  		for(axis in value.from){
		  			trans[axis] = +linearEase(delta, value.from[axis], (value.to[axis]-value.from[axis]), frameDuration).toFixed(4);
		  		};
		  		return trans;
		  }else{
			  // compute delta value and round it to four digits to save performance.
			  return +linearEase(delta, value.from, (value.to-value.from), frameDuration).toFixed(4);
		  }
		};

		var linearEase = function(t, b, c, d) {
		  return b+c*(t/d);
		};

		var isMobile = function () {
			return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		};


		// format
		// {{key:{///transition///}}, key:{///transition///}}}
		var addTransitions = function (customTrans) {
			// transitions[]
			for(var name in customTrans){
				if(transitions[name]){
					console.log("Transition name already exists!!!");
					return
				};

				transitions[name] = customTrans[name];

			};

			// reinit with new transitons.. todo: fix so that we do not have to.
			init();
		}

		// export immutable public properties
		return Object.freeze({
			init:init,
			addTransitions: addTransitions
		});
	};

	var initFrameCSS = function () {
		var frameStyle = ".space-frame {display: none;position: fixed;width: 100vw;height: 100vh;} ";
		var innerFrameStyle = ".space-frame .space-inner-frame {position: absolute;transform-style: preserve-3d;top: 50%;left: 50%;-webkit-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-o-transform: translate(-50%, -50%);transform: translate(-50%, -50%);}"

		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = frameStyle + innerFrameStyle;
		document.getElementsByTagName('head')[0].appendChild(style);
	}

	initFrameCSS();

	Space = SpaceController()
	Space.init();

}).call(this);


