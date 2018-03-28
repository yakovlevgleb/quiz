/*
== malihu jquery custom scrollbar plugin == 
Version: 3.1.5 
Plugin URI: http://manos.malihu.gr/jquery-custom-content-scroller 
Author: malihu
Author URI: http://manos.malihu.gr
License: MIT License (MIT)
*/

/*
Copyright Manos Malihutsakis (email: manos@malihu.gr)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
The code below is fairly long, fully commented and should be normally used in development. 
For production, use either the minified jquery.mCustomScrollbar.min.js script or 
the production-ready jquery.mCustomScrollbar.concat.min.js which contains the plugin 
and dependencies (minified). 
*/

(function(factory){
	if(typeof define==="function" && define.amd){
		define(["jquery"],factory);
	}else if(typeof module!=="undefined" && module.exports){
		module.exports=factory;
	}else{
		factory(jQuery,window,document);
	}
}(function($){
(function(init){
	var _rjs=typeof define==="function" && define.amd, /* RequireJS */
		_njs=typeof module !== "undefined" && module.exports, /* NodeJS */
		_dlp=("https:"==document.location.protocol) ? "https:" : "http:", /* location protocol */
		_url="cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js";
	if(!_rjs){
		if(_njs){
			require("jquery-mousewheel")($);
		}else{
			/* load jquery-mousewheel plugin (via CDN) if it's not present or not loaded via RequireJS 
			(works when mCustomScrollbar fn is called on window load) */
			$.event.special.mousewheel || $("head").append(decodeURI("%3Cscript src="+_dlp+"//"+_url+"%3E%3C/script%3E"));
		}
	}
	init();
}(function(){
	
	/* 
	----------------------------------------
	PLUGIN NAMESPACE, PREFIX, DEFAULT SELECTOR(S) 
	----------------------------------------
	*/
	
	var pluginNS="mCustomScrollbar",
		pluginPfx="mCS",
		defaultSelector=".mCustomScrollbar",
	
	
		
	
	
	/* 
	----------------------------------------
	DEFAULT OPTIONS 
	----------------------------------------
	*/
	
		defaults={
			/*
			set element/content width/height programmatically 
			values: boolean, pixels, percentage 
				option						default
				-------------------------------------
				setWidth					false
				setHeight					false
			*/
			/*
			set the initial css top property of content  
			values: string (e.g. "-100px", "10%" etc.)
			*/
			setTop:0,
			/*
			set the initial css left property of content  
			values: string (e.g. "-100px", "10%" etc.)
			*/
			setLeft:0,
			/* 
			scrollbar axis (vertical and/or horizontal scrollbars) 
			values (string): "y", "x", "yx"
			*/
			axis:"y",
			/*
			position of scrollbar relative to content  
			values (string): "inside", "outside" ("outside" requires elements with position:relative)
			*/
			scrollbarPosition:"inside",
			/*
			scrolling inertia
			values: integer (milliseconds)
			*/
			scrollInertia:950,
			/* 
			auto-adjust scrollbar dragger length
			values: boolean
			*/
			autoDraggerLength:true,
			/*
			auto-hide scrollbar when idle 
			values: boolean
				option						default
				-------------------------------------
				autoHideScrollbar			false
			*/
			/*
			auto-expands scrollbar on mouse-over and dragging
			values: boolean
				option						default
				-------------------------------------
				autoExpandScrollbar			false
			*/
			/*
			always show scrollbar, even when there's nothing to scroll 
			values: integer (0=disable, 1=always show dragger rail and buttons, 2=always show dragger rail, dragger and buttons), boolean
			*/
			alwaysShowScrollbar:0,
			/*
			scrolling always snaps to a multiple of this number in pixels
			values: integer, array ([y,x])
				option						default
				-------------------------------------
				snapAmount					null
			*/
			/*
			when snapping, snap with this number in pixels as an offset 
			values: integer
			*/
			snapOffset:0,
			/* 
			mouse-wheel scrolling
			*/
			mouseWheel:{
				/* 
				enable mouse-wheel scrolling
				values: boolean
				*/
				enable:true,
				/* 
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto",
				/* 
				mouse-wheel scrolling axis 
				the default scrolling direction when both vertical and horizontal scrollbars are present 
				values (string): "y", "x" 
				*/
				axis:"y",
				/* 
				prevent the default behaviour which automatically scrolls the parent element(s) when end of scrolling is reached 
				values: boolean
					option						default
					-------------------------------------
					preventDefault				null
				*/
				/*
				the reported mouse-wheel delta value. The number of lines (translated to pixels) one wheel notch scrolls.  
				values: "auto", integer 
				"auto" uses the default OS/browser value 
				*/
				deltaFactor:"auto",
				/*
				normalize mouse-wheel delta to -1 or 1 (disables mouse-wheel acceleration) 
				values: boolean
					option						default
					-------------------------------------
					normalizeDelta				null
				*/
				/*
				invert mouse-wheel scrolling direction 
				values: boolean
					option						default
					-------------------------------------
					invert						null
				*/
				/*
				the tags that disable mouse-wheel when cursor is over them
				*/
				disableOver:["select","option","keygen","datalist","textarea"]
			},
			/* 
			scrollbar buttons
			*/
			scrollButtons:{ 
				/*
				enable scrollbar buttons
				values: boolean
					option						default
					-------------------------------------
					enable						null
				*/
				/*
				scrollbar buttons scrolling type 
				values (string): "stepless", "stepped"
				*/
				scrollType:"stepless",
				/*
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto"
				/*
				tabindex of the scrollbar buttons
				values: false, integer
					option						default
					-------------------------------------
					tabindex					null
				*/
			},
			/* 
			keyboard scrolling
			*/
			keyboard:{ 
				/*
				enable scrolling via keyboard
				values: boolean
				*/
				enable:true,
				/*
				keyboard scrolling type 
				values (string): "stepless", "stepped"
				*/
				scrollType:"stepless",
				/*
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto"
			},
			/*
			enable content touch-swipe scrolling 
			values: boolean, integer, string (number)
			integer values define the axis-specific minimum amount required for scrolling momentum
			*/
			contentTouchScroll:25,
			/*
			enable/disable document (default) touch-swipe scrolling 
			*/
			documentTouchScroll:true,
			/*
			advanced option parameters
			*/
			advanced:{
				/*
				auto-expand content horizontally (for "x" or "yx" axis) 
				values: boolean, integer (the value 2 forces the non scrollHeight/scrollWidth method, the value 3 forces the scrollHeight/scrollWidth method)
					option						default
					-------------------------------------
					autoExpandHorizontalScroll	null
				*/
				/*
				auto-scroll to elements with focus
				*/
				autoScrollOnFocus:"input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
				/*
				auto-update scrollbars on content, element or viewport resize 
				should be true for fluid layouts/elements, adding/removing content dynamically, hiding/showing elements, content with images etc. 
				values: boolean
				*/
				updateOnContentResize:true,
				/*
				auto-update scrollbars each time each image inside the element is fully loaded 
				values: "auto", boolean
				*/
				updateOnImageLoad:"auto",
				/*
				auto-update scrollbars based on the amount and size changes of specific selectors 
				useful when you need to update the scrollbar(s) automatically, each time a type of element is added, removed or changes its size 
				values: boolean, string (e.g. "ul li" will auto-update scrollbars each time list-items inside the element are changed) 
				a value of true (boolean) will auto-update scrollbars each time any element is changed
					option						default
					-------------------------------------
					updateOnSelectorChange		null
				*/
				/*
				extra selectors that'll allow scrollbar dragging upon mousemove/up, pointermove/up, touchend etc. (e.g. "selector-1, selector-2")
					option						default
					-------------------------------------
					extraDraggableSelectors		null
				*/
				/*
				extra selectors that'll release scrollbar dragging upon mouseup, pointerup, touchend etc. (e.g. "selector-1, selector-2")
					option						default
					-------------------------------------
					releaseDraggableSelectors	null
				*/
				/*
				auto-update timeout 
				values: integer (milliseconds)
				*/
				autoUpdateTimeout:60
			},
			/* 
			scrollbar theme 
			values: string (see CSS/plugin URI for a list of ready-to-use themes)
			*/
			theme:"light",
			/*
			user defined callback functions
			*/
			callbacks:{
				/*
				Available callbacks: 
					callback					default
					-------------------------------------
					onCreate					null
					onInit						null
					onScrollStart				null
					onScroll					null
					onTotalScroll				null
					onTotalScrollBack			null
					whileScrolling				null
					onOverflowY					null
					onOverflowX					null
					onOverflowYNone				null
					onOverflowXNone				null
					onImageLoad					null
					onSelectorChange			null
					onBeforeUpdate				null
					onUpdate					null
				*/
				onTotalScrollOffset:0,
				onTotalScrollBackOffset:0,
				alwaysTriggerOffsets:true
			}
			/*
			add scrollbar(s) on all elements matching the current selector, now and in the future 
			values: boolean, string 
			string values: "on" (enable), "once" (disable after first invocation), "off" (disable)
			liveSelector values: string (selector)
				option						default
				-------------------------------------
				live						false
				liveSelector				null
			*/
		},
	
	
	
	
	
	/* 
	----------------------------------------
	VARS, CONSTANTS 
	----------------------------------------
	*/
	
		totalInstances=0, /* plugin instances amount */
		liveTimers={}, /* live option timers */
		oldIE=(window.attachEvent && !window.addEventListener) ? 1 : 0, /* detect IE < 9 */
		touchActive=false,touchable, /* global touch vars (for touch and pointer events) */
		/* general plugin classes */
		classes=[
			"mCSB_dragger_onDrag","mCSB_scrollTools_onDrag","mCS_img_loaded","mCS_disabled","mCS_destroyed","mCS_no_scrollbar",
			"mCS-autoHide","mCS-dir-rtl","mCS_no_scrollbar_y","mCS_no_scrollbar_x","mCS_y_hidden","mCS_x_hidden","mCSB_draggerContainer",
			"mCSB_buttonUp","mCSB_buttonDown","mCSB_buttonLeft","mCSB_buttonRight"
		],
		
	
	
	
	
	/* 
	----------------------------------------
	METHODS 
	----------------------------------------
	*/
	
		methods={
			
			/* 
			plugin initialization method 
			creates the scrollbar(s), plugin data object and options
			----------------------------------------
			*/
			
			init:function(options){
				
				var options=$.extend(true,{},defaults,options),
					selector=_selector.call(this); /* validate selector */
				
				/* 
				if live option is enabled, monitor for elements matching the current selector and 
				apply scrollbar(s) when found (now and in the future) 
				*/
				if(options.live){
					var liveSelector=options.liveSelector || this.selector || defaultSelector, /* live selector(s) */
						$liveSelector=$(liveSelector); /* live selector(s) as jquery object */
					if(options.live==="off"){
						/* 
						disable live if requested 
						usage: $(selector).mCustomScrollbar({live:"off"}); 
						*/
						removeLiveTimers(liveSelector);
						return;
					}
					liveTimers[liveSelector]=setTimeout(function(){
						/* call mCustomScrollbar fn on live selector(s) every half-second */
						$liveSelector.mCustomScrollbar(options);
						if(options.live==="once" && $liveSelector.length){
							/* disable live after first invocation */
							removeLiveTimers(liveSelector);
						}
					},500);
				}else{
					removeLiveTimers(liveSelector);
				}
				
				/* options backward compatibility (for versions < 3.0.0) and normalization */
				options.setWidth=(options.set_width) ? options.set_width : options.setWidth;
				options.setHeight=(options.set_height) ? options.set_height : options.setHeight;
				options.axis=(options.horizontalScroll) ? "x" : _findAxis(options.axis);
				options.scrollInertia=options.scrollInertia>0 && options.scrollInertia<17 ? 17 : options.scrollInertia;
				if(typeof options.mouseWheel!=="object" &&  options.mouseWheel==true){ /* old school mouseWheel option (non-object) */
					options.mouseWheel={enable:true,scrollAmount:"auto",axis:"y",preventDefault:false,deltaFactor:"auto",normalizeDelta:false,invert:false}
				}
				options.mouseWheel.scrollAmount=!options.mouseWheelPixels ? options.mouseWheel.scrollAmount : options.mouseWheelPixels;
				options.mouseWheel.normalizeDelta=!options.advanced.normalizeMouseWheelDelta ? options.mouseWheel.normalizeDelta : options.advanced.normalizeMouseWheelDelta;
				options.scrollButtons.scrollType=_findScrollButtonsType(options.scrollButtons.scrollType); 
				
				_theme(options); /* theme-specific options */
				
				/* plugin constructor */
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if(!$this.data(pluginPfx)){ /* prevent multiple instantiations */
					
						/* store options and create objects in jquery data */
						$this.data(pluginPfx,{
							idx:++totalInstances, /* instance index */
							opt:options, /* options */
							scrollRatio:{y:null,x:null}, /* scrollbar to content ratio */
							overflowed:null, /* overflowed axis */
							contentReset:{y:null,x:null}, /* object to check when content resets */
							bindEvents:false, /* object to check if events are bound */
							tweenRunning:false, /* object to check if tween is running */
							sequential:{}, /* sequential scrolling object */
							langDir:$this.css("direction"), /* detect/store direction (ltr or rtl) */
							cbOffsets:null, /* object to check whether callback offsets always trigger */
							/* 
							object to check how scrolling events where last triggered 
							"internal" (default - triggered by this script), "external" (triggered by other scripts, e.g. via scrollTo method) 
							usage: object.data("mCS").trigger
							*/
							trigger:null,
							/* 
							object to check for changes in elements in order to call the update method automatically 
							*/
							poll:{size:{o:0,n:0},img:{o:0,n:0},change:{o:0,n:0}}
						});
						
						var d=$this.data(pluginPfx),o=d.opt,
							/* HTML data attributes */
							htmlDataAxis=$this.data("mcs-axis"),htmlDataSbPos=$this.data("mcs-scrollbar-position"),htmlDataTheme=$this.data("mcs-theme");
						 
						if(htmlDataAxis){o.axis=htmlDataAxis;} /* usage example: data-mcs-axis="y" */
						if(htmlDataSbPos){o.scrollbarPosition=htmlDataSbPos;} /* usage example: data-mcs-scrollbar-position="outside" */
						if(htmlDataTheme){ /* usage example: data-mcs-theme="minimal" */
							o.theme=htmlDataTheme;
							_theme(o); /* theme-specific options */
						}
						
						_pluginMarkup.call(this); /* add plugin markup */
						
						if(d && o.callbacks.onCreate && typeof o.callbacks.onCreate==="function"){o.callbacks.onCreate.call(this);} /* callbacks: onCreate */
						
						$("#mCSB_"+d.idx+"_container img:not(."+classes[2]+")").addClass(classes[2]); /* flag loaded images */
						
						methods.update.call(null,$this); /* call the update method */
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/* 
			plugin update method 
			updates content and scrollbar(s) values, events and status 
			----------------------------------------
			usage: $(selector).mCustomScrollbar("update");
			*/
			
			update:function(el,cb){
				
				var selector=el || _selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
						
						var d=$this.data(pluginPfx),o=d.opt,
							mCSB_container=$("#mCSB_"+d.idx+"_container"),
							mCustomScrollBox=$("#mCSB_"+d.idx),
							mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
						
						if(!mCSB_container.length){return;}
						
						if(d.tweenRunning){_stop($this);} /* stop any running tweens while updating */
						
						if(cb && d && o.callbacks.onBeforeUpdate && typeof o.callbacks.onBeforeUpdate==="function"){o.callbacks.onBeforeUpdate.call(this);} /* callbacks: onBeforeUpdate */
						
						/* if element was disabled or destroyed, remove class(es) */
						if($this.hasClass(classes[3])){$this.removeClass(classes[3]);}
						if($this.hasClass(classes[4])){$this.removeClass(classes[4]);}
						
						/* css flexbox fix, detect/set max-height */
						mCustomScrollBox.css("max-height","none");
						if(mCustomScrollBox.height()!==$this.height()){mCustomScrollBox.css("max-height",$this.height());}
						
						_expandContentHorizontally.call(this); /* expand content horizontally */
						
						if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
							mCSB_container.css("width",_contentWidth(mCSB_container));
						}
						
						d.overflowed=_overflowed.call(this); /* determine if scrolling is required */
						
						_scrollbarVisibility.call(this); /* show/hide scrollbar(s) */
						
						/* auto-adjust scrollbar dragger length analogous to content */
						if(o.autoDraggerLength){_setDraggerLength.call(this);}
						
						_scrollRatio.call(this); /* calculate and store scrollbar to content ratio */
						
						_bindEvents.call(this); /* bind scrollbar events */
						
						/* reset scrolling position and/or events */
						var to=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)];
						if(o.axis!=="x"){ /* y/yx axis */
							if(!d.overflowed[0]){ /* y scrolling is not required */
								_resetContentPosition.call(this); /* reset content position */
								if(o.axis==="y"){
									_unbindEvents.call(this);
								}else if(o.axis==="yx" && d.overflowed[1]){
									_scrollTo($this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
								}
							}else if(mCSB_dragger[0].height()>mCSB_dragger[0].parent().height()){
								_resetContentPosition.call(this); /* reset content position */
							}else{ /* y scrolling is required */
								_scrollTo($this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
								d.contentReset.y=null;
							}
						}
						if(o.axis!=="y"){ /* x/yx axis */
							if(!d.overflowed[1]){ /* x scrolling is not required */
								_resetContentPosition.call(this); /* reset content position */
								if(o.axis==="x"){
									_unbindEvents.call(this);
								}else if(o.axis==="yx" && d.overflowed[0]){
									_scrollTo($this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
								}
							}else if(mCSB_dragger[1].width()>mCSB_dragger[1].parent().width()){
								_resetContentPosition.call(this); /* reset content position */
							}else{ /* x scrolling is required */
								_scrollTo($this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
								d.contentReset.x=null;
							}
						}
						
						/* callbacks: onImageLoad, onSelectorChange, onUpdate */
						if(cb && d){
							if(cb===2 && o.callbacks.onImageLoad && typeof o.callbacks.onImageLoad==="function"){
								o.callbacks.onImageLoad.call(this);
							}else if(cb===3 && o.callbacks.onSelectorChange && typeof o.callbacks.onSelectorChange==="function"){
								o.callbacks.onSelectorChange.call(this);
							}else if(o.callbacks.onUpdate && typeof o.callbacks.onUpdate==="function"){
								o.callbacks.onUpdate.call(this);
							}
						}
						
						_autoUpdate.call(this); /* initialize automatic updating (for dynamic content, fluid layouts etc.) */
						
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/* 
			plugin scrollTo method 
			triggers a scrolling event to a specific value
			----------------------------------------
			usage: $(selector).mCustomScrollbar("scrollTo",value,options);
			*/
		
			scrollTo:function(val,options){
				
				/* prevent silly things like $(selector).mCustomScrollbar("scrollTo",undefined); */
				if(typeof val=="undefined" || val==null){return;}
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
					
						var d=$this.data(pluginPfx),o=d.opt,
							/* method default options */
							methodDefaults={
								trigger:"external", /* method is by default triggered externally (e.g. from other scripts) */
								scrollInertia:o.scrollInertia, /* scrolling inertia (animation duration) */
								scrollEasing:"mcsEaseInOut", /* animation easing */
								moveDragger:false, /* move dragger instead of content */
								timeout:60, /* scroll-to delay */
								callbacks:true, /* enable/disable callbacks */
								onStart:true,
								onUpdate:true,
								onComplete:true
							},
							methodOptions=$.extend(true,{},methodDefaults,options),
							to=_arr.call(this,val),dur=methodOptions.scrollInertia>0 && methodOptions.scrollInertia<17 ? 17 : methodOptions.scrollInertia;
						
						/* translate yx values to actual scroll-to positions */
						to[0]=_to.call(this,to[0],"y");
						to[1]=_to.call(this,to[1],"x");
						
						/* 
						check if scroll-to value moves the dragger instead of content. 
						Only pixel values apply on dragger (e.g. 100, "100px", "-=100" etc.) 
						*/
						if(methodOptions.moveDragger){
							to[0]*=d.scrollRatio.y;
							to[1]*=d.scrollRatio.x;
						}
						
						methodOptions.dur=_isTabHidden() ? 0 : dur; //skip animations if browser tab is hidden
						
						setTimeout(function(){ 
							/* do the scrolling */
							if(to[0]!==null && typeof to[0]!=="undefined" && o.axis!=="x" && d.overflowed[0]){ /* scroll y */
								methodOptions.dir="y";
								methodOptions.overwrite="all";
								_scrollTo($this,to[0].toString(),methodOptions);
							}
							if(to[1]!==null && typeof to[1]!=="undefined" && o.axis!=="y" && d.overflowed[1]){ /* scroll x */
								methodOptions.dir="x";
								methodOptions.overwrite="none";
								_scrollTo($this,to[1].toString(),methodOptions);
							}
						},methodOptions.timeout);
						
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin stop method 
			stops scrolling animation
			----------------------------------------
			usage: $(selector).mCustomScrollbar("stop");
			*/
			stop:function(){
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
										
						_stop($this);
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin disable method 
			temporarily disables the scrollbar(s) 
			----------------------------------------
			usage: $(selector).mCustomScrollbar("disable",reset); 
			reset (boolean): resets content position to 0 
			*/
			disable:function(r){
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
						
						var d=$this.data(pluginPfx);
						
						_autoUpdate.call(this,"remove"); /* remove automatic updating */
						
						_unbindEvents.call(this); /* unbind events */
						
						if(r){_resetContentPosition.call(this);} /* reset content position */
						
						_scrollbarVisibility.call(this,true); /* show/hide scrollbar(s) */
						
						$this.addClass(classes[3]); /* add disable class */
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin destroy method 
			completely removes the scrollbar(s) and returns the element to its original state
			----------------------------------------
			usage: $(selector).mCustomScrollbar("destroy"); 
			*/
			destroy:function(){
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
					
						var d=$this.data(pluginPfx),o=d.opt,
							mCustomScrollBox=$("#mCSB_"+d.idx),
							mCSB_container=$("#mCSB_"+d.idx+"_container"),
							scrollbar=$(".mCSB_"+d.idx+"_scrollbar");
					
						if(o.live){removeLiveTimers(o.liveSelector || $(selector).selector);} /* remove live timers */
						
						_autoUpdate.call(this,"remove"); /* remove automatic updating */
						
						_unbindEvents.call(this); /* unbind events */
						
						_resetContentPosition.call(this); /* reset content position */
						
						$this.removeData(pluginPfx); /* remove plugin data object */
						
						_delete(this,"mcs"); /* delete callbacks object */
						
						/* remove plugin markup */
						scrollbar.remove(); /* remove scrollbar(s) first (those can be either inside or outside plugin's inner wrapper) */
						mCSB_container.find("img."+classes[2]).removeClass(classes[2]); /* remove loaded images flag */
						mCustomScrollBox.replaceWith(mCSB_container.contents()); /* replace plugin's inner wrapper with the original content */
						/* remove plugin classes from the element and add destroy class */
						$this.removeClass(pluginNS+" _"+pluginPfx+"_"+d.idx+" "+classes[6]+" "+classes[7]+" "+classes[5]+" "+classes[3]).addClass(classes[4]);
					
					}
					
				});
				
			}
			/* ---------------------------------------- */
			
		},
	
	
	
	
		
	/* 
	----------------------------------------
	FUNCTIONS
	----------------------------------------
	*/
	
		/* validates selector (if selector is invalid or undefined uses the default one) */
		_selector=function(){
			return (typeof $(this)!=="object" || $(this).length<1) ? defaultSelector : this;
		},
		/* -------------------- */
		
		
		/* changes options according to theme */
		_theme=function(obj){
			var fixedSizeScrollbarThemes=["rounded","rounded-dark","rounded-dots","rounded-dots-dark"],
				nonExpandedScrollbarThemes=["rounded-dots","rounded-dots-dark","3d","3d-dark","3d-thick","3d-thick-dark","inset","inset-dark","inset-2","inset-2-dark","inset-3","inset-3-dark"],
				disabledScrollButtonsThemes=["minimal","minimal-dark"],
				enabledAutoHideScrollbarThemes=["minimal","minimal-dark"],
				scrollbarPositionOutsideThemes=["minimal","minimal-dark"];
			obj.autoDraggerLength=$.inArray(obj.theme,fixedSizeScrollbarThemes) > -1 ? false : obj.autoDraggerLength;
			obj.autoExpandScrollbar=$.inArray(obj.theme,nonExpandedScrollbarThemes) > -1 ? false : obj.autoExpandScrollbar;
			obj.scrollButtons.enable=$.inArray(obj.theme,disabledScrollButtonsThemes) > -1 ? false : obj.scrollButtons.enable;
			obj.autoHideScrollbar=$.inArray(obj.theme,enabledAutoHideScrollbarThemes) > -1 ? true : obj.autoHideScrollbar;
			obj.scrollbarPosition=$.inArray(obj.theme,scrollbarPositionOutsideThemes) > -1 ? "outside" : obj.scrollbarPosition;
		},
		/* -------------------- */
		
		
		/* live option timers removal */
		removeLiveTimers=function(selector){
			if(liveTimers[selector]){
				clearTimeout(liveTimers[selector]);
				_delete(liveTimers,selector);
			}
		},
		/* -------------------- */
		
		
		/* normalizes axis option to valid values: "y", "x", "yx" */
		_findAxis=function(val){
			return (val==="yx" || val==="xy" || val==="auto") ? "yx" : (val==="x" || val==="horizontal") ? "x" : "y";
		},
		/* -------------------- */
		
		
		/* normalizes scrollButtons.scrollType option to valid values: "stepless", "stepped" */
		_findScrollButtonsType=function(val){
			return (val==="stepped" || val==="pixels" || val==="step" || val==="click") ? "stepped" : "stepless";
		},
		/* -------------------- */
		
		
		/* generates plugin markup */
		_pluginMarkup=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				expandClass=o.autoExpandScrollbar ? " "+classes[1]+"_expand" : "",
				scrollbar=["<div id='mCSB_"+d.idx+"_scrollbar_vertical' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_vertical"+expandClass+"'><div class='"+classes[12]+"'><div id='mCSB_"+d.idx+"_dragger_vertical' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>","<div id='mCSB_"+d.idx+"_scrollbar_horizontal' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_horizontal"+expandClass+"'><div class='"+classes[12]+"'><div id='mCSB_"+d.idx+"_dragger_horizontal' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],
				wrapperClass=o.axis==="yx" ? "mCSB_vertical_horizontal" : o.axis==="x" ? "mCSB_horizontal" : "mCSB_vertical",
				scrollbars=o.axis==="yx" ? scrollbar[0]+scrollbar[1] : o.axis==="x" ? scrollbar[1] : scrollbar[0],
				contentWrapper=o.axis==="yx" ? "<div id='mCSB_"+d.idx+"_container_wrapper' class='mCSB_container_wrapper' />" : "",
				autoHideClass=o.autoHideScrollbar ? " "+classes[6] : "",
				scrollbarDirClass=(o.axis!=="x" && d.langDir==="rtl") ? " "+classes[7] : "";
			if(o.setWidth){$this.css("width",o.setWidth);} /* set element width */
			if(o.setHeight){$this.css("height",o.setHeight);} /* set element height */
			o.setLeft=(o.axis!=="y" && d.langDir==="rtl") ? "989999px" : o.setLeft; /* adjust left position for rtl direction */
			$this.addClass(pluginNS+" _"+pluginPfx+"_"+d.idx+autoHideClass+scrollbarDirClass).wrapInner("<div id='mCSB_"+d.idx+"' class='mCustomScrollBox mCS-"+o.theme+" "+wrapperClass+"'><div id='mCSB_"+d.idx+"_container' class='mCSB_container' style='position:relative; top:"+o.setTop+"; left:"+o.setLeft+";' dir='"+d.langDir+"' /></div>");
			var mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
				mCSB_container.css("width",_contentWidth(mCSB_container));
			}
			if(o.scrollbarPosition==="outside"){
				if($this.css("position")==="static"){ /* requires elements with non-static position */
					$this.css("position","relative");
				}
				$this.css("overflow","visible");
				mCustomScrollBox.addClass("mCSB_outside").after(scrollbars);
			}else{
				mCustomScrollBox.addClass("mCSB_inside").append(scrollbars);
				mCSB_container.wrap(contentWrapper);
			}
			_scrollButtons.call(this); /* add scrollbar buttons */
			/* minimum dragger length */
			var mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
			mCSB_dragger[0].css("min-height",mCSB_dragger[0].height());
			mCSB_dragger[1].css("min-width",mCSB_dragger[1].width());
		},
		/* -------------------- */
		
		
		/* calculates content width */
		_contentWidth=function(el){
			var val=[el[0].scrollWidth,Math.max.apply(Math,el.children().map(function(){return $(this).outerWidth(true);}).get())],w=el.parent().width();
			return val[0]>w ? val[0] : val[1]>w ? val[1] : "100%";
		},
		/* -------------------- */
		
		
		/* expands content horizontally */
		_expandContentHorizontally=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(o.advanced.autoExpandHorizontalScroll && o.axis!=="y"){
				/* calculate scrollWidth */
				mCSB_container.css({"width":"auto","min-width":0,"overflow-x":"scroll"});
				var w=Math.ceil(mCSB_container[0].scrollWidth);
				if(o.advanced.autoExpandHorizontalScroll===3 || (o.advanced.autoExpandHorizontalScroll!==2 && w>mCSB_container.parent().width())){
					mCSB_container.css({"width":w,"min-width":"100%","overflow-x":"inherit"});
				}else{
					/* 
					wrap content with an infinite width div and set its position to absolute and width to auto. 
					Setting width to auto before calculating the actual width is important! 
					We must let the browser set the width as browser zoom values are impossible to calculate.
					*/
					mCSB_container.css({"overflow-x":"inherit","position":"absolute"})
						.wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />")
						.css({ /* set actual width, original position and un-wrap */
							/* 
							get the exact width (with decimals) and then round-up. 
							Using jquery outerWidth() will round the width value which will mess up with inner elements that have non-integer width
							*/
							"width":(Math.ceil(mCSB_container[0].getBoundingClientRect().right+0.4)-Math.floor(mCSB_container[0].getBoundingClientRect().left)),
							"min-width":"100%",
							"position":"relative"
						}).unwrap();
				}
			}
		},
		/* -------------------- */
		
		
		/* adds scrollbar buttons */
		_scrollButtons=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_scrollTools=$(".mCSB_"+d.idx+"_scrollbar:first"),
				tabindex=!_isNumeric(o.scrollButtons.tabindex) ? "" : "tabindex='"+o.scrollButtons.tabindex+"'",
				btnHTML=[
					"<a href='#' class='"+classes[13]+"' "+tabindex+" />",
					"<a href='#' class='"+classes[14]+"' "+tabindex+" />",
					"<a href='#' class='"+classes[15]+"' "+tabindex+" />",
					"<a href='#' class='"+classes[16]+"' "+tabindex+" />"
				],
				btn=[(o.axis==="x" ? btnHTML[2] : btnHTML[0]),(o.axis==="x" ? btnHTML[3] : btnHTML[1]),btnHTML[2],btnHTML[3]];
			if(o.scrollButtons.enable){
				mCSB_scrollTools.prepend(btn[0]).append(btn[1]).next(".mCSB_scrollTools").prepend(btn[2]).append(btn[3]);
			}
		},
		/* -------------------- */
		
		
		/* auto-adjusts scrollbar dragger length */
		_setDraggerLength=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				ratio=[mCustomScrollBox.height()/mCSB_container.outerHeight(false),mCustomScrollBox.width()/mCSB_container.outerWidth(false)],
				l=[
					parseInt(mCSB_dragger[0].css("min-height")),Math.round(ratio[0]*mCSB_dragger[0].parent().height()),
					parseInt(mCSB_dragger[1].css("min-width")),Math.round(ratio[1]*mCSB_dragger[1].parent().width())
				],
				h=oldIE && (l[1]<l[0]) ? l[0] : l[1],w=oldIE && (l[3]<l[2]) ? l[2] : l[3];
			mCSB_dragger[0].css({
				"height":h,"max-height":(mCSB_dragger[0].parent().height()-10)
			}).find(".mCSB_dragger_bar").css({"line-height":l[0]+"px"});
			mCSB_dragger[1].css({
				"width":w,"max-width":(mCSB_dragger[1].parent().width()-10)
			});
		},
		/* -------------------- */
		
		
		/* calculates scrollbar to content ratio */
		_scrollRatio=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				scrollAmount=[mCSB_container.outerHeight(false)-mCustomScrollBox.height(),mCSB_container.outerWidth(false)-mCustomScrollBox.width()],
				ratio=[
					scrollAmount[0]/(mCSB_dragger[0].parent().height()-mCSB_dragger[0].height()),
					scrollAmount[1]/(mCSB_dragger[1].parent().width()-mCSB_dragger[1].width())
				];
			d.scrollRatio={y:ratio[0],x:ratio[1]};
		},
		/* -------------------- */
		
		
		/* toggles scrolling classes */
		_onDragClasses=function(el,action,xpnd){
			var expandClass=xpnd ? classes[0]+"_expanded" : "",
				scrollbar=el.closest(".mCSB_scrollTools");
			if(action==="active"){
				el.toggleClass(classes[0]+" "+expandClass); scrollbar.toggleClass(classes[1]); 
				el[0]._draggable=el[0]._draggable ? 0 : 1;
			}else{
				if(!el[0]._draggable){
					if(action==="hide"){
						el.removeClass(classes[0]); scrollbar.removeClass(classes[1]);
					}else{
						el.addClass(classes[0]); scrollbar.addClass(classes[1]);
					}
				}
			}
		},
		/* -------------------- */
		
		
		/* checks if content overflows its container to determine if scrolling is required */
		_overflowed=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				contentHeight=d.overflowed==null ? mCSB_container.height() : mCSB_container.outerHeight(false),
				contentWidth=d.overflowed==null ? mCSB_container.width() : mCSB_container.outerWidth(false),
				h=mCSB_container[0].scrollHeight,w=mCSB_container[0].scrollWidth;
			if(h>contentHeight){contentHeight=h;}
			if(w>contentWidth){contentWidth=w;}
			return [contentHeight>mCustomScrollBox.height(),contentWidth>mCustomScrollBox.width()];
		},
		/* -------------------- */
		
		
		/* resets content position to 0 */
		_resetContentPosition=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
			_stop($this); /* stop any current scrolling before resetting */
			if((o.axis!=="x" && !d.overflowed[0]) || (o.axis==="y" && d.overflowed[0])){ /* reset y */
				mCSB_dragger[0].add(mCSB_container).css("top",0);
				_scrollTo($this,"_resetY");
			}
			if((o.axis!=="y" && !d.overflowed[1]) || (o.axis==="x" && d.overflowed[1])){ /* reset x */
				var cx=dx=0;
				if(d.langDir==="rtl"){ /* adjust left position for rtl direction */
					cx=mCustomScrollBox.width()-mCSB_container.outerWidth(false);
					dx=Math.abs(cx/d.scrollRatio.x);
				}
				mCSB_container.css("left",cx);
				mCSB_dragger[1].css("left",dx);
				_scrollTo($this,"_resetX");
			}
		},
		/* -------------------- */
		
		
		/* binds scrollbar events */
		_bindEvents=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt;
			if(!d.bindEvents){ /* check if events are already bound */
				_draggable.call(this);
				if(o.contentTouchScroll){_contentDraggable.call(this);}
				_selectable.call(this);
				if(o.mouseWheel.enable){ /* bind mousewheel fn when plugin is available */
					function _mwt(){
						mousewheelTimeout=setTimeout(function(){
							if(!$.event.special.mousewheel){
								_mwt();
							}else{
								clearTimeout(mousewheelTimeout);
								_mousewheel.call($this[0]);
							}
						},100);
					}
					var mousewheelTimeout;
					_mwt();
				}
				_draggerRail.call(this);
				_wrapperScroll.call(this);
				if(o.advanced.autoScrollOnFocus){_focus.call(this);}
				if(o.scrollButtons.enable){_buttons.call(this);}
				if(o.keyboard.enable){_keyboard.call(this);}
				d.bindEvents=true;
			}
		},
		/* -------------------- */
		
		
		/* unbinds scrollbar events */
		_unbindEvents=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				sb=".mCSB_"+d.idx+"_scrollbar",
				sel=$("#mCSB_"+d.idx+",#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,"+sb+" ."+classes[12]+",#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal,"+sb+">a"),
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(o.advanced.releaseDraggableSelectors){sel.add($(o.advanced.releaseDraggableSelectors));}
			if(o.advanced.extraDraggableSelectors){sel.add($(o.advanced.extraDraggableSelectors));}
			if(d.bindEvents){ /* check if events are bound */
				/* unbind namespaced events from document/selectors */
				$(document).add($(!_canAccessIFrame() || top.document)).unbind("."+namespace);
				sel.each(function(){
					$(this).unbind("."+namespace);
				});
				/* clear and delete timeouts/objects */
				clearTimeout($this[0]._focusTimeout); _delete($this[0],"_focusTimeout");
				clearTimeout(d.sequential.step); _delete(d.sequential,"step");
				clearTimeout(mCSB_container[0].onCompleteTimeout); _delete(mCSB_container[0],"onCompleteTimeout");
				d.bindEvents=false;
			}
		},
		/* -------------------- */
		
		
		/* toggles scrollbar visibility */
		_scrollbarVisibility=function(disabled){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				contentWrapper=$("#mCSB_"+d.idx+"_container_wrapper"),
				content=contentWrapper.length ? contentWrapper : $("#mCSB_"+d.idx+"_container"),
				scrollbar=[$("#mCSB_"+d.idx+"_scrollbar_vertical"),$("#mCSB_"+d.idx+"_scrollbar_horizontal")],
				mCSB_dragger=[scrollbar[0].find(".mCSB_dragger"),scrollbar[1].find(".mCSB_dragger")];
			if(o.axis!=="x"){
				if(d.overflowed[0] && !disabled){
					scrollbar[0].add(mCSB_dragger[0]).add(scrollbar[0].children("a")).css("display","block");
					content.removeClass(classes[8]+" "+classes[10]);
				}else{
					if(o.alwaysShowScrollbar){
						if(o.alwaysShowScrollbar!==2){mCSB_dragger[0].css("display","none");}
						content.removeClass(classes[10]);
					}else{
						scrollbar[0].css("display","none");
						content.addClass(classes[10]);
					}
					content.addClass(classes[8]);
				}
			}
			if(o.axis!=="y"){
				if(d.overflowed[1] && !disabled){
					scrollbar[1].add(mCSB_dragger[1]).add(scrollbar[1].children("a")).css("display","block");
					content.removeClass(classes[9]+" "+classes[11]);
				}else{
					if(o.alwaysShowScrollbar){
						if(o.alwaysShowScrollbar!==2){mCSB_dragger[1].css("display","none");}
						content.removeClass(classes[11]);
					}else{
						scrollbar[1].css("display","none");
						content.addClass(classes[11]);
					}
					content.addClass(classes[9]);
				}
			}
			if(!d.overflowed[0] && !d.overflowed[1]){
				$this.addClass(classes[5]);
			}else{
				$this.removeClass(classes[5]);
			}
		},
		/* -------------------- */
		
		
		/* returns input coordinates of pointer, touch and mouse events (relative to document) */
		_coordinates=function(e){
			var t=e.type,o=e.target.ownerDocument!==document && frameElement!==null ? [$(frameElement).offset().top,$(frameElement).offset().left] : null,
				io=_canAccessIFrame() && e.target.ownerDocument!==top.document && frameElement!==null ? [$(e.view.frameElement).offset().top,$(e.view.frameElement).offset().left] : [0,0];
			switch(t){
				case "pointerdown": case "MSPointerDown": case "pointermove": case "MSPointerMove": case "pointerup": case "MSPointerUp":
					return o ? [e.originalEvent.pageY-o[0]+io[0],e.originalEvent.pageX-o[1]+io[1],false] : [e.originalEvent.pageY,e.originalEvent.pageX,false];
					break;
				case "touchstart": case "touchmove": case "touchend":
					var touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
						touches=e.originalEvent.touches.length || e.originalEvent.changedTouches.length;
					return e.target.ownerDocument!==document ? [touch.screenY,touch.screenX,touches>1] : [touch.pageY,touch.pageX,touches>1];
					break;
				default:
					return o ? [e.pageY-o[0]+io[0],e.pageX-o[1]+io[1],false] : [e.pageY,e.pageX,false];
			}
		},
		/* -------------------- */
		
		
		/* 
		SCROLLBAR DRAG EVENTS
		scrolls content via scrollbar dragging 
		*/
		_draggable=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				draggerId=["mCSB_"+d.idx+"_dragger_vertical","mCSB_"+d.idx+"_dragger_horizontal"],
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=$("#"+draggerId[0]+",#"+draggerId[1]),
				draggable,dragY,dragX,
				rds=o.advanced.releaseDraggableSelectors ? mCSB_dragger.add($(o.advanced.releaseDraggableSelectors)) : mCSB_dragger,
				eds=o.advanced.extraDraggableSelectors ? $(!_canAccessIFrame() || top.document).add($(o.advanced.extraDraggableSelectors)) : $(!_canAccessIFrame() || top.document);
			mCSB_dragger.bind("contextmenu."+namespace,function(e){
				e.preventDefault(); //prevent right click
			}).bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				if(!_mouseBtnLeft(e)){return;} /* left mouse button only */
				touchActive=true;
				if(oldIE){document.onselectstart=function(){return false;}} /* disable text selection for IE < 9 */
				_iframe.call(mCSB_container,false); /* enable scrollbar dragging over iframes by disabling their events */
				_stop($this);
				draggable=$(this);
				var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left,
					h=draggable.height()+offset.top,w=draggable.width()+offset.left;
				if(y<h && y>0 && x<w && x>0){
					dragY=y; 
					dragX=x;
				}
				_onDragClasses(draggable,"active",o.autoExpandScrollbar); 
			}).bind("touchmove."+namespace,function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
				_drag(dragY,dragX,y,x);
			});
			$(document).add(eds).bind("mousemove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace,function(e){
				if(draggable){
					var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
					if(dragY===y && dragX===x){return;} /* has it really moved? */
					_drag(dragY,dragX,y,x);
				}
			}).add(rds).bind("mouseup."+namespace+" touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
				if(draggable){
					_onDragClasses(draggable,"active",o.autoExpandScrollbar); 
					draggable=null;
				}
				touchActive=false;
				if(oldIE){document.onselectstart=null;} /* enable text selection for IE < 9 */
				_iframe.call(mCSB_container,true); /* enable iframes events */
			});
			function _drag(dragY,dragX,y,x){
				mCSB_container[0].idleTimer=o.scrollInertia<233 ? 250 : 0;
				if(draggable.attr("id")===draggerId[1]){
					var dir="x",to=((draggable[0].offsetLeft-dragX)+x)*d.scrollRatio.x;
				}else{
					var dir="y",to=((draggable[0].offsetTop-dragY)+y)*d.scrollRatio.y;
				}
				_scrollTo($this,to.toString(),{dir:dir,drag:true});
			}
		},
		/* -------------------- */
		
		
		/* 
		TOUCH SWIPE EVENTS
		scrolls content via touch swipe 
		Emulates the native touch-swipe scrolling with momentum found in iOS, Android and WP devices 
		*/
		_contentDraggable=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				draggable,dragY,dragX,touchStartY,touchStartX,touchMoveY=[],touchMoveX=[],startTime,runningTime,endTime,distance,speed,amount,
				durA=0,durB,overwrite=o.axis==="yx" ? "none" : "all",touchIntent=[],touchDrag,docDrag,
				iframe=mCSB_container.find("iframe"),
				events=[
					"touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace, //start
					"touchmove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace, //move
					"touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace //end
				],
				touchAction=document.body.style.touchAction!==undefined && document.body.style.touchAction!=="";
			mCSB_container.bind(events[0],function(e){
				_onTouchstart(e);
			}).bind(events[1],function(e){
				_onTouchmove(e);
			});
			mCustomScrollBox.bind(events[0],function(e){
				_onTouchstart2(e);
			}).bind(events[2],function(e){
				_onTouchend(e);
			});
			if(iframe.length){
				iframe.each(function(){
					$(this).bind("load",function(){
						/* bind events on accessible iframes */
						if(_canAccessIFrame(this)){
							$(this.contentDocument || this.contentWindow.document).bind(events[0],function(e){
								_onTouchstart(e);
								_onTouchstart2(e);
							}).bind(events[1],function(e){
								_onTouchmove(e);
							}).bind(events[2],function(e){
								_onTouchend(e);
							});
						}
					});
				});
			}
			function _onTouchstart(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){touchable=0; return;}
				touchable=1; touchDrag=0; docDrag=0; draggable=1;
				$this.removeClass("mCS_touch_action");
				var offset=mCSB_container.offset();
				dragY=_coordinates(e)[0]-offset.top;
				dragX=_coordinates(e)[1]-offset.left;
				touchIntent=[_coordinates(e)[0],_coordinates(e)[1]];
			}
			function _onTouchmove(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){return;}
				if(!o.documentTouchScroll){e.preventDefault();} 
				e.stopImmediatePropagation();
				if(docDrag && !touchDrag){return;}
				if(draggable){
					runningTime=_getTime();
					var offset=mCustomScrollBox.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left,
						easing="mcsLinearOut";
					touchMoveY.push(y);
					touchMoveX.push(x);
					touchIntent[2]=Math.abs(_coordinates(e)[0]-touchIntent[0]); touchIntent[3]=Math.abs(_coordinates(e)[1]-touchIntent[1]);
					if(d.overflowed[0]){
						var limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
							prevent=((dragY-y)>0 && (y-dragY)>-(limit*d.scrollRatio.y) && (touchIntent[3]*2<touchIntent[2] || o.axis==="yx"));
					}
					if(d.overflowed[1]){
						var limitX=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
							preventX=((dragX-x)>0 && (x-dragX)>-(limitX*d.scrollRatio.x) && (touchIntent[2]*2<touchIntent[3] || o.axis==="yx"));
					}
					if(prevent || preventX){ /* prevent native document scrolling */
						if(!touchAction){e.preventDefault();} 
						touchDrag=1;
					}else{
						docDrag=1;
						$this.addClass("mCS_touch_action");
					}
					if(touchAction){e.preventDefault();} 
					amount=o.axis==="yx" ? [(dragY-y),(dragX-x)] : o.axis==="x" ? [null,(dragX-x)] : [(dragY-y),null];
					mCSB_container[0].idleTimer=250;
					if(d.overflowed[0]){_drag(amount[0],durA,easing,"y","all",true);}
					if(d.overflowed[1]){_drag(amount[1],durA,easing,"x",overwrite,true);}
				}
			}
			function _onTouchstart2(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){touchable=0; return;}
				touchable=1;
				e.stopImmediatePropagation();
				_stop($this);
				startTime=_getTime();
				var offset=mCustomScrollBox.offset();
				touchStartY=_coordinates(e)[0]-offset.top;
				touchStartX=_coordinates(e)[1]-offset.left;
				touchMoveY=[]; touchMoveX=[];
			}
			function _onTouchend(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){return;}
				draggable=0;
				e.stopImmediatePropagation();
				touchDrag=0; docDrag=0;
				endTime=_getTime();
				var offset=mCustomScrollBox.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
				if((endTime-runningTime)>30){return;}
				speed=1000/(endTime-startTime);
				var easing="mcsEaseOut",slow=speed<2.5,
					diff=slow ? [touchMoveY[touchMoveY.length-2],touchMoveX[touchMoveX.length-2]] : [0,0];
				distance=slow ? [(y-diff[0]),(x-diff[1])] : [y-touchStartY,x-touchStartX];
				var absDistance=[Math.abs(distance[0]),Math.abs(distance[1])];
				speed=slow ? [Math.abs(distance[0]/4),Math.abs(distance[1]/4)] : [speed,speed];
				var a=[
					Math.abs(mCSB_container[0].offsetTop)-(distance[0]*_m((absDistance[0]/speed[0]),speed[0])),
					Math.abs(mCSB_container[0].offsetLeft)-(distance[1]*_m((absDistance[1]/speed[1]),speed[1]))
				];
				amount=o.axis==="yx" ? [a[0],a[1]] : o.axis==="x" ? [null,a[1]] : [a[0],null];
				durB=[(absDistance[0]*4)+o.scrollInertia,(absDistance[1]*4)+o.scrollInertia];
				var md=parseInt(o.contentTouchScroll) || 0; /* absolute minimum distance required */
				amount[0]=absDistance[0]>md ? amount[0] : 0;
				amount[1]=absDistance[1]>md ? amount[1] : 0;
				if(d.overflowed[0]){_drag(amount[0],durB[0],easing,"y",overwrite,false);}
				if(d.overflowed[1]){_drag(amount[1],durB[1],easing,"x",overwrite,false);}
			}
			function _m(ds,s){
				var r=[s*1.5,s*2,s/1.5,s/2];
				if(ds>90){
					return s>4 ? r[0] : r[3];
				}else if(ds>60){
					return s>3 ? r[3] : r[2];
				}else if(ds>30){
					return s>8 ? r[1] : s>6 ? r[0] : s>4 ? s : r[2];
				}else{
					return s>8 ? s : r[3];
				}
			}
			function _drag(amount,dur,easing,dir,overwrite,drag){
				if(!amount){return;}
				_scrollTo($this,amount.toString(),{dur:dur,scrollEasing:easing,dir:dir,overwrite:overwrite,drag:drag});
			}
		},
		/* -------------------- */
		
		
		/* 
		SELECT TEXT EVENTS 
		scrolls content when text is selected 
		*/
		_selectable=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
				namespace=pluginPfx+"_"+d.idx,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				action;
			mCSB_container.bind("mousedown."+namespace,function(e){
				if(touchable){return;}
				if(!action){action=1; touchActive=true;}
			}).add(document).bind("mousemove."+namespace,function(e){
				if(!touchable && action && _sel()){
					var offset=mCSB_container.offset(),
						y=_coordinates(e)[0]-offset.top+mCSB_container[0].offsetTop,x=_coordinates(e)[1]-offset.left+mCSB_container[0].offsetLeft;
					if(y>0 && y<wrapper.height() && x>0 && x<wrapper.width()){
						if(seq.step){_seq("off",null,"stepped");}
					}else{
						if(o.axis!=="x" && d.overflowed[0]){
							if(y<0){
								_seq("on",38);
							}else if(y>wrapper.height()){
								_seq("on",40);
							}
						}
						if(o.axis!=="y" && d.overflowed[1]){
							if(x<0){
								_seq("on",37);
							}else if(x>wrapper.width()){
								_seq("on",39);
							}
						}
					}
				}
			}).bind("mouseup."+namespace+" dragend."+namespace,function(e){
				if(touchable){return;}
				if(action){action=0; _seq("off",null);}
				touchActive=false;
			});
			function _sel(){
				return 	window.getSelection ? window.getSelection().toString() : 
						document.selection && document.selection.type!="Control" ? document.selection.createRange().text : 0;
			}
			function _seq(a,c,s){
				seq.type=s && action ? "stepped" : "stepless";
				seq.scrollAmount=10;
				_sequentialScroll($this,a,c,"mcsLinearOut",s ? 60 : null);
			}
		},
		/* -------------------- */
		
		
		/* 
		MOUSE WHEEL EVENT
		scrolls content via mouse-wheel 
		via mouse-wheel plugin (https://github.com/brandonaaron/jquery-mousewheel)
		*/
		_mousewheel=function(){
			if(!$(this).data(pluginPfx)){return;} /* Check if the scrollbar is ready to use mousewheel events (issue: #185) */
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				iframe=$("#mCSB_"+d.idx+"_container").find("iframe");
			if(iframe.length){
				iframe.each(function(){
					$(this).bind("load",function(){
						/* bind events on accessible iframes */
						if(_canAccessIFrame(this)){
							$(this.contentDocument || this.contentWindow.document).bind("mousewheel."+namespace,function(e,delta){
								_onMousewheel(e,delta);
							});
						}
					});
				});
			}
			mCustomScrollBox.bind("mousewheel."+namespace,function(e,delta){
				_onMousewheel(e,delta);
			});
			function _onMousewheel(e,delta){
				_stop($this);
				if(_disableMousewheel($this,e.target)){return;} /* disables mouse-wheel when hovering specific elements */
				var deltaFactor=o.mouseWheel.deltaFactor!=="auto" ? parseInt(o.mouseWheel.deltaFactor) : (oldIE && e.deltaFactor<100) ? 100 : e.deltaFactor || 100,
					dur=o.scrollInertia;
				if(o.axis==="x" || o.mouseWheel.axis==="x"){
					var dir="x",
						px=[Math.round(deltaFactor*d.scrollRatio.x),parseInt(o.mouseWheel.scrollAmount)],
						amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.width() ? mCustomScrollBox.width()*0.9 : px[0],
						contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetLeft),
						draggerPos=mCSB_dragger[1][0].offsetLeft,
						limit=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
						dlt=o.mouseWheel.axis==="y" ? (e.deltaY || delta) : e.deltaX;
				}else{
					var dir="y",
						px=[Math.round(deltaFactor*d.scrollRatio.y),parseInt(o.mouseWheel.scrollAmount)],
						amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.height() ? mCustomScrollBox.height()*0.9 : px[0],
						contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetTop),
						draggerPos=mCSB_dragger[0][0].offsetTop,
						limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
						dlt=e.deltaY || delta;
				}
				if((dir==="y" && !d.overflowed[0]) || (dir==="x" && !d.overflowed[1])){return;}
				if(o.mouseWheel.invert || e.webkitDirectionInvertedFromDevice){dlt=-dlt;}
				if(o.mouseWheel.normalizeDelta){dlt=dlt<0 ? -1 : 1;}
				if((dlt>0 && draggerPos!==0) || (dlt<0 && draggerPos!==limit) || o.mouseWheel.preventDefault){
					e.stopImmediatePropagation();
					e.preventDefault();
				}
				if(e.deltaFactor<5 && !o.mouseWheel.normalizeDelta){
					//very low deltaFactor values mean some kind of delta acceleration (e.g. osx trackpad), so adjusting scrolling accordingly
					amount=e.deltaFactor; dur=17;
				}
				_scrollTo($this,(contentPos-(dlt*amount)).toString(),{dir:dir,dur:dur});
			}
		},
		/* -------------------- */
		
		
		/* checks if iframe can be accessed */
		_canAccessIFrameCache=new Object(),
		_canAccessIFrame=function(iframe){
		    var result=false,cacheKey=false,html=null;
		    if(iframe===undefined){
				cacheKey="#empty";
		    }else if($(iframe).attr("id")!==undefined){
				cacheKey=$(iframe).attr("id");
		    }
			if(cacheKey!==false && _canAccessIFrameCache[cacheKey]!==undefined){
				return _canAccessIFrameCache[cacheKey];
			}
			if(!iframe){
				try{
					var doc=top.document;
					html=doc.body.innerHTML;
				}catch(err){/* do nothing */}
				result=(html!==null);
			}else{
				try{
					var doc=iframe.contentDocument || iframe.contentWindow.document;
					html=doc.body.innerHTML;
				}catch(err){/* do nothing */}
				result=(html!==null);
			}
			if(cacheKey!==false){_canAccessIFrameCache[cacheKey]=result;}
			return result;
		},
		/* -------------------- */
		
		
		/* switches iframe's pointer-events property (drag, mousewheel etc. over cross-domain iframes) */
		_iframe=function(evt){
			var el=this.find("iframe");
			if(!el.length){return;} /* check if content contains iframes */
			var val=!evt ? "none" : "auto";
			el.css("pointer-events",val); /* for IE11, iframe's display property should not be "block" */
		},
		/* -------------------- */
		
		
		/* disables mouse-wheel when hovering specific elements like select, datalist etc. */
		_disableMousewheel=function(el,target){
			var tag=target.nodeName.toLowerCase(),
				tags=el.data(pluginPfx).opt.mouseWheel.disableOver,
				/* elements that require focus */
				focusTags=["select","textarea"];
			return $.inArray(tag,tags) > -1 && !($.inArray(tag,focusTags) > -1 && !$(target).is(":focus"));
		},
		/* -------------------- */
		
		
		/* 
		DRAGGER RAIL CLICK EVENT
		scrolls content via dragger rail 
		*/
		_draggerRail=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				namespace=pluginPfx+"_"+d.idx,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				mCSB_draggerContainer=$(".mCSB_"+d.idx+"_scrollbar ."+classes[12]),
				clickable;
			mCSB_draggerContainer.bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
				touchActive=true;
				if(!$(e.target).hasClass("mCSB_dragger")){clickable=1;}
			}).bind("touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
				touchActive=false;
			}).bind("click."+namespace,function(e){
				if(!clickable){return;}
				clickable=0;
				if($(e.target).hasClass(classes[12]) || $(e.target).hasClass("mCSB_draggerRail")){
					_stop($this);
					var el=$(this),mCSB_dragger=el.find(".mCSB_dragger");
					if(el.parent(".mCSB_scrollTools_horizontal").length>0){
						if(!d.overflowed[1]){return;}
						var dir="x",
							clickDir=e.pageX>mCSB_dragger.offset().left ? -1 : 1,
							to=Math.abs(mCSB_container[0].offsetLeft)-(clickDir*(wrapper.width()*0.9));
					}else{
						if(!d.overflowed[0]){return;}
						var dir="y",
							clickDir=e.pageY>mCSB_dragger.offset().top ? -1 : 1,
							to=Math.abs(mCSB_container[0].offsetTop)-(clickDir*(wrapper.height()*0.9));
					}
					_scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
				}
			});
		},
		/* -------------------- */
		
		
		/* 
		FOCUS EVENT
		scrolls content via element focus (e.g. clicking an input, pressing TAB key etc.)
		*/
		_focus=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent();
			mCSB_container.bind("focusin."+namespace,function(e){
				var el=$(document.activeElement),
					nested=mCSB_container.find(".mCustomScrollBox").length,
					dur=0;
				if(!el.is(o.advanced.autoScrollOnFocus)){return;}
				_stop($this);
				clearTimeout($this[0]._focusTimeout);
				$this[0]._focusTimer=nested ? (dur+17)*nested : 0;
				$this[0]._focusTimeout=setTimeout(function(){
					var	to=[_childPos(el)[0],_childPos(el)[1]],
						contentPos=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft],
						isVisible=[
							(contentPos[0]+to[0]>=0 && contentPos[0]+to[0]<wrapper.height()-el.outerHeight(false)),
							(contentPos[1]+to[1]>=0 && contentPos[0]+to[1]<wrapper.width()-el.outerWidth(false))
						],
						overwrite=(o.axis==="yx" && !isVisible[0] && !isVisible[1]) ? "none" : "all";
					if(o.axis!=="x" && !isVisible[0]){
						_scrollTo($this,to[0].toString(),{dir:"y",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
					}
					if(o.axis!=="y" && !isVisible[1]){
						_scrollTo($this,to[1].toString(),{dir:"x",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
					}
				},$this[0]._focusTimer);
			});
		},
		/* -------------------- */
		
		
		/* sets content wrapper scrollTop/scrollLeft always to 0 */
		_wrapperScroll=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				namespace=pluginPfx+"_"+d.idx,
				wrapper=$("#mCSB_"+d.idx+"_container").parent();
			wrapper.bind("scroll."+namespace,function(e){
				if(wrapper.scrollTop()!==0 || wrapper.scrollLeft()!==0){
					$(".mCSB_"+d.idx+"_scrollbar").css("visibility","hidden"); /* hide scrollbar(s) */
				}
			});
		},
		/* -------------------- */
		
		
		/* 
		BUTTONS EVENTS
		scrolls content via up, down, left and right buttons 
		*/
		_buttons=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
				namespace=pluginPfx+"_"+d.idx,
				sel=".mCSB_"+d.idx+"_scrollbar",
				btn=$(sel+">a");
			btn.bind("contextmenu."+namespace,function(e){
				e.preventDefault(); //prevent right click
			}).bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace+" mouseup."+namespace+" touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace+" mouseout."+namespace+" pointerout."+namespace+" MSPointerOut."+namespace+" click."+namespace,function(e){
				e.preventDefault();
				if(!_mouseBtnLeft(e)){return;} /* left mouse button only */
				var btnClass=$(this).attr("class");
				seq.type=o.scrollButtons.scrollType;
				switch(e.type){
					case "mousedown": case "touchstart": case "pointerdown": case "MSPointerDown":
						if(seq.type==="stepped"){return;}
						touchActive=true;
						d.tweenRunning=false;
						_seq("on",btnClass);
						break;
					case "mouseup": case "touchend": case "pointerup": case "MSPointerUp":
					case "mouseout": case "pointerout": case "MSPointerOut":
						if(seq.type==="stepped"){return;}
						touchActive=false;
						if(seq.dir){_seq("off",btnClass);}
						break;
					case "click":
						if(seq.type!=="stepped" || d.tweenRunning){return;}
						_seq("on",btnClass);
						break;
				}
				function _seq(a,c){
					seq.scrollAmount=o.scrollButtons.scrollAmount;
					_sequentialScroll($this,a,c);
				}
			});
		},
		/* -------------------- */
		
		
		/* 
		KEYBOARD EVENTS
		scrolls content via keyboard 
		Keys: up arrow, down arrow, left arrow, right arrow, PgUp, PgDn, Home, End
		*/
		_keyboard=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
				namespace=pluginPfx+"_"+d.idx,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				editables="input,textarea,select,datalist,keygen,[contenteditable='true']",
				iframe=mCSB_container.find("iframe"),
				events=["blur."+namespace+" keydown."+namespace+" keyup."+namespace];
			if(iframe.length){
				iframe.each(function(){
					$(this).bind("load",function(){
						/* bind events on accessible iframes */
						if(_canAccessIFrame(this)){
							$(this.contentDocument || this.contentWindow.document).bind(events[0],function(e){
								_onKeyboard(e);
							});
						}
					});
				});
			}
			mCustomScrollBox.attr("tabindex","0").bind(events[0],function(e){
				_onKeyboard(e);
			});
			function _onKeyboard(e){
				switch(e.type){
					case "blur":
						if(d.tweenRunning && seq.dir){_seq("off",null);}
						break;
					case "keydown": case "keyup":
						var code=e.keyCode ? e.keyCode : e.which,action="on";
						if((o.axis!=="x" && (code===38 || code===40)) || (o.axis!=="y" && (code===37 || code===39))){
							/* up (38), down (40), left (37), right (39) arrows */
							if(((code===38 || code===40) && !d.overflowed[0]) || ((code===37 || code===39) && !d.overflowed[1])){return;}
							if(e.type==="keyup"){action="off";}
							if(!$(document.activeElement).is(editables)){
								e.preventDefault();
								e.stopImmediatePropagation();
								_seq(action,code);
							}
						}else if(code===33 || code===34){
							/* PgUp (33), PgDn (34) */
							if(d.overflowed[0] || d.overflowed[1]){
								e.preventDefault();
								e.stopImmediatePropagation();
							}
							if(e.type==="keyup"){
								_stop($this);
								var keyboardDir=code===34 ? -1 : 1;
								if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
									var dir="x",to=Math.abs(mCSB_container[0].offsetLeft)-(keyboardDir*(wrapper.width()*0.9));
								}else{
									var dir="y",to=Math.abs(mCSB_container[0].offsetTop)-(keyboardDir*(wrapper.height()*0.9));
								}
								_scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
							}
						}else if(code===35 || code===36){
							/* End (35), Home (36) */
							if(!$(document.activeElement).is(editables)){
								if(d.overflowed[0] || d.overflowed[1]){
									e.preventDefault();
									e.stopImmediatePropagation();
								}
								if(e.type==="keyup"){
									if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
										var dir="x",to=code===35 ? Math.abs(wrapper.width()-mCSB_container.outerWidth(false)) : 0;
									}else{
										var dir="y",to=code===35 ? Math.abs(wrapper.height()-mCSB_container.outerHeight(false)) : 0;
									}
									_scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
								}
							}
						}
						break;
				}
				function _seq(a,c){
					seq.type=o.keyboard.scrollType;
					seq.scrollAmount=o.keyboard.scrollAmount;
					if(seq.type==="stepped" && d.tweenRunning){return;}
					_sequentialScroll($this,a,c);
				}
			}
		},
		/* -------------------- */
		
		
		/* scrolls content sequentially (used when scrolling via buttons, keyboard arrows etc.) */
		_sequentialScroll=function(el,action,trigger,e,s){
			var d=el.data(pluginPfx),o=d.opt,seq=d.sequential,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				once=seq.type==="stepped" ? true : false,
				steplessSpeed=o.scrollInertia < 26 ? 26 : o.scrollInertia, /* 26/1.5=17 */
				steppedSpeed=o.scrollInertia < 1 ? 17 : o.scrollInertia;
			switch(action){
				case "on":
					seq.dir=[
						(trigger===classes[16] || trigger===classes[15] || trigger===39 || trigger===37 ? "x" : "y"),
						(trigger===classes[13] || trigger===classes[15] || trigger===38 || trigger===37 ? -1 : 1)
					];
					_stop(el);
					if(_isNumeric(trigger) && seq.type==="stepped"){return;}
					_on(once);
					break;
				case "off":
					_off();
					if(once || (d.tweenRunning && seq.dir)){
						_on(true);
					}
					break;
			}
			
			/* starts sequence */
			function _on(once){
				if(o.snapAmount){seq.scrollAmount=!(o.snapAmount instanceof Array) ? o.snapAmount : seq.dir[0]==="x" ? o.snapAmount[1] : o.snapAmount[0];} /* scrolling snapping */
				var c=seq.type!=="stepped", /* continuous scrolling */
					t=s ? s : !once ? 1000/60 : c ? steplessSpeed/1.5 : steppedSpeed, /* timer */
					m=!once ? 2.5 : c ? 7.5 : 40, /* multiplier */
					contentPos=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)],
					ratio=[d.scrollRatio.y>10 ? 10 : d.scrollRatio.y,d.scrollRatio.x>10 ? 10 : d.scrollRatio.x],
					amount=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*(ratio[1]*m)) : contentPos[0]+(seq.dir[1]*(ratio[0]*m)),
					px=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*parseInt(seq.scrollAmount)) : contentPos[0]+(seq.dir[1]*parseInt(seq.scrollAmount)),
					to=seq.scrollAmount!=="auto" ? px : amount,
					easing=e ? e : !once ? "mcsLinear" : c ? "mcsLinearOut" : "mcsEaseInOut",
					onComplete=!once ? false : true;
				if(once && t<17){
					to=seq.dir[0]==="x" ? contentPos[1] : contentPos[0];
				}
				_scrollTo(el,to.toString(),{dir:seq.dir[0],scrollEasing:easing,dur:t,onComplete:onComplete});
				if(once){
					seq.dir=false;
					return;
				}
				clearTimeout(seq.step);
				seq.step=setTimeout(function(){
					_on();
				},t);
			}
			/* stops sequence */
			function _off(){
				clearTimeout(seq.step);
				_delete(seq,"step");
				_stop(el);
			}
		},
		/* -------------------- */
		
		
		/* returns a yx array from value */
		_arr=function(val){
			var o=$(this).data(pluginPfx).opt,vals=[];
			if(typeof val==="function"){val=val();} /* check if the value is a single anonymous function */
			/* check if value is object or array, its length and create an array with yx values */
			if(!(val instanceof Array)){ /* object value (e.g. {y:"100",x:"100"}, 100 etc.) */
				vals[0]=val.y ? val.y : val.x || o.axis==="x" ? null : val;
				vals[1]=val.x ? val.x : val.y || o.axis==="y" ? null : val;
			}else{ /* array value (e.g. [100,100]) */
				vals=val.length>1 ? [val[0],val[1]] : o.axis==="x" ? [null,val[0]] : [val[0],null];
			}
			/* check if array values are anonymous functions */
			if(typeof vals[0]==="function"){vals[0]=vals[0]();}
			if(typeof vals[1]==="function"){vals[1]=vals[1]();}
			return vals;
		},
		/* -------------------- */
		
		
		/* translates values (e.g. "top", 100, "100px", "#id") to actual scroll-to positions */
		_to=function(val,dir){
			if(val==null || typeof val=="undefined"){return;}
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				t=typeof val;
			if(!dir){dir=o.axis==="x" ? "x" : "y";}
			var contentLength=dir==="x" ? mCSB_container.outerWidth(false)-wrapper.width() : mCSB_container.outerHeight(false)-wrapper.height(),
				contentPos=dir==="x" ? mCSB_container[0].offsetLeft : mCSB_container[0].offsetTop,
				cssProp=dir==="x" ? "left" : "top";
			switch(t){
				case "function": /* this currently is not used. Consider removing it */
					return val();
					break;
				case "object": /* js/jquery object */
					var obj=val.jquery ? val : $(val);
					if(!obj.length){return;}
					return dir==="x" ? _childPos(obj)[1] : _childPos(obj)[0];
					break;
				case "string": case "number":
					if(_isNumeric(val)){ /* numeric value */
						return Math.abs(val);
					}else if(val.indexOf("%")!==-1){ /* percentage value */
						return Math.abs(contentLength*parseInt(val)/100);
					}else if(val.indexOf("-=")!==-1){ /* decrease value */
						return Math.abs(contentPos-parseInt(val.split("-=")[1]));
					}else if(val.indexOf("+=")!==-1){ /* inrease value */
						var p=(contentPos+parseInt(val.split("+=")[1]));
						return p>=0 ? 0 : Math.abs(p);
					}else if(val.indexOf("px")!==-1 && _isNumeric(val.split("px")[0])){ /* pixels string value (e.g. "100px") */
						return Math.abs(val.split("px")[0]);
					}else{
						if(val==="top" || val==="left"){ /* special strings */
							return 0;
						}else if(val==="bottom"){
							return Math.abs(wrapper.height()-mCSB_container.outerHeight(false));
						}else if(val==="right"){
							return Math.abs(wrapper.width()-mCSB_container.outerWidth(false));
						}else if(val==="first" || val==="last"){
							var obj=mCSB_container.find(":"+val);
							return dir==="x" ? _childPos(obj)[1] : _childPos(obj)[0];
						}else{
							if($(val).length){ /* jquery selector */
								return dir==="x" ? _childPos($(val))[1] : _childPos($(val))[0];
							}else{ /* other values (e.g. "100em") */
								mCSB_container.css(cssProp,val);
								methods.update.call(null,$this[0]);
								return;
							}
						}
					}
					break;
			}
		},
		/* -------------------- */
		
		
		/* calls the update method automatically */
		_autoUpdate=function(rem){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(rem){
				/* 
				removes autoUpdate timer 
				usage: _autoUpdate.call(this,"remove");
				*/
				clearTimeout(mCSB_container[0].autoUpdate);
				_delete(mCSB_container[0],"autoUpdate");
				return;
			}
			upd();
			function upd(){
				clearTimeout(mCSB_container[0].autoUpdate);
				if($this.parents("html").length===0){
					/* check element in dom tree */
					$this=null;
					return;
				}
				mCSB_container[0].autoUpdate=setTimeout(function(){
					/* update on specific selector(s) length and size change */
					if(o.advanced.updateOnSelectorChange){
						d.poll.change.n=sizesSum();
						if(d.poll.change.n!==d.poll.change.o){
							d.poll.change.o=d.poll.change.n;
							doUpd(3);
							return;
						}
					}
					/* update on main element and scrollbar size changes */
					if(o.advanced.updateOnContentResize){
						d.poll.size.n=$this[0].scrollHeight+$this[0].scrollWidth+mCSB_container[0].offsetHeight+$this[0].offsetHeight+$this[0].offsetWidth;
						if(d.poll.size.n!==d.poll.size.o){
							d.poll.size.o=d.poll.size.n;
							doUpd(1);
							return;
						}
					}
					/* update on image load */
					if(o.advanced.updateOnImageLoad){
						if(!(o.advanced.updateOnImageLoad==="auto" && o.axis==="y")){ //by default, it doesn't run on vertical content
							d.poll.img.n=mCSB_container.find("img").length;
							if(d.poll.img.n!==d.poll.img.o){
								d.poll.img.o=d.poll.img.n;
								mCSB_container.find("img").each(function(){
									imgLoader(this);
								});
								return;
							}
						}
					}
					if(o.advanced.updateOnSelectorChange || o.advanced.updateOnContentResize || o.advanced.updateOnImageLoad){upd();}
				},o.advanced.autoUpdateTimeout);
			}
			/* a tiny image loader */
			function imgLoader(el){
				if($(el).hasClass(classes[2])){doUpd(); return;}
				var img=new Image();
				function createDelegate(contextObject,delegateMethod){
					return function(){return delegateMethod.apply(contextObject,arguments);}
				}
				function imgOnLoad(){
					this.onload=null;
					$(el).addClass(classes[2]);
					doUpd(2);
				}
				img.onload=createDelegate(img,imgOnLoad);
				img.src=el.src;
			}
			/* returns the total height and width sum of all elements matching the selector */
			function sizesSum(){
				if(o.advanced.updateOnSelectorChange===true){o.advanced.updateOnSelectorChange="*";}
				var total=0,sel=mCSB_container.find(o.advanced.updateOnSelectorChange);
				if(o.advanced.updateOnSelectorChange && sel.length>0){sel.each(function(){total+=this.offsetHeight+this.offsetWidth;});}
				return total;
			}
			/* calls the update method */
			function doUpd(cb){
				clearTimeout(mCSB_container[0].autoUpdate);
				methods.update.call(null,$this[0],cb);
			}
		},
		/* -------------------- */
		
		
		/* snaps scrolling to a multiple of a pixels number */
		_snapAmount=function(to,amount,offset){
			return (Math.round(to/amount)*amount-offset); 
		},
		/* -------------------- */
		
		
		/* stops content and scrollbar animations */
		_stop=function(el){
			var d=el.data(pluginPfx),
				sel=$("#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal");
			sel.each(function(){
				_stopTween.call(this);
			});
		},
		/* -------------------- */
		
		
		/* 
		ANIMATES CONTENT 
		This is where the actual scrolling happens
		*/
		_scrollTo=function(el,to,options){
			var d=el.data(pluginPfx),o=d.opt,
				defaults={
					trigger:"internal",
					dir:"y",
					scrollEasing:"mcsEaseOut",
					drag:false,
					dur:o.scrollInertia,
					overwrite:"all",
					callbacks:true,
					onStart:true,
					onUpdate:true,
					onComplete:true
				},
				options=$.extend(defaults,options),
				dur=[options.dur,(options.drag ? 0 : options.dur)],
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				totalScrollOffsets=o.callbacks.onTotalScrollOffset ? _arr.call(el,o.callbacks.onTotalScrollOffset) : [0,0],
				totalScrollBackOffsets=o.callbacks.onTotalScrollBackOffset ? _arr.call(el,o.callbacks.onTotalScrollBackOffset) : [0,0];
			d.trigger=options.trigger;
			if(wrapper.scrollTop()!==0 || wrapper.scrollLeft()!==0){ /* always reset scrollTop/Left */
				$(".mCSB_"+d.idx+"_scrollbar").css("visibility","visible");
				wrapper.scrollTop(0).scrollLeft(0);
			}
			if(to==="_resetY" && !d.contentReset.y){
				/* callbacks: onOverflowYNone */
				if(_cb("onOverflowYNone")){o.callbacks.onOverflowYNone.call(el[0]);}
				d.contentReset.y=1;
			}
			if(to==="_resetX" && !d.contentReset.x){
				/* callbacks: onOverflowXNone */
				if(_cb("onOverflowXNone")){o.callbacks.onOverflowXNone.call(el[0]);}
				d.contentReset.x=1;
			}
			if(to==="_resetY" || to==="_resetX"){return;}
			if((d.contentReset.y || !el[0].mcs) && d.overflowed[0]){
				/* callbacks: onOverflowY */
				if(_cb("onOverflowY")){o.callbacks.onOverflowY.call(el[0]);}
				d.contentReset.x=null;
			}
			if((d.contentReset.x || !el[0].mcs) && d.overflowed[1]){
				/* callbacks: onOverflowX */
				if(_cb("onOverflowX")){o.callbacks.onOverflowX.call(el[0]);}
				d.contentReset.x=null;
			}
			if(o.snapAmount){ /* scrolling snapping */
				var snapAmount=!(o.snapAmount instanceof Array) ? o.snapAmount : options.dir==="x" ? o.snapAmount[1] : o.snapAmount[0];
				to=_snapAmount(to,snapAmount,o.snapOffset);
			}
			switch(options.dir){
				case "x":
					var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_horizontal"),
						property="left",
						contentPos=mCSB_container[0].offsetLeft,
						limit=[
							mCustomScrollBox.width()-mCSB_container.outerWidth(false),
							mCSB_dragger.parent().width()-mCSB_dragger.width()
						],
						scrollTo=[to,to===0 ? 0 : (to/d.scrollRatio.x)],
						tso=totalScrollOffsets[1],
						tsbo=totalScrollBackOffsets[1],
						totalScrollOffset=tso>0 ? tso/d.scrollRatio.x : 0,
						totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.x : 0;
					break;
				case "y":
					var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_vertical"),
						property="top",
						contentPos=mCSB_container[0].offsetTop,
						limit=[
							mCustomScrollBox.height()-mCSB_container.outerHeight(false),
							mCSB_dragger.parent().height()-mCSB_dragger.height()
						],
						scrollTo=[to,to===0 ? 0 : (to/d.scrollRatio.y)],
						tso=totalScrollOffsets[0],
						tsbo=totalScrollBackOffsets[0],
						totalScrollOffset=tso>0 ? tso/d.scrollRatio.y : 0,
						totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.y : 0;
					break;
			}
			if(scrollTo[1]<0 || (scrollTo[0]===0 && scrollTo[1]===0)){
				scrollTo=[0,0];
			}else if(scrollTo[1]>=limit[1]){
				scrollTo=[limit[0],limit[1]];
			}else{
				scrollTo[0]=-scrollTo[0];
			}
			if(!el[0].mcs){
				_mcs();  /* init mcs object (once) to make it available before callbacks */
				if(_cb("onInit")){o.callbacks.onInit.call(el[0]);} /* callbacks: onInit */
			}
			clearTimeout(mCSB_container[0].onCompleteTimeout);
			_tweenTo(mCSB_dragger[0],property,Math.round(scrollTo[1]),dur[1],options.scrollEasing);
			if(!d.tweenRunning && ((contentPos===0 && scrollTo[0]>=0) || (contentPos===limit[0] && scrollTo[0]<=limit[0]))){return;}
			_tweenTo(mCSB_container[0],property,Math.round(scrollTo[0]),dur[0],options.scrollEasing,options.overwrite,{
				onStart:function(){
					if(options.callbacks && options.onStart && !d.tweenRunning){
						/* callbacks: onScrollStart */
						if(_cb("onScrollStart")){_mcs(); o.callbacks.onScrollStart.call(el[0]);}
						d.tweenRunning=true;
						_onDragClasses(mCSB_dragger);
						d.cbOffsets=_cbOffsets();
					}
				},onUpdate:function(){
					if(options.callbacks && options.onUpdate){
						/* callbacks: whileScrolling */
						if(_cb("whileScrolling")){_mcs(); o.callbacks.whileScrolling.call(el[0]);}
					}
				},onComplete:function(){
					if(options.callbacks && options.onComplete){
						if(o.axis==="yx"){clearTimeout(mCSB_container[0].onCompleteTimeout);}
						var t=mCSB_container[0].idleTimer || 0;
						mCSB_container[0].onCompleteTimeout=setTimeout(function(){
							/* callbacks: onScroll, onTotalScroll, onTotalScrollBack */
							if(_cb("onScroll")){_mcs(); o.callbacks.onScroll.call(el[0]);}
							if(_cb("onTotalScroll") && scrollTo[1]>=limit[1]-totalScrollOffset && d.cbOffsets[0]){_mcs(); o.callbacks.onTotalScroll.call(el[0]);}
							if(_cb("onTotalScrollBack") && scrollTo[1]<=totalScrollBackOffset && d.cbOffsets[1]){_mcs(); o.callbacks.onTotalScrollBack.call(el[0]);}
							d.tweenRunning=false;
							mCSB_container[0].idleTimer=0;
							_onDragClasses(mCSB_dragger,"hide");
						},t);
					}
				}
			});
			/* checks if callback function exists */
			function _cb(cb){
				return d && o.callbacks[cb] && typeof o.callbacks[cb]==="function";
			}
			/* checks whether callback offsets always trigger */
			function _cbOffsets(){
				return [o.callbacks.alwaysTriggerOffsets || contentPos>=limit[0]+tso,o.callbacks.alwaysTriggerOffsets || contentPos<=-tsbo];
			}
			/* 
			populates object with useful values for the user 
			values: 
				content: this.mcs.content
				content top position: this.mcs.top 
				content left position: this.mcs.left 
				dragger top position: this.mcs.draggerTop 
				dragger left position: this.mcs.draggerLeft 
				scrolling y percentage: this.mcs.topPct 
				scrolling x percentage: this.mcs.leftPct 
				scrolling direction: this.mcs.direction
			*/
			function _mcs(){
				var cp=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft], /* content position */
					dp=[mCSB_dragger[0].offsetTop,mCSB_dragger[0].offsetLeft], /* dragger position */
					cl=[mCSB_container.outerHeight(false),mCSB_container.outerWidth(false)], /* content length */
					pl=[mCustomScrollBox.height(),mCustomScrollBox.width()]; /* content parent length */
				el[0].mcs={
					content:mCSB_container, /* original content wrapper as jquery object */
					top:cp[0],left:cp[1],draggerTop:dp[0],draggerLeft:dp[1],
					topPct:Math.round((100*Math.abs(cp[0]))/(Math.abs(cl[0])-pl[0])),leftPct:Math.round((100*Math.abs(cp[1]))/(Math.abs(cl[1])-pl[1])),
					direction:options.dir
				};
				/* 
				this refers to the original element containing the scrollbar(s)
				usage: this.mcs.top, this.mcs.leftPct etc. 
				*/
			}
		},
		/* -------------------- */
		
		
		/* 
		CUSTOM JAVASCRIPT ANIMATION TWEEN 
		Lighter and faster than jquery animate() and css transitions 
		Animates top/left properties and includes easings 
		*/
		_tweenTo=function(el,prop,to,duration,easing,overwrite,callbacks){
			if(!el._mTween){el._mTween={top:{},left:{}};}
			var callbacks=callbacks || {},
				onStart=callbacks.onStart || function(){},onUpdate=callbacks.onUpdate || function(){},onComplete=callbacks.onComplete || function(){},
				startTime=_getTime(),_delay,progress=0,from=el.offsetTop,elStyle=el.style,_request,tobj=el._mTween[prop];
			if(prop==="left"){from=el.offsetLeft;}
			var diff=to-from;
			tobj.stop=0;
			if(overwrite!=="none"){_cancelTween();}
			_startTween();
			function _step(){
				if(tobj.stop){return;}
				if(!progress){onStart.call();}
				progress=_getTime()-startTime;
				_tween();
				if(progress>=tobj.time){
					tobj.time=(progress>tobj.time) ? progress+_delay-(progress-tobj.time) : progress+_delay-1;
					if(tobj.time<progress+1){tobj.time=progress+1;}
				}
				if(tobj.time<duration){tobj.id=_request(_step);}else{onComplete.call();}
			}
			function _tween(){
				if(duration>0){
					tobj.currVal=_ease(tobj.time,from,diff,duration,easing);
					elStyle[prop]=Math.round(tobj.currVal)+"px";
				}else{
					elStyle[prop]=to+"px";
				}
				onUpdate.call();
			}
			function _startTween(){
				_delay=1000/60;
				tobj.time=progress+_delay;
				_request=(!window.requestAnimationFrame) ? function(f){_tween(); return setTimeout(f,0.01);} : window.requestAnimationFrame;
				tobj.id=_request(_step);
			}
			function _cancelTween(){
				if(tobj.id==null){return;}
				if(!window.requestAnimationFrame){clearTimeout(tobj.id);
				}else{window.cancelAnimationFrame(tobj.id);}
				tobj.id=null;
			}
			function _ease(t,b,c,d,type){
				switch(type){
					case "linear": case "mcsLinear":
						return c*t/d + b;
						break;
					case "mcsLinearOut":
						t/=d; t--; return c * Math.sqrt(1 - t*t) + b;
						break;
					case "easeInOutSmooth":
						t/=d/2;
						if(t<1) return c/2*t*t + b;
						t--;
						return -c/2 * (t*(t-2) - 1) + b;
						break;
					case "easeInOutStrong":
						t/=d/2;
						if(t<1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
						t--;
						return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
						break;
					case "easeInOut": case "mcsEaseInOut":
						t/=d/2;
						if(t<1) return c/2*t*t*t + b;
						t-=2;
						return c/2*(t*t*t + 2) + b;
						break;
					case "easeOutSmooth":
						t/=d; t--;
						return -c * (t*t*t*t - 1) + b;
						break;
					case "easeOutStrong":
						return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
						break;
					case "easeOut": case "mcsEaseOut": default:
						var ts=(t/=d)*t,tc=ts*t;
						return b+c*(0.499999999999997*tc*ts + -2.5*ts*ts + 5.5*tc + -6.5*ts + 4*t);
				}
			}
		},
		/* -------------------- */
		
		
		/* returns current time */
		_getTime=function(){
			if(window.performance && window.performance.now){
				return window.performance.now();
			}else{
				if(window.performance && window.performance.webkitNow){
					return window.performance.webkitNow();
				}else{
					if(Date.now){return Date.now();}else{return new Date().getTime();}
				}
			}
		},
		/* -------------------- */
		
		
		/* stops a tween */
		_stopTween=function(){
			var el=this;
			if(!el._mTween){el._mTween={top:{},left:{}};}
			var props=["top","left"];
			for(var i=0; i<props.length; i++){
				var prop=props[i];
				if(el._mTween[prop].id){
					if(!window.requestAnimationFrame){clearTimeout(el._mTween[prop].id);
					}else{window.cancelAnimationFrame(el._mTween[prop].id);}
					el._mTween[prop].id=null;
					el._mTween[prop].stop=1;
				}
			}
		},
		/* -------------------- */
		
		
		/* deletes a property (avoiding the exception thrown by IE) */
		_delete=function(c,m){
			try{delete c[m];}catch(e){c[m]=null;}
		},
		/* -------------------- */
		
		
		/* detects left mouse button */
		_mouseBtnLeft=function(e){
			return !(e.which && e.which!==1);
		},
		/* -------------------- */
		
		
		/* detects if pointer type event is touch */
		_pointerTouch=function(e){
			var t=e.originalEvent.pointerType;
			return !(t && t!=="touch" && t!==2);
		},
		/* -------------------- */
		
		
		/* checks if value is numeric */
		_isNumeric=function(val){
			return !isNaN(parseFloat(val)) && isFinite(val);
		},
		/* -------------------- */
		
		
		/* returns element position according to content */
		_childPos=function(el){
			var p=el.parents(".mCSB_container");
			return [el.offset().top-p.offset().top,el.offset().left-p.offset().left];
		},
		/* -------------------- */
		
		
		/* checks if browser tab is hidden/inactive via Page Visibility API */
		_isTabHidden=function(){
			var prop=_getHiddenProp();
			if(!prop) return false;
			return document[prop];
			function _getHiddenProp(){
				var pfx=["webkit","moz","ms","o"];
				if("hidden" in document) return "hidden"; //natively supported
				for(var i=0; i<pfx.length; i++){ //prefixed
				    if((pfx[i]+"Hidden") in document) 
				        return pfx[i]+"Hidden";
				}
				return null; //not supported
			}
		};
		/* -------------------- */
		
	
	
	
	
	/* 
	----------------------------------------
	PLUGIN SETUP 
	----------------------------------------
	*/
	
	/* plugin constructor functions */
	$.fn[pluginNS]=function(method){ /* usage: $(selector).mCustomScrollbar(); */
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method==="object" || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error("Method "+method+" does not exist");
		}
	};
	$[pluginNS]=function(method){ /* usage: $.mCustomScrollbar(); */
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method==="object" || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error("Method "+method+" does not exist");
		}
	};
	
	/* 
	allow setting plugin default options. 
	usage: $.mCustomScrollbar.defaults.scrollInertia=500; 
	to apply any changed default options on default selectors (below), use inside document ready fn 
	e.g.: $(document).ready(function(){ $.mCustomScrollbar.defaults.scrollInertia=500; });
	*/
	$[pluginNS].defaults=defaults;
	
	/* 
	add window object (window.mCustomScrollbar) 
	usage: if(window.mCustomScrollbar){console.log("custom scrollbar plugin loaded");}
	*/
	window[pluginNS]=true;
	
	$(window).bind("load",function(){
		
		$(defaultSelector)[pluginNS](); /* add scrollbars automatically on default selector */
		
		/* extend jQuery expressions */
		$.extend($.expr[":"],{
			/* checks if element is within scrollable viewport */
			mcsInView:$.expr[":"].mcsInView || function(el){
				var $el=$(el),content=$el.parents(".mCSB_container"),wrapper,cPos;
				if(!content.length){return;}
				wrapper=content.parent();
				cPos=[content[0].offsetTop,content[0].offsetLeft];
				return 	cPos[0]+_childPos($el)[0]>=0 && cPos[0]+_childPos($el)[0]<wrapper.height()-$el.outerHeight(false) && 
						cPos[1]+_childPos($el)[1]>=0 && cPos[1]+_childPos($el)[1]<wrapper.width()-$el.outerWidth(false);
			},
			/* checks if element or part of element is in view of scrollable viewport */
			mcsInSight:$.expr[":"].mcsInSight || function(el,i,m){
				var $el=$(el),elD,content=$el.parents(".mCSB_container"),wrapperView,pos,wrapperViewPct,
					pctVals=m[3]==="exact" ? [[1,0],[1,0]] : [[0.9,0.1],[0.6,0.4]];
				if(!content.length){return;}
				elD=[$el.outerHeight(false),$el.outerWidth(false)];
				pos=[content[0].offsetTop+_childPos($el)[0],content[0].offsetLeft+_childPos($el)[1]];
				wrapperView=[content.parent()[0].offsetHeight,content.parent()[0].offsetWidth];
				wrapperViewPct=[elD[0]<wrapperView[0] ? pctVals[0] : pctVals[1],elD[1]<wrapperView[1] ? pctVals[0] : pctVals[1]];
				return 	pos[0]-(wrapperView[0]*wrapperViewPct[0][0])<0 && pos[0]+elD[0]-(wrapperView[0]*wrapperViewPct[0][1])>=0 && 
						pos[1]-(wrapperView[1]*wrapperViewPct[1][0])<0 && pos[1]+elD[1]-(wrapperView[1]*wrapperViewPct[1][1])>=0;
			},
			/* checks if element is overflowed having visible scrollbar(s) */
			mcsOverflow:$.expr[":"].mcsOverflow || function(el){
				var d=$(el).data(pluginPfx);
				if(!d){return;}
				return d.overflowed[0] || d.overflowed[1];
			}
		});
	
	});

}))}));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJleHQvanF1ZXJ5Lm1DdXN0b21TY3JvbGxiYXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcbj09IG1hbGlodSBqcXVlcnkgY3VzdG9tIHNjcm9sbGJhciBwbHVnaW4gPT0gXG5WZXJzaW9uOiAzLjEuNSBcblBsdWdpbiBVUkk6IGh0dHA6Ly9tYW5vcy5tYWxpaHUuZ3IvanF1ZXJ5LWN1c3RvbS1jb250ZW50LXNjcm9sbGVyIFxuQXV0aG9yOiBtYWxpaHVcbkF1dGhvciBVUkk6IGh0dHA6Ly9tYW5vcy5tYWxpaHUuZ3JcbkxpY2Vuc2U6IE1JVCBMaWNlbnNlIChNSVQpXG4qL1xuXG4vKlxuQ29weXJpZ2h0IE1hbm9zIE1hbGlodXRzYWtpcyAoZW1haWw6IG1hbm9zQG1hbGlodS5ncilcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLlxuKi9cblxuLypcblRoZSBjb2RlIGJlbG93IGlzIGZhaXJseSBsb25nLCBmdWxseSBjb21tZW50ZWQgYW5kIHNob3VsZCBiZSBub3JtYWxseSB1c2VkIGluIGRldmVsb3BtZW50LiBcbkZvciBwcm9kdWN0aW9uLCB1c2UgZWl0aGVyIHRoZSBtaW5pZmllZCBqcXVlcnkubUN1c3RvbVNjcm9sbGJhci5taW4uanMgc2NyaXB0IG9yIFxudGhlIHByb2R1Y3Rpb24tcmVhZHkganF1ZXJ5Lm1DdXN0b21TY3JvbGxiYXIuY29uY2F0Lm1pbi5qcyB3aGljaCBjb250YWlucyB0aGUgcGx1Z2luIFxuYW5kIGRlcGVuZGVuY2llcyAobWluaWZpZWQpLiBcbiovXG5cbihmdW5jdGlvbihmYWN0b3J5KXtcblx0aWYodHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKXtcblx0XHRkZWZpbmUoW1wianF1ZXJ5XCJdLGZhY3RvcnkpO1xuXHR9ZWxzZSBpZih0eXBlb2YgbW9kdWxlIT09XCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cyl7XG5cdFx0bW9kdWxlLmV4cG9ydHM9ZmFjdG9yeTtcblx0fWVsc2V7XG5cdFx0ZmFjdG9yeShqUXVlcnksd2luZG93LGRvY3VtZW50KTtcblx0fVxufShmdW5jdGlvbigkKXtcbihmdW5jdGlvbihpbml0KXtcblx0dmFyIF9yanM9dHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kLCAvKiBSZXF1aXJlSlMgKi9cblx0XHRfbmpzPXR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMsIC8qIE5vZGVKUyAqL1xuXHRcdF9kbHA9KFwiaHR0cHM6XCI9PWRvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sKSA/IFwiaHR0cHM6XCIgOiBcImh0dHA6XCIsIC8qIGxvY2F0aW9uIHByb3RvY29sICovXG5cdFx0X3VybD1cImNkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9qcXVlcnktbW91c2V3aGVlbC8zLjEuMTMvanF1ZXJ5Lm1vdXNld2hlZWwubWluLmpzXCI7XG5cdGlmKCFfcmpzKXtcblx0XHRpZihfbmpzKXtcblx0XHRcdHJlcXVpcmUoXCJqcXVlcnktbW91c2V3aGVlbFwiKSgkKTtcblx0XHR9ZWxzZXtcblx0XHRcdC8qIGxvYWQganF1ZXJ5LW1vdXNld2hlZWwgcGx1Z2luICh2aWEgQ0ROKSBpZiBpdCdzIG5vdCBwcmVzZW50IG9yIG5vdCBsb2FkZWQgdmlhIFJlcXVpcmVKUyBcblx0XHRcdCh3b3JrcyB3aGVuIG1DdXN0b21TY3JvbGxiYXIgZm4gaXMgY2FsbGVkIG9uIHdpbmRvdyBsb2FkKSAqL1xuXHRcdFx0JC5ldmVudC5zcGVjaWFsLm1vdXNld2hlZWwgfHwgJChcImhlYWRcIikuYXBwZW5kKGRlY29kZVVSSShcIiUzQ3NjcmlwdCBzcmM9XCIrX2RscCtcIi8vXCIrX3VybCtcIiUzRSUzQy9zY3JpcHQlM0VcIikpO1xuXHRcdH1cblx0fVxuXHRpbml0KCk7XG59KGZ1bmN0aW9uKCl7XG5cdFxuXHQvKiBcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRQTFVHSU4gTkFNRVNQQUNFLCBQUkVGSVgsIERFRkFVTFQgU0VMRUNUT1IoUykgXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0Ki9cblx0XG5cdHZhciBwbHVnaW5OUz1cIm1DdXN0b21TY3JvbGxiYXJcIixcblx0XHRwbHVnaW5QZng9XCJtQ1NcIixcblx0XHRkZWZhdWx0U2VsZWN0b3I9XCIubUN1c3RvbVNjcm9sbGJhclwiLFxuXHRcblx0XG5cdFx0XG5cdFxuXHRcblx0LyogXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0REVGQVVMVCBPUFRJT05TIFxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdCovXG5cdFxuXHRcdGRlZmF1bHRzPXtcblx0XHRcdC8qXG5cdFx0XHRzZXQgZWxlbWVudC9jb250ZW50IHdpZHRoL2hlaWdodCBwcm9ncmFtbWF0aWNhbGx5IFxuXHRcdFx0dmFsdWVzOiBib29sZWFuLCBwaXhlbHMsIHBlcmNlbnRhZ2UgXG5cdFx0XHRcdG9wdGlvblx0XHRcdFx0XHRcdGRlZmF1bHRcblx0XHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0XHRzZXRXaWR0aFx0XHRcdFx0XHRmYWxzZVxuXHRcdFx0XHRzZXRIZWlnaHRcdFx0XHRcdFx0ZmFsc2Vcblx0XHRcdCovXG5cdFx0XHQvKlxuXHRcdFx0c2V0IHRoZSBpbml0aWFsIGNzcyB0b3AgcHJvcGVydHkgb2YgY29udGVudCAgXG5cdFx0XHR2YWx1ZXM6IHN0cmluZyAoZS5nLiBcIi0xMDBweFwiLCBcIjEwJVwiIGV0Yy4pXG5cdFx0XHQqL1xuXHRcdFx0c2V0VG9wOjAsXG5cdFx0XHQvKlxuXHRcdFx0c2V0IHRoZSBpbml0aWFsIGNzcyBsZWZ0IHByb3BlcnR5IG9mIGNvbnRlbnQgIFxuXHRcdFx0dmFsdWVzOiBzdHJpbmcgKGUuZy4gXCItMTAwcHhcIiwgXCIxMCVcIiBldGMuKVxuXHRcdFx0Ki9cblx0XHRcdHNldExlZnQ6MCxcblx0XHRcdC8qIFxuXHRcdFx0c2Nyb2xsYmFyIGF4aXMgKHZlcnRpY2FsIGFuZC9vciBob3Jpem9udGFsIHNjcm9sbGJhcnMpIFxuXHRcdFx0dmFsdWVzIChzdHJpbmcpOiBcInlcIiwgXCJ4XCIsIFwieXhcIlxuXHRcdFx0Ki9cblx0XHRcdGF4aXM6XCJ5XCIsXG5cdFx0XHQvKlxuXHRcdFx0cG9zaXRpb24gb2Ygc2Nyb2xsYmFyIHJlbGF0aXZlIHRvIGNvbnRlbnQgIFxuXHRcdFx0dmFsdWVzIChzdHJpbmcpOiBcImluc2lkZVwiLCBcIm91dHNpZGVcIiAoXCJvdXRzaWRlXCIgcmVxdWlyZXMgZWxlbWVudHMgd2l0aCBwb3NpdGlvbjpyZWxhdGl2ZSlcblx0XHRcdCovXG5cdFx0XHRzY3JvbGxiYXJQb3NpdGlvbjpcImluc2lkZVwiLFxuXHRcdFx0Lypcblx0XHRcdHNjcm9sbGluZyBpbmVydGlhXG5cdFx0XHR2YWx1ZXM6IGludGVnZXIgKG1pbGxpc2Vjb25kcylcblx0XHRcdCovXG5cdFx0XHRzY3JvbGxJbmVydGlhOjk1MCxcblx0XHRcdC8qIFxuXHRcdFx0YXV0by1hZGp1c3Qgc2Nyb2xsYmFyIGRyYWdnZXIgbGVuZ3RoXG5cdFx0XHR2YWx1ZXM6IGJvb2xlYW5cblx0XHRcdCovXG5cdFx0XHRhdXRvRHJhZ2dlckxlbmd0aDp0cnVlLFxuXHRcdFx0Lypcblx0XHRcdGF1dG8taGlkZSBzY3JvbGxiYXIgd2hlbiBpZGxlIFxuXHRcdFx0dmFsdWVzOiBib29sZWFuXG5cdFx0XHRcdG9wdGlvblx0XHRcdFx0XHRcdGRlZmF1bHRcblx0XHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0XHRhdXRvSGlkZVNjcm9sbGJhclx0XHRcdGZhbHNlXG5cdFx0XHQqL1xuXHRcdFx0Lypcblx0XHRcdGF1dG8tZXhwYW5kcyBzY3JvbGxiYXIgb24gbW91c2Utb3ZlciBhbmQgZHJhZ2dpbmdcblx0XHRcdHZhbHVlczogYm9vbGVhblxuXHRcdFx0XHRvcHRpb25cdFx0XHRcdFx0XHRkZWZhdWx0XG5cdFx0XHRcdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdFx0YXV0b0V4cGFuZFNjcm9sbGJhclx0XHRcdGZhbHNlXG5cdFx0XHQqL1xuXHRcdFx0Lypcblx0XHRcdGFsd2F5cyBzaG93IHNjcm9sbGJhciwgZXZlbiB3aGVuIHRoZXJlJ3Mgbm90aGluZyB0byBzY3JvbGwgXG5cdFx0XHR2YWx1ZXM6IGludGVnZXIgKDA9ZGlzYWJsZSwgMT1hbHdheXMgc2hvdyBkcmFnZ2VyIHJhaWwgYW5kIGJ1dHRvbnMsIDI9YWx3YXlzIHNob3cgZHJhZ2dlciByYWlsLCBkcmFnZ2VyIGFuZCBidXR0b25zKSwgYm9vbGVhblxuXHRcdFx0Ki9cblx0XHRcdGFsd2F5c1Nob3dTY3JvbGxiYXI6MCxcblx0XHRcdC8qXG5cdFx0XHRzY3JvbGxpbmcgYWx3YXlzIHNuYXBzIHRvIGEgbXVsdGlwbGUgb2YgdGhpcyBudW1iZXIgaW4gcGl4ZWxzXG5cdFx0XHR2YWx1ZXM6IGludGVnZXIsIGFycmF5IChbeSx4XSlcblx0XHRcdFx0b3B0aW9uXHRcdFx0XHRcdFx0ZGVmYXVsdFxuXHRcdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHRcdHNuYXBBbW91bnRcdFx0XHRcdFx0bnVsbFxuXHRcdFx0Ki9cblx0XHRcdC8qXG5cdFx0XHR3aGVuIHNuYXBwaW5nLCBzbmFwIHdpdGggdGhpcyBudW1iZXIgaW4gcGl4ZWxzIGFzIGFuIG9mZnNldCBcblx0XHRcdHZhbHVlczogaW50ZWdlclxuXHRcdFx0Ki9cblx0XHRcdHNuYXBPZmZzZXQ6MCxcblx0XHRcdC8qIFxuXHRcdFx0bW91c2Utd2hlZWwgc2Nyb2xsaW5nXG5cdFx0XHQqL1xuXHRcdFx0bW91c2VXaGVlbDp7XG5cdFx0XHRcdC8qIFxuXHRcdFx0XHRlbmFibGUgbW91c2Utd2hlZWwgc2Nyb2xsaW5nXG5cdFx0XHRcdHZhbHVlczogYm9vbGVhblxuXHRcdFx0XHQqL1xuXHRcdFx0XHRlbmFibGU6dHJ1ZSxcblx0XHRcdFx0LyogXG5cdFx0XHRcdHNjcm9sbGluZyBhbW91bnQgaW4gcGl4ZWxzXG5cdFx0XHRcdHZhbHVlczogXCJhdXRvXCIsIGludGVnZXIgXG5cdFx0XHRcdCovXG5cdFx0XHRcdHNjcm9sbEFtb3VudDpcImF1dG9cIixcblx0XHRcdFx0LyogXG5cdFx0XHRcdG1vdXNlLXdoZWVsIHNjcm9sbGluZyBheGlzIFxuXHRcdFx0XHR0aGUgZGVmYXVsdCBzY3JvbGxpbmcgZGlyZWN0aW9uIHdoZW4gYm90aCB2ZXJ0aWNhbCBhbmQgaG9yaXpvbnRhbCBzY3JvbGxiYXJzIGFyZSBwcmVzZW50IFxuXHRcdFx0XHR2YWx1ZXMgKHN0cmluZyk6IFwieVwiLCBcInhcIiBcblx0XHRcdFx0Ki9cblx0XHRcdFx0YXhpczpcInlcIixcblx0XHRcdFx0LyogXG5cdFx0XHRcdHByZXZlbnQgdGhlIGRlZmF1bHQgYmVoYXZpb3VyIHdoaWNoIGF1dG9tYXRpY2FsbHkgc2Nyb2xscyB0aGUgcGFyZW50IGVsZW1lbnQocykgd2hlbiBlbmQgb2Ygc2Nyb2xsaW5nIGlzIHJlYWNoZWQgXG5cdFx0XHRcdHZhbHVlczogYm9vbGVhblxuXHRcdFx0XHRcdG9wdGlvblx0XHRcdFx0XHRcdGRlZmF1bHRcblx0XHRcdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHRcdFx0cHJldmVudERlZmF1bHRcdFx0XHRcdG51bGxcblx0XHRcdFx0Ki9cblx0XHRcdFx0Lypcblx0XHRcdFx0dGhlIHJlcG9ydGVkIG1vdXNlLXdoZWVsIGRlbHRhIHZhbHVlLiBUaGUgbnVtYmVyIG9mIGxpbmVzICh0cmFuc2xhdGVkIHRvIHBpeGVscykgb25lIHdoZWVsIG5vdGNoIHNjcm9sbHMuICBcblx0XHRcdFx0dmFsdWVzOiBcImF1dG9cIiwgaW50ZWdlciBcblx0XHRcdFx0XCJhdXRvXCIgdXNlcyB0aGUgZGVmYXVsdCBPUy9icm93c2VyIHZhbHVlIFxuXHRcdFx0XHQqL1xuXHRcdFx0XHRkZWx0YUZhY3RvcjpcImF1dG9cIixcblx0XHRcdFx0Lypcblx0XHRcdFx0bm9ybWFsaXplIG1vdXNlLXdoZWVsIGRlbHRhIHRvIC0xIG9yIDEgKGRpc2FibGVzIG1vdXNlLXdoZWVsIGFjY2VsZXJhdGlvbikgXG5cdFx0XHRcdHZhbHVlczogYm9vbGVhblxuXHRcdFx0XHRcdG9wdGlvblx0XHRcdFx0XHRcdGRlZmF1bHRcblx0XHRcdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHRcdFx0bm9ybWFsaXplRGVsdGFcdFx0XHRcdG51bGxcblx0XHRcdFx0Ki9cblx0XHRcdFx0Lypcblx0XHRcdFx0aW52ZXJ0IG1vdXNlLXdoZWVsIHNjcm9sbGluZyBkaXJlY3Rpb24gXG5cdFx0XHRcdHZhbHVlczogYm9vbGVhblxuXHRcdFx0XHRcdG9wdGlvblx0XHRcdFx0XHRcdGRlZmF1bHRcblx0XHRcdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHRcdFx0aW52ZXJ0XHRcdFx0XHRcdFx0bnVsbFxuXHRcdFx0XHQqL1xuXHRcdFx0XHQvKlxuXHRcdFx0XHR0aGUgdGFncyB0aGF0IGRpc2FibGUgbW91c2Utd2hlZWwgd2hlbiBjdXJzb3IgaXMgb3ZlciB0aGVtXG5cdFx0XHRcdCovXG5cdFx0XHRcdGRpc2FibGVPdmVyOltcInNlbGVjdFwiLFwib3B0aW9uXCIsXCJrZXlnZW5cIixcImRhdGFsaXN0XCIsXCJ0ZXh0YXJlYVwiXVxuXHRcdFx0fSxcblx0XHRcdC8qIFxuXHRcdFx0c2Nyb2xsYmFyIGJ1dHRvbnNcblx0XHRcdCovXG5cdFx0XHRzY3JvbGxCdXR0b25zOnsgXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGVuYWJsZSBzY3JvbGxiYXIgYnV0dG9uc1xuXHRcdFx0XHR2YWx1ZXM6IGJvb2xlYW5cblx0XHRcdFx0XHRvcHRpb25cdFx0XHRcdFx0XHRkZWZhdWx0XG5cdFx0XHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0XHRcdGVuYWJsZVx0XHRcdFx0XHRcdG51bGxcblx0XHRcdFx0Ki9cblx0XHRcdFx0Lypcblx0XHRcdFx0c2Nyb2xsYmFyIGJ1dHRvbnMgc2Nyb2xsaW5nIHR5cGUgXG5cdFx0XHRcdHZhbHVlcyAoc3RyaW5nKTogXCJzdGVwbGVzc1wiLCBcInN0ZXBwZWRcIlxuXHRcdFx0XHQqL1xuXHRcdFx0XHRzY3JvbGxUeXBlOlwic3RlcGxlc3NcIixcblx0XHRcdFx0Lypcblx0XHRcdFx0c2Nyb2xsaW5nIGFtb3VudCBpbiBwaXhlbHNcblx0XHRcdFx0dmFsdWVzOiBcImF1dG9cIiwgaW50ZWdlciBcblx0XHRcdFx0Ki9cblx0XHRcdFx0c2Nyb2xsQW1vdW50OlwiYXV0b1wiXG5cdFx0XHRcdC8qXG5cdFx0XHRcdHRhYmluZGV4IG9mIHRoZSBzY3JvbGxiYXIgYnV0dG9uc1xuXHRcdFx0XHR2YWx1ZXM6IGZhbHNlLCBpbnRlZ2VyXG5cdFx0XHRcdFx0b3B0aW9uXHRcdFx0XHRcdFx0ZGVmYXVsdFxuXHRcdFx0XHRcdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdFx0XHR0YWJpbmRleFx0XHRcdFx0XHRudWxsXG5cdFx0XHRcdCovXG5cdFx0XHR9LFxuXHRcdFx0LyogXG5cdFx0XHRrZXlib2FyZCBzY3JvbGxpbmdcblx0XHRcdCovXG5cdFx0XHRrZXlib2FyZDp7IFxuXHRcdFx0XHQvKlxuXHRcdFx0XHRlbmFibGUgc2Nyb2xsaW5nIHZpYSBrZXlib2FyZFxuXHRcdFx0XHR2YWx1ZXM6IGJvb2xlYW5cblx0XHRcdFx0Ki9cblx0XHRcdFx0ZW5hYmxlOnRydWUsXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGtleWJvYXJkIHNjcm9sbGluZyB0eXBlIFxuXHRcdFx0XHR2YWx1ZXMgKHN0cmluZyk6IFwic3RlcGxlc3NcIiwgXCJzdGVwcGVkXCJcblx0XHRcdFx0Ki9cblx0XHRcdFx0c2Nyb2xsVHlwZTpcInN0ZXBsZXNzXCIsXG5cdFx0XHRcdC8qXG5cdFx0XHRcdHNjcm9sbGluZyBhbW91bnQgaW4gcGl4ZWxzXG5cdFx0XHRcdHZhbHVlczogXCJhdXRvXCIsIGludGVnZXIgXG5cdFx0XHRcdCovXG5cdFx0XHRcdHNjcm9sbEFtb3VudDpcImF1dG9cIlxuXHRcdFx0fSxcblx0XHRcdC8qXG5cdFx0XHRlbmFibGUgY29udGVudCB0b3VjaC1zd2lwZSBzY3JvbGxpbmcgXG5cdFx0XHR2YWx1ZXM6IGJvb2xlYW4sIGludGVnZXIsIHN0cmluZyAobnVtYmVyKVxuXHRcdFx0aW50ZWdlciB2YWx1ZXMgZGVmaW5lIHRoZSBheGlzLXNwZWNpZmljIG1pbmltdW0gYW1vdW50IHJlcXVpcmVkIGZvciBzY3JvbGxpbmcgbW9tZW50dW1cblx0XHRcdCovXG5cdFx0XHRjb250ZW50VG91Y2hTY3JvbGw6MjUsXG5cdFx0XHQvKlxuXHRcdFx0ZW5hYmxlL2Rpc2FibGUgZG9jdW1lbnQgKGRlZmF1bHQpIHRvdWNoLXN3aXBlIHNjcm9sbGluZyBcblx0XHRcdCovXG5cdFx0XHRkb2N1bWVudFRvdWNoU2Nyb2xsOnRydWUsXG5cdFx0XHQvKlxuXHRcdFx0YWR2YW5jZWQgb3B0aW9uIHBhcmFtZXRlcnNcblx0XHRcdCovXG5cdFx0XHRhZHZhbmNlZDp7XG5cdFx0XHRcdC8qXG5cdFx0XHRcdGF1dG8tZXhwYW5kIGNvbnRlbnQgaG9yaXpvbnRhbGx5IChmb3IgXCJ4XCIgb3IgXCJ5eFwiIGF4aXMpIFxuXHRcdFx0XHR2YWx1ZXM6IGJvb2xlYW4sIGludGVnZXIgKHRoZSB2YWx1ZSAyIGZvcmNlcyB0aGUgbm9uIHNjcm9sbEhlaWdodC9zY3JvbGxXaWR0aCBtZXRob2QsIHRoZSB2YWx1ZSAzIGZvcmNlcyB0aGUgc2Nyb2xsSGVpZ2h0L3Njcm9sbFdpZHRoIG1ldGhvZClcblx0XHRcdFx0XHRvcHRpb25cdFx0XHRcdFx0XHRkZWZhdWx0XG5cdFx0XHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0XHRcdGF1dG9FeHBhbmRIb3Jpem9udGFsU2Nyb2xsXHRudWxsXG5cdFx0XHRcdCovXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGF1dG8tc2Nyb2xsIHRvIGVsZW1lbnRzIHdpdGggZm9jdXNcblx0XHRcdFx0Ki9cblx0XHRcdFx0YXV0b1Njcm9sbE9uRm9jdXM6XCJpbnB1dCx0ZXh0YXJlYSxzZWxlY3QsYnV0dG9uLGRhdGFsaXN0LGtleWdlbixhW3RhYmluZGV4XSxhcmVhLG9iamVjdCxbY29udGVudGVkaXRhYmxlPSd0cnVlJ11cIixcblx0XHRcdFx0Lypcblx0XHRcdFx0YXV0by11cGRhdGUgc2Nyb2xsYmFycyBvbiBjb250ZW50LCBlbGVtZW50IG9yIHZpZXdwb3J0IHJlc2l6ZSBcblx0XHRcdFx0c2hvdWxkIGJlIHRydWUgZm9yIGZsdWlkIGxheW91dHMvZWxlbWVudHMsIGFkZGluZy9yZW1vdmluZyBjb250ZW50IGR5bmFtaWNhbGx5LCBoaWRpbmcvc2hvd2luZyBlbGVtZW50cywgY29udGVudCB3aXRoIGltYWdlcyBldGMuIFxuXHRcdFx0XHR2YWx1ZXM6IGJvb2xlYW5cblx0XHRcdFx0Ki9cblx0XHRcdFx0dXBkYXRlT25Db250ZW50UmVzaXplOnRydWUsXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGF1dG8tdXBkYXRlIHNjcm9sbGJhcnMgZWFjaCB0aW1lIGVhY2ggaW1hZ2UgaW5zaWRlIHRoZSBlbGVtZW50IGlzIGZ1bGx5IGxvYWRlZCBcblx0XHRcdFx0dmFsdWVzOiBcImF1dG9cIiwgYm9vbGVhblxuXHRcdFx0XHQqL1xuXHRcdFx0XHR1cGRhdGVPbkltYWdlTG9hZDpcImF1dG9cIixcblx0XHRcdFx0Lypcblx0XHRcdFx0YXV0by11cGRhdGUgc2Nyb2xsYmFycyBiYXNlZCBvbiB0aGUgYW1vdW50IGFuZCBzaXplIGNoYW5nZXMgb2Ygc3BlY2lmaWMgc2VsZWN0b3JzIFxuXHRcdFx0XHR1c2VmdWwgd2hlbiB5b3UgbmVlZCB0byB1cGRhdGUgdGhlIHNjcm9sbGJhcihzKSBhdXRvbWF0aWNhbGx5LCBlYWNoIHRpbWUgYSB0eXBlIG9mIGVsZW1lbnQgaXMgYWRkZWQsIHJlbW92ZWQgb3IgY2hhbmdlcyBpdHMgc2l6ZSBcblx0XHRcdFx0dmFsdWVzOiBib29sZWFuLCBzdHJpbmcgKGUuZy4gXCJ1bCBsaVwiIHdpbGwgYXV0by11cGRhdGUgc2Nyb2xsYmFycyBlYWNoIHRpbWUgbGlzdC1pdGVtcyBpbnNpZGUgdGhlIGVsZW1lbnQgYXJlIGNoYW5nZWQpIFxuXHRcdFx0XHRhIHZhbHVlIG9mIHRydWUgKGJvb2xlYW4pIHdpbGwgYXV0by11cGRhdGUgc2Nyb2xsYmFycyBlYWNoIHRpbWUgYW55IGVsZW1lbnQgaXMgY2hhbmdlZFxuXHRcdFx0XHRcdG9wdGlvblx0XHRcdFx0XHRcdGRlZmF1bHRcblx0XHRcdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHRcdFx0dXBkYXRlT25TZWxlY3RvckNoYW5nZVx0XHRudWxsXG5cdFx0XHRcdCovXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGV4dHJhIHNlbGVjdG9ycyB0aGF0J2xsIGFsbG93IHNjcm9sbGJhciBkcmFnZ2luZyB1cG9uIG1vdXNlbW92ZS91cCwgcG9pbnRlcm1vdmUvdXAsIHRvdWNoZW5kIGV0Yy4gKGUuZy4gXCJzZWxlY3Rvci0xLCBzZWxlY3Rvci0yXCIpXG5cdFx0XHRcdFx0b3B0aW9uXHRcdFx0XHRcdFx0ZGVmYXVsdFxuXHRcdFx0XHRcdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdFx0XHRleHRyYURyYWdnYWJsZVNlbGVjdG9yc1x0XHRudWxsXG5cdFx0XHRcdCovXG5cdFx0XHRcdC8qXG5cdFx0XHRcdGV4dHJhIHNlbGVjdG9ycyB0aGF0J2xsIHJlbGVhc2Ugc2Nyb2xsYmFyIGRyYWdnaW5nIHVwb24gbW91c2V1cCwgcG9pbnRlcnVwLCB0b3VjaGVuZCBldGMuIChlLmcuIFwic2VsZWN0b3ItMSwgc2VsZWN0b3ItMlwiKVxuXHRcdFx0XHRcdG9wdGlvblx0XHRcdFx0XHRcdGRlZmF1bHRcblx0XHRcdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHRcdFx0cmVsZWFzZURyYWdnYWJsZVNlbGVjdG9yc1x0bnVsbFxuXHRcdFx0XHQqL1xuXHRcdFx0XHQvKlxuXHRcdFx0XHRhdXRvLXVwZGF0ZSB0aW1lb3V0IFxuXHRcdFx0XHR2YWx1ZXM6IGludGVnZXIgKG1pbGxpc2Vjb25kcylcblx0XHRcdFx0Ki9cblx0XHRcdFx0YXV0b1VwZGF0ZVRpbWVvdXQ6NjBcblx0XHRcdH0sXG5cdFx0XHQvKiBcblx0XHRcdHNjcm9sbGJhciB0aGVtZSBcblx0XHRcdHZhbHVlczogc3RyaW5nIChzZWUgQ1NTL3BsdWdpbiBVUkkgZm9yIGEgbGlzdCBvZiByZWFkeS10by11c2UgdGhlbWVzKVxuXHRcdFx0Ki9cblx0XHRcdHRoZW1lOlwibGlnaHRcIixcblx0XHRcdC8qXG5cdFx0XHR1c2VyIGRlZmluZWQgY2FsbGJhY2sgZnVuY3Rpb25zXG5cdFx0XHQqL1xuXHRcdFx0Y2FsbGJhY2tzOntcblx0XHRcdFx0Lypcblx0XHRcdFx0QXZhaWxhYmxlIGNhbGxiYWNrczogXG5cdFx0XHRcdFx0Y2FsbGJhY2tcdFx0XHRcdFx0ZGVmYXVsdFxuXHRcdFx0XHRcdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdFx0XHRvbkNyZWF0ZVx0XHRcdFx0XHRudWxsXG5cdFx0XHRcdFx0b25Jbml0XHRcdFx0XHRcdFx0bnVsbFxuXHRcdFx0XHRcdG9uU2Nyb2xsU3RhcnRcdFx0XHRcdG51bGxcblx0XHRcdFx0XHRvblNjcm9sbFx0XHRcdFx0XHRudWxsXG5cdFx0XHRcdFx0b25Ub3RhbFNjcm9sbFx0XHRcdFx0bnVsbFxuXHRcdFx0XHRcdG9uVG90YWxTY3JvbGxCYWNrXHRcdFx0bnVsbFxuXHRcdFx0XHRcdHdoaWxlU2Nyb2xsaW5nXHRcdFx0XHRudWxsXG5cdFx0XHRcdFx0b25PdmVyZmxvd1lcdFx0XHRcdFx0bnVsbFxuXHRcdFx0XHRcdG9uT3ZlcmZsb3dYXHRcdFx0XHRcdG51bGxcblx0XHRcdFx0XHRvbk92ZXJmbG93WU5vbmVcdFx0XHRcdG51bGxcblx0XHRcdFx0XHRvbk92ZXJmbG93WE5vbmVcdFx0XHRcdG51bGxcblx0XHRcdFx0XHRvbkltYWdlTG9hZFx0XHRcdFx0XHRudWxsXG5cdFx0XHRcdFx0b25TZWxlY3RvckNoYW5nZVx0XHRcdG51bGxcblx0XHRcdFx0XHRvbkJlZm9yZVVwZGF0ZVx0XHRcdFx0bnVsbFxuXHRcdFx0XHRcdG9uVXBkYXRlXHRcdFx0XHRcdG51bGxcblx0XHRcdFx0Ki9cblx0XHRcdFx0b25Ub3RhbFNjcm9sbE9mZnNldDowLFxuXHRcdFx0XHRvblRvdGFsU2Nyb2xsQmFja09mZnNldDowLFxuXHRcdFx0XHRhbHdheXNUcmlnZ2VyT2Zmc2V0czp0cnVlXG5cdFx0XHR9XG5cdFx0XHQvKlxuXHRcdFx0YWRkIHNjcm9sbGJhcihzKSBvbiBhbGwgZWxlbWVudHMgbWF0Y2hpbmcgdGhlIGN1cnJlbnQgc2VsZWN0b3IsIG5vdyBhbmQgaW4gdGhlIGZ1dHVyZSBcblx0XHRcdHZhbHVlczogYm9vbGVhbiwgc3RyaW5nIFxuXHRcdFx0c3RyaW5nIHZhbHVlczogXCJvblwiIChlbmFibGUpLCBcIm9uY2VcIiAoZGlzYWJsZSBhZnRlciBmaXJzdCBpbnZvY2F0aW9uKSwgXCJvZmZcIiAoZGlzYWJsZSlcblx0XHRcdGxpdmVTZWxlY3RvciB2YWx1ZXM6IHN0cmluZyAoc2VsZWN0b3IpXG5cdFx0XHRcdG9wdGlvblx0XHRcdFx0XHRcdGRlZmF1bHRcblx0XHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0XHRsaXZlXHRcdFx0XHRcdFx0ZmFsc2Vcblx0XHRcdFx0bGl2ZVNlbGVjdG9yXHRcdFx0XHRudWxsXG5cdFx0XHQqL1xuXHRcdH0sXG5cdFxuXHRcblx0XG5cdFxuXHRcblx0LyogXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0VkFSUywgQ09OU1RBTlRTIFxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdCovXG5cdFxuXHRcdHRvdGFsSW5zdGFuY2VzPTAsIC8qIHBsdWdpbiBpbnN0YW5jZXMgYW1vdW50ICovXG5cdFx0bGl2ZVRpbWVycz17fSwgLyogbGl2ZSBvcHRpb24gdGltZXJzICovXG5cdFx0b2xkSUU9KHdpbmRvdy5hdHRhY2hFdmVudCAmJiAhd2luZG93LmFkZEV2ZW50TGlzdGVuZXIpID8gMSA6IDAsIC8qIGRldGVjdCBJRSA8IDkgKi9cblx0XHR0b3VjaEFjdGl2ZT1mYWxzZSx0b3VjaGFibGUsIC8qIGdsb2JhbCB0b3VjaCB2YXJzIChmb3IgdG91Y2ggYW5kIHBvaW50ZXIgZXZlbnRzKSAqL1xuXHRcdC8qIGdlbmVyYWwgcGx1Z2luIGNsYXNzZXMgKi9cblx0XHRjbGFzc2VzPVtcblx0XHRcdFwibUNTQl9kcmFnZ2VyX29uRHJhZ1wiLFwibUNTQl9zY3JvbGxUb29sc19vbkRyYWdcIixcIm1DU19pbWdfbG9hZGVkXCIsXCJtQ1NfZGlzYWJsZWRcIixcIm1DU19kZXN0cm95ZWRcIixcIm1DU19ub19zY3JvbGxiYXJcIixcblx0XHRcdFwibUNTLWF1dG9IaWRlXCIsXCJtQ1MtZGlyLXJ0bFwiLFwibUNTX25vX3Njcm9sbGJhcl95XCIsXCJtQ1Nfbm9fc2Nyb2xsYmFyX3hcIixcIm1DU195X2hpZGRlblwiLFwibUNTX3hfaGlkZGVuXCIsXCJtQ1NCX2RyYWdnZXJDb250YWluZXJcIixcblx0XHRcdFwibUNTQl9idXR0b25VcFwiLFwibUNTQl9idXR0b25Eb3duXCIsXCJtQ1NCX2J1dHRvbkxlZnRcIixcIm1DU0JfYnV0dG9uUmlnaHRcIlxuXHRcdF0sXG5cdFx0XG5cdFxuXHRcblx0XG5cdFxuXHQvKiBcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRNRVRIT0RTIFxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdCovXG5cdFxuXHRcdG1ldGhvZHM9e1xuXHRcdFx0XG5cdFx0XHQvKiBcblx0XHRcdHBsdWdpbiBpbml0aWFsaXphdGlvbiBtZXRob2QgXG5cdFx0XHRjcmVhdGVzIHRoZSBzY3JvbGxiYXIocyksIHBsdWdpbiBkYXRhIG9iamVjdCBhbmQgb3B0aW9uc1xuXHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0Ki9cblx0XHRcdFxuXHRcdFx0aW5pdDpmdW5jdGlvbihvcHRpb25zKXtcblx0XHRcdFx0XG5cdFx0XHRcdHZhciBvcHRpb25zPSQuZXh0ZW5kKHRydWUse30sZGVmYXVsdHMsb3B0aW9ucyksXG5cdFx0XHRcdFx0c2VsZWN0b3I9X3NlbGVjdG9yLmNhbGwodGhpcyk7IC8qIHZhbGlkYXRlIHNlbGVjdG9yICovXG5cdFx0XHRcdFxuXHRcdFx0XHQvKiBcblx0XHRcdFx0aWYgbGl2ZSBvcHRpb24gaXMgZW5hYmxlZCwgbW9uaXRvciBmb3IgZWxlbWVudHMgbWF0Y2hpbmcgdGhlIGN1cnJlbnQgc2VsZWN0b3IgYW5kIFxuXHRcdFx0XHRhcHBseSBzY3JvbGxiYXIocykgd2hlbiBmb3VuZCAobm93IGFuZCBpbiB0aGUgZnV0dXJlKSBcblx0XHRcdFx0Ki9cblx0XHRcdFx0aWYob3B0aW9ucy5saXZlKXtcblx0XHRcdFx0XHR2YXIgbGl2ZVNlbGVjdG9yPW9wdGlvbnMubGl2ZVNlbGVjdG9yIHx8IHRoaXMuc2VsZWN0b3IgfHwgZGVmYXVsdFNlbGVjdG9yLCAvKiBsaXZlIHNlbGVjdG9yKHMpICovXG5cdFx0XHRcdFx0XHQkbGl2ZVNlbGVjdG9yPSQobGl2ZVNlbGVjdG9yKTsgLyogbGl2ZSBzZWxlY3RvcihzKSBhcyBqcXVlcnkgb2JqZWN0ICovXG5cdFx0XHRcdFx0aWYob3B0aW9ucy5saXZlPT09XCJvZmZcIil7XG5cdFx0XHRcdFx0XHQvKiBcblx0XHRcdFx0XHRcdGRpc2FibGUgbGl2ZSBpZiByZXF1ZXN0ZWQgXG5cdFx0XHRcdFx0XHR1c2FnZTogJChzZWxlY3RvcikubUN1c3RvbVNjcm9sbGJhcih7bGl2ZTpcIm9mZlwifSk7IFxuXHRcdFx0XHRcdFx0Ki9cblx0XHRcdFx0XHRcdHJlbW92ZUxpdmVUaW1lcnMobGl2ZVNlbGVjdG9yKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bGl2ZVRpbWVyc1tsaXZlU2VsZWN0b3JdPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdC8qIGNhbGwgbUN1c3RvbVNjcm9sbGJhciBmbiBvbiBsaXZlIHNlbGVjdG9yKHMpIGV2ZXJ5IGhhbGYtc2Vjb25kICovXG5cdFx0XHRcdFx0XHQkbGl2ZVNlbGVjdG9yLm1DdXN0b21TY3JvbGxiYXIob3B0aW9ucyk7XG5cdFx0XHRcdFx0XHRpZihvcHRpb25zLmxpdmU9PT1cIm9uY2VcIiAmJiAkbGl2ZVNlbGVjdG9yLmxlbmd0aCl7XG5cdFx0XHRcdFx0XHRcdC8qIGRpc2FibGUgbGl2ZSBhZnRlciBmaXJzdCBpbnZvY2F0aW9uICovXG5cdFx0XHRcdFx0XHRcdHJlbW92ZUxpdmVUaW1lcnMobGl2ZVNlbGVjdG9yKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LDUwMCk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHJlbW92ZUxpdmVUaW1lcnMobGl2ZVNlbGVjdG9yKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0Lyogb3B0aW9ucyBiYWNrd2FyZCBjb21wYXRpYmlsaXR5IChmb3IgdmVyc2lvbnMgPCAzLjAuMCkgYW5kIG5vcm1hbGl6YXRpb24gKi9cblx0XHRcdFx0b3B0aW9ucy5zZXRXaWR0aD0ob3B0aW9ucy5zZXRfd2lkdGgpID8gb3B0aW9ucy5zZXRfd2lkdGggOiBvcHRpb25zLnNldFdpZHRoO1xuXHRcdFx0XHRvcHRpb25zLnNldEhlaWdodD0ob3B0aW9ucy5zZXRfaGVpZ2h0KSA/IG9wdGlvbnMuc2V0X2hlaWdodCA6IG9wdGlvbnMuc2V0SGVpZ2h0O1xuXHRcdFx0XHRvcHRpb25zLmF4aXM9KG9wdGlvbnMuaG9yaXpvbnRhbFNjcm9sbCkgPyBcInhcIiA6IF9maW5kQXhpcyhvcHRpb25zLmF4aXMpO1xuXHRcdFx0XHRvcHRpb25zLnNjcm9sbEluZXJ0aWE9b3B0aW9ucy5zY3JvbGxJbmVydGlhPjAgJiYgb3B0aW9ucy5zY3JvbGxJbmVydGlhPDE3ID8gMTcgOiBvcHRpb25zLnNjcm9sbEluZXJ0aWE7XG5cdFx0XHRcdGlmKHR5cGVvZiBvcHRpb25zLm1vdXNlV2hlZWwhPT1cIm9iamVjdFwiICYmICBvcHRpb25zLm1vdXNlV2hlZWw9PXRydWUpeyAvKiBvbGQgc2Nob29sIG1vdXNlV2hlZWwgb3B0aW9uIChub24tb2JqZWN0KSAqL1xuXHRcdFx0XHRcdG9wdGlvbnMubW91c2VXaGVlbD17ZW5hYmxlOnRydWUsc2Nyb2xsQW1vdW50OlwiYXV0b1wiLGF4aXM6XCJ5XCIscHJldmVudERlZmF1bHQ6ZmFsc2UsZGVsdGFGYWN0b3I6XCJhdXRvXCIsbm9ybWFsaXplRGVsdGE6ZmFsc2UsaW52ZXJ0OmZhbHNlfVxuXHRcdFx0XHR9XG5cdFx0XHRcdG9wdGlvbnMubW91c2VXaGVlbC5zY3JvbGxBbW91bnQ9IW9wdGlvbnMubW91c2VXaGVlbFBpeGVscyA/IG9wdGlvbnMubW91c2VXaGVlbC5zY3JvbGxBbW91bnQgOiBvcHRpb25zLm1vdXNlV2hlZWxQaXhlbHM7XG5cdFx0XHRcdG9wdGlvbnMubW91c2VXaGVlbC5ub3JtYWxpemVEZWx0YT0hb3B0aW9ucy5hZHZhbmNlZC5ub3JtYWxpemVNb3VzZVdoZWVsRGVsdGEgPyBvcHRpb25zLm1vdXNlV2hlZWwubm9ybWFsaXplRGVsdGEgOiBvcHRpb25zLmFkdmFuY2VkLm5vcm1hbGl6ZU1vdXNlV2hlZWxEZWx0YTtcblx0XHRcdFx0b3B0aW9ucy5zY3JvbGxCdXR0b25zLnNjcm9sbFR5cGU9X2ZpbmRTY3JvbGxCdXR0b25zVHlwZShvcHRpb25zLnNjcm9sbEJ1dHRvbnMuc2Nyb2xsVHlwZSk7IFxuXHRcdFx0XHRcblx0XHRcdFx0X3RoZW1lKG9wdGlvbnMpOyAvKiB0aGVtZS1zcGVjaWZpYyBvcHRpb25zICovXG5cdFx0XHRcdFxuXHRcdFx0XHQvKiBwbHVnaW4gY29uc3RydWN0b3IgKi9cblx0XHRcdFx0cmV0dXJuICQoc2VsZWN0b3IpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR2YXIgJHRoaXM9JCh0aGlzKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZighJHRoaXMuZGF0YShwbHVnaW5QZngpKXsgLyogcHJldmVudCBtdWx0aXBsZSBpbnN0YW50aWF0aW9ucyAqL1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0Lyogc3RvcmUgb3B0aW9ucyBhbmQgY3JlYXRlIG9iamVjdHMgaW4ganF1ZXJ5IGRhdGEgKi9cblx0XHRcdFx0XHRcdCR0aGlzLmRhdGEocGx1Z2luUGZ4LHtcblx0XHRcdFx0XHRcdFx0aWR4OisrdG90YWxJbnN0YW5jZXMsIC8qIGluc3RhbmNlIGluZGV4ICovXG5cdFx0XHRcdFx0XHRcdG9wdDpvcHRpb25zLCAvKiBvcHRpb25zICovXG5cdFx0XHRcdFx0XHRcdHNjcm9sbFJhdGlvOnt5Om51bGwseDpudWxsfSwgLyogc2Nyb2xsYmFyIHRvIGNvbnRlbnQgcmF0aW8gKi9cblx0XHRcdFx0XHRcdFx0b3ZlcmZsb3dlZDpudWxsLCAvKiBvdmVyZmxvd2VkIGF4aXMgKi9cblx0XHRcdFx0XHRcdFx0Y29udGVudFJlc2V0Ont5Om51bGwseDpudWxsfSwgLyogb2JqZWN0IHRvIGNoZWNrIHdoZW4gY29udGVudCByZXNldHMgKi9cblx0XHRcdFx0XHRcdFx0YmluZEV2ZW50czpmYWxzZSwgLyogb2JqZWN0IHRvIGNoZWNrIGlmIGV2ZW50cyBhcmUgYm91bmQgKi9cblx0XHRcdFx0XHRcdFx0dHdlZW5SdW5uaW5nOmZhbHNlLCAvKiBvYmplY3QgdG8gY2hlY2sgaWYgdHdlZW4gaXMgcnVubmluZyAqL1xuXHRcdFx0XHRcdFx0XHRzZXF1ZW50aWFsOnt9LCAvKiBzZXF1ZW50aWFsIHNjcm9sbGluZyBvYmplY3QgKi9cblx0XHRcdFx0XHRcdFx0bGFuZ0RpcjokdGhpcy5jc3MoXCJkaXJlY3Rpb25cIiksIC8qIGRldGVjdC9zdG9yZSBkaXJlY3Rpb24gKGx0ciBvciBydGwpICovXG5cdFx0XHRcdFx0XHRcdGNiT2Zmc2V0czpudWxsLCAvKiBvYmplY3QgdG8gY2hlY2sgd2hldGhlciBjYWxsYmFjayBvZmZzZXRzIGFsd2F5cyB0cmlnZ2VyICovXG5cdFx0XHRcdFx0XHRcdC8qIFxuXHRcdFx0XHRcdFx0XHRvYmplY3QgdG8gY2hlY2sgaG93IHNjcm9sbGluZyBldmVudHMgd2hlcmUgbGFzdCB0cmlnZ2VyZWQgXG5cdFx0XHRcdFx0XHRcdFwiaW50ZXJuYWxcIiAoZGVmYXVsdCAtIHRyaWdnZXJlZCBieSB0aGlzIHNjcmlwdCksIFwiZXh0ZXJuYWxcIiAodHJpZ2dlcmVkIGJ5IG90aGVyIHNjcmlwdHMsIGUuZy4gdmlhIHNjcm9sbFRvIG1ldGhvZCkgXG5cdFx0XHRcdFx0XHRcdHVzYWdlOiBvYmplY3QuZGF0YShcIm1DU1wiKS50cmlnZ2VyXG5cdFx0XHRcdFx0XHRcdCovXG5cdFx0XHRcdFx0XHRcdHRyaWdnZXI6bnVsbCxcblx0XHRcdFx0XHRcdFx0LyogXG5cdFx0XHRcdFx0XHRcdG9iamVjdCB0byBjaGVjayBmb3IgY2hhbmdlcyBpbiBlbGVtZW50cyBpbiBvcmRlciB0byBjYWxsIHRoZSB1cGRhdGUgbWV0aG9kIGF1dG9tYXRpY2FsbHkgXG5cdFx0XHRcdFx0XHRcdCovXG5cdFx0XHRcdFx0XHRcdHBvbGw6e3NpemU6e286MCxuOjB9LGltZzp7bzowLG46MH0sY2hhbmdlOntvOjAsbjowfX1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHR2YXIgZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcblx0XHRcdFx0XHRcdFx0LyogSFRNTCBkYXRhIGF0dHJpYnV0ZXMgKi9cblx0XHRcdFx0XHRcdFx0aHRtbERhdGFBeGlzPSR0aGlzLmRhdGEoXCJtY3MtYXhpc1wiKSxodG1sRGF0YVNiUG9zPSR0aGlzLmRhdGEoXCJtY3Mtc2Nyb2xsYmFyLXBvc2l0aW9uXCIpLGh0bWxEYXRhVGhlbWU9JHRoaXMuZGF0YShcIm1jcy10aGVtZVwiKTtcblx0XHRcdFx0XHRcdCBcblx0XHRcdFx0XHRcdGlmKGh0bWxEYXRhQXhpcyl7by5heGlzPWh0bWxEYXRhQXhpczt9IC8qIHVzYWdlIGV4YW1wbGU6IGRhdGEtbWNzLWF4aXM9XCJ5XCIgKi9cblx0XHRcdFx0XHRcdGlmKGh0bWxEYXRhU2JQb3Mpe28uc2Nyb2xsYmFyUG9zaXRpb249aHRtbERhdGFTYlBvczt9IC8qIHVzYWdlIGV4YW1wbGU6IGRhdGEtbWNzLXNjcm9sbGJhci1wb3NpdGlvbj1cIm91dHNpZGVcIiAqL1xuXHRcdFx0XHRcdFx0aWYoaHRtbERhdGFUaGVtZSl7IC8qIHVzYWdlIGV4YW1wbGU6IGRhdGEtbWNzLXRoZW1lPVwibWluaW1hbFwiICovXG5cdFx0XHRcdFx0XHRcdG8udGhlbWU9aHRtbERhdGFUaGVtZTtcblx0XHRcdFx0XHRcdFx0X3RoZW1lKG8pOyAvKiB0aGVtZS1zcGVjaWZpYyBvcHRpb25zICovXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdF9wbHVnaW5NYXJrdXAuY2FsbCh0aGlzKTsgLyogYWRkIHBsdWdpbiBtYXJrdXAgKi9cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYoZCAmJiBvLmNhbGxiYWNrcy5vbkNyZWF0ZSAmJiB0eXBlb2Ygby5jYWxsYmFja3Mub25DcmVhdGU9PT1cImZ1bmN0aW9uXCIpe28uY2FsbGJhY2tzLm9uQ3JlYXRlLmNhbGwodGhpcyk7fSAvKiBjYWxsYmFja3M6IG9uQ3JlYXRlICovXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdCQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXIgaW1nOm5vdCguXCIrY2xhc3Nlc1syXStcIilcIikuYWRkQ2xhc3MoY2xhc3Nlc1syXSk7IC8qIGZsYWcgbG9hZGVkIGltYWdlcyAqL1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRtZXRob2RzLnVwZGF0ZS5jYWxsKG51bGwsJHRoaXMpOyAvKiBjYWxsIHRoZSB1cGRhdGUgbWV0aG9kICovXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFxuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHR9LFxuXHRcdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFx0XG5cdFx0XHRcblx0XHRcdFxuXHRcdFx0LyogXG5cdFx0XHRwbHVnaW4gdXBkYXRlIG1ldGhvZCBcblx0XHRcdHVwZGF0ZXMgY29udGVudCBhbmQgc2Nyb2xsYmFyKHMpIHZhbHVlcywgZXZlbnRzIGFuZCBzdGF0dXMgXG5cdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHR1c2FnZTogJChzZWxlY3RvcikubUN1c3RvbVNjcm9sbGJhcihcInVwZGF0ZVwiKTtcblx0XHRcdCovXG5cdFx0XHRcblx0XHRcdHVwZGF0ZTpmdW5jdGlvbihlbCxjYil7XG5cdFx0XHRcdFxuXHRcdFx0XHR2YXIgc2VsZWN0b3I9ZWwgfHwgX3NlbGVjdG9yLmNhbGwodGhpcyk7IC8qIHZhbGlkYXRlIHNlbGVjdG9yICovXG5cdFx0XHRcdFxuXHRcdFx0XHRyZXR1cm4gJChzZWxlY3RvcikuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHZhciAkdGhpcz0kKHRoaXMpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmKCR0aGlzLmRhdGEocGx1Z2luUGZ4KSl7IC8qIGNoZWNrIGlmIHBsdWdpbiBoYXMgaW5pdGlhbGl6ZWQgKi9cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0dmFyIGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXG5cdFx0XHRcdFx0XHRcdG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIiksXG5cdFx0XHRcdFx0XHRcdG1DdXN0b21TY3JvbGxCb3g9JChcIiNtQ1NCX1wiK2QuaWR4KSxcblx0XHRcdFx0XHRcdFx0bUNTQl9kcmFnZ2VyPVskKFwiI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl92ZXJ0aWNhbFwiKSwkKFwiI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl9ob3Jpem9udGFsXCIpXTtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYoIW1DU0JfY29udGFpbmVyLmxlbmd0aCl7cmV0dXJuO31cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYoZC50d2VlblJ1bm5pbmcpe19zdG9wKCR0aGlzKTt9IC8qIHN0b3AgYW55IHJ1bm5pbmcgdHdlZW5zIHdoaWxlIHVwZGF0aW5nICovXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGlmKGNiICYmIGQgJiYgby5jYWxsYmFja3Mub25CZWZvcmVVcGRhdGUgJiYgdHlwZW9mIG8uY2FsbGJhY2tzLm9uQmVmb3JlVXBkYXRlPT09XCJmdW5jdGlvblwiKXtvLmNhbGxiYWNrcy5vbkJlZm9yZVVwZGF0ZS5jYWxsKHRoaXMpO30gLyogY2FsbGJhY2tzOiBvbkJlZm9yZVVwZGF0ZSAqL1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQvKiBpZiBlbGVtZW50IHdhcyBkaXNhYmxlZCBvciBkZXN0cm95ZWQsIHJlbW92ZSBjbGFzcyhlcykgKi9cblx0XHRcdFx0XHRcdGlmKCR0aGlzLmhhc0NsYXNzKGNsYXNzZXNbM10pKXskdGhpcy5yZW1vdmVDbGFzcyhjbGFzc2VzWzNdKTt9XG5cdFx0XHRcdFx0XHRpZigkdGhpcy5oYXNDbGFzcyhjbGFzc2VzWzRdKSl7JHRoaXMucmVtb3ZlQ2xhc3MoY2xhc3Nlc1s0XSk7fVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQvKiBjc3MgZmxleGJveCBmaXgsIGRldGVjdC9zZXQgbWF4LWhlaWdodCAqL1xuXHRcdFx0XHRcdFx0bUN1c3RvbVNjcm9sbEJveC5jc3MoXCJtYXgtaGVpZ2h0XCIsXCJub25lXCIpO1xuXHRcdFx0XHRcdFx0aWYobUN1c3RvbVNjcm9sbEJveC5oZWlnaHQoKSE9PSR0aGlzLmhlaWdodCgpKXttQ3VzdG9tU2Nyb2xsQm94LmNzcyhcIm1heC1oZWlnaHRcIiwkdGhpcy5oZWlnaHQoKSk7fVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRfZXhwYW5kQ29udGVudEhvcml6b250YWxseS5jYWxsKHRoaXMpOyAvKiBleHBhbmQgY29udGVudCBob3Jpem9udGFsbHkgKi9cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYoby5heGlzIT09XCJ5XCIgJiYgIW8uYWR2YW5jZWQuYXV0b0V4cGFuZEhvcml6b250YWxTY3JvbGwpe1xuXHRcdFx0XHRcdFx0XHRtQ1NCX2NvbnRhaW5lci5jc3MoXCJ3aWR0aFwiLF9jb250ZW50V2lkdGgobUNTQl9jb250YWluZXIpKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0ZC5vdmVyZmxvd2VkPV9vdmVyZmxvd2VkLmNhbGwodGhpcyk7IC8qIGRldGVybWluZSBpZiBzY3JvbGxpbmcgaXMgcmVxdWlyZWQgKi9cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0X3Njcm9sbGJhclZpc2liaWxpdHkuY2FsbCh0aGlzKTsgLyogc2hvdy9oaWRlIHNjcm9sbGJhcihzKSAqL1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQvKiBhdXRvLWFkanVzdCBzY3JvbGxiYXIgZHJhZ2dlciBsZW5ndGggYW5hbG9nb3VzIHRvIGNvbnRlbnQgKi9cblx0XHRcdFx0XHRcdGlmKG8uYXV0b0RyYWdnZXJMZW5ndGgpe19zZXREcmFnZ2VyTGVuZ3RoLmNhbGwodGhpcyk7fVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRfc2Nyb2xsUmF0aW8uY2FsbCh0aGlzKTsgLyogY2FsY3VsYXRlIGFuZCBzdG9yZSBzY3JvbGxiYXIgdG8gY29udGVudCByYXRpbyAqL1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRfYmluZEV2ZW50cy5jYWxsKHRoaXMpOyAvKiBiaW5kIHNjcm9sbGJhciBldmVudHMgKi9cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0LyogcmVzZXQgc2Nyb2xsaW5nIHBvc2l0aW9uIGFuZC9vciBldmVudHMgKi9cblx0XHRcdFx0XHRcdHZhciB0bz1bTWF0aC5hYnMobUNTQl9jb250YWluZXJbMF0ub2Zmc2V0VG9wKSxNYXRoLmFicyhtQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRMZWZ0KV07XG5cdFx0XHRcdFx0XHRpZihvLmF4aXMhPT1cInhcIil7IC8qIHkveXggYXhpcyAqL1xuXHRcdFx0XHRcdFx0XHRpZighZC5vdmVyZmxvd2VkWzBdKXsgLyogeSBzY3JvbGxpbmcgaXMgbm90IHJlcXVpcmVkICovXG5cdFx0XHRcdFx0XHRcdFx0X3Jlc2V0Q29udGVudFBvc2l0aW9uLmNhbGwodGhpcyk7IC8qIHJlc2V0IGNvbnRlbnQgcG9zaXRpb24gKi9cblx0XHRcdFx0XHRcdFx0XHRpZihvLmF4aXM9PT1cInlcIil7XG5cdFx0XHRcdFx0XHRcdFx0XHRfdW5iaW5kRXZlbnRzLmNhbGwodGhpcyk7XG5cdFx0XHRcdFx0XHRcdFx0fWVsc2UgaWYoby5heGlzPT09XCJ5eFwiICYmIGQub3ZlcmZsb3dlZFsxXSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRfc2Nyb2xsVG8oJHRoaXMsdG9bMV0udG9TdHJpbmcoKSx7ZGlyOlwieFwiLGR1cjowLG92ZXJ3cml0ZTpcIm5vbmVcIn0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fWVsc2UgaWYobUNTQl9kcmFnZ2VyWzBdLmhlaWdodCgpPm1DU0JfZHJhZ2dlclswXS5wYXJlbnQoKS5oZWlnaHQoKSl7XG5cdFx0XHRcdFx0XHRcdFx0X3Jlc2V0Q29udGVudFBvc2l0aW9uLmNhbGwodGhpcyk7IC8qIHJlc2V0IGNvbnRlbnQgcG9zaXRpb24gKi9cblx0XHRcdFx0XHRcdFx0fWVsc2V7IC8qIHkgc2Nyb2xsaW5nIGlzIHJlcXVpcmVkICovXG5cdFx0XHRcdFx0XHRcdFx0X3Njcm9sbFRvKCR0aGlzLHRvWzBdLnRvU3RyaW5nKCkse2RpcjpcInlcIixkdXI6MCxvdmVyd3JpdGU6XCJub25lXCJ9KTtcblx0XHRcdFx0XHRcdFx0XHRkLmNvbnRlbnRSZXNldC55PW51bGw7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGlmKG8uYXhpcyE9PVwieVwiKXsgLyogeC95eCBheGlzICovXG5cdFx0XHRcdFx0XHRcdGlmKCFkLm92ZXJmbG93ZWRbMV0peyAvKiB4IHNjcm9sbGluZyBpcyBub3QgcmVxdWlyZWQgKi9cblx0XHRcdFx0XHRcdFx0XHRfcmVzZXRDb250ZW50UG9zaXRpb24uY2FsbCh0aGlzKTsgLyogcmVzZXQgY29udGVudCBwb3NpdGlvbiAqL1xuXHRcdFx0XHRcdFx0XHRcdGlmKG8uYXhpcz09PVwieFwiKXtcblx0XHRcdFx0XHRcdFx0XHRcdF91bmJpbmRFdmVudHMuY2FsbCh0aGlzKTtcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZSBpZihvLmF4aXM9PT1cInl4XCIgJiYgZC5vdmVyZmxvd2VkWzBdKXtcblx0XHRcdFx0XHRcdFx0XHRcdF9zY3JvbGxUbygkdGhpcyx0b1swXS50b1N0cmluZygpLHtkaXI6XCJ5XCIsZHVyOjAsb3ZlcndyaXRlOlwibm9uZVwifSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9ZWxzZSBpZihtQ1NCX2RyYWdnZXJbMV0ud2lkdGgoKT5tQ1NCX2RyYWdnZXJbMV0ucGFyZW50KCkud2lkdGgoKSl7XG5cdFx0XHRcdFx0XHRcdFx0X3Jlc2V0Q29udGVudFBvc2l0aW9uLmNhbGwodGhpcyk7IC8qIHJlc2V0IGNvbnRlbnQgcG9zaXRpb24gKi9cblx0XHRcdFx0XHRcdFx0fWVsc2V7IC8qIHggc2Nyb2xsaW5nIGlzIHJlcXVpcmVkICovXG5cdFx0XHRcdFx0XHRcdFx0X3Njcm9sbFRvKCR0aGlzLHRvWzFdLnRvU3RyaW5nKCkse2RpcjpcInhcIixkdXI6MCxvdmVyd3JpdGU6XCJub25lXCJ9KTtcblx0XHRcdFx0XHRcdFx0XHRkLmNvbnRlbnRSZXNldC54PW51bGw7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0LyogY2FsbGJhY2tzOiBvbkltYWdlTG9hZCwgb25TZWxlY3RvckNoYW5nZSwgb25VcGRhdGUgKi9cblx0XHRcdFx0XHRcdGlmKGNiICYmIGQpe1xuXHRcdFx0XHRcdFx0XHRpZihjYj09PTIgJiYgby5jYWxsYmFja3Mub25JbWFnZUxvYWQgJiYgdHlwZW9mIG8uY2FsbGJhY2tzLm9uSW1hZ2VMb2FkPT09XCJmdW5jdGlvblwiKXtcblx0XHRcdFx0XHRcdFx0XHRvLmNhbGxiYWNrcy5vbkltYWdlTG9hZC5jYWxsKHRoaXMpO1xuXHRcdFx0XHRcdFx0XHR9ZWxzZSBpZihjYj09PTMgJiYgby5jYWxsYmFja3Mub25TZWxlY3RvckNoYW5nZSAmJiB0eXBlb2Ygby5jYWxsYmFja3Mub25TZWxlY3RvckNoYW5nZT09PVwiZnVuY3Rpb25cIil7XG5cdFx0XHRcdFx0XHRcdFx0by5jYWxsYmFja3Mub25TZWxlY3RvckNoYW5nZS5jYWxsKHRoaXMpO1xuXHRcdFx0XHRcdFx0XHR9ZWxzZSBpZihvLmNhbGxiYWNrcy5vblVwZGF0ZSAmJiB0eXBlb2Ygby5jYWxsYmFja3Mub25VcGRhdGU9PT1cImZ1bmN0aW9uXCIpe1xuXHRcdFx0XHRcdFx0XHRcdG8uY2FsbGJhY2tzLm9uVXBkYXRlLmNhbGwodGhpcyk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0X2F1dG9VcGRhdGUuY2FsbCh0aGlzKTsgLyogaW5pdGlhbGl6ZSBhdXRvbWF0aWMgdXBkYXRpbmcgKGZvciBkeW5hbWljIGNvbnRlbnQsIGZsdWlkIGxheW91dHMgZXRjLikgKi9cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0fSk7XG5cdFx0XHRcdFxuXHRcdFx0fSxcblx0XHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcdFxuXHRcdFx0XG5cdFx0XHRcblx0XHRcdC8qIFxuXHRcdFx0cGx1Z2luIHNjcm9sbFRvIG1ldGhvZCBcblx0XHRcdHRyaWdnZXJzIGEgc2Nyb2xsaW5nIGV2ZW50IHRvIGEgc3BlY2lmaWMgdmFsdWVcblx0XHRcdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdHVzYWdlOiAkKHNlbGVjdG9yKS5tQ3VzdG9tU2Nyb2xsYmFyKFwic2Nyb2xsVG9cIix2YWx1ZSxvcHRpb25zKTtcblx0XHRcdCovXG5cdFx0XG5cdFx0XHRzY3JvbGxUbzpmdW5jdGlvbih2YWwsb3B0aW9ucyl7XG5cdFx0XHRcdFxuXHRcdFx0XHQvKiBwcmV2ZW50IHNpbGx5IHRoaW5ncyBsaWtlICQoc2VsZWN0b3IpLm1DdXN0b21TY3JvbGxiYXIoXCJzY3JvbGxUb1wiLHVuZGVmaW5lZCk7ICovXG5cdFx0XHRcdGlmKHR5cGVvZiB2YWw9PVwidW5kZWZpbmVkXCIgfHwgdmFsPT1udWxsKXtyZXR1cm47fVxuXHRcdFx0XHRcblx0XHRcdFx0dmFyIHNlbGVjdG9yPV9zZWxlY3Rvci5jYWxsKHRoaXMpOyAvKiB2YWxpZGF0ZSBzZWxlY3RvciAqL1xuXHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuICQoc2VsZWN0b3IpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR2YXIgJHRoaXM9JCh0aGlzKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZigkdGhpcy5kYXRhKHBsdWdpblBmeCkpeyAvKiBjaGVjayBpZiBwbHVnaW4gaGFzIGluaXRpYWxpemVkICovXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHR2YXIgZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcblx0XHRcdFx0XHRcdFx0LyogbWV0aG9kIGRlZmF1bHQgb3B0aW9ucyAqL1xuXHRcdFx0XHRcdFx0XHRtZXRob2REZWZhdWx0cz17XG5cdFx0XHRcdFx0XHRcdFx0dHJpZ2dlcjpcImV4dGVybmFsXCIsIC8qIG1ldGhvZCBpcyBieSBkZWZhdWx0IHRyaWdnZXJlZCBleHRlcm5hbGx5IChlLmcuIGZyb20gb3RoZXIgc2NyaXB0cykgKi9cblx0XHRcdFx0XHRcdFx0XHRzY3JvbGxJbmVydGlhOm8uc2Nyb2xsSW5lcnRpYSwgLyogc2Nyb2xsaW5nIGluZXJ0aWEgKGFuaW1hdGlvbiBkdXJhdGlvbikgKi9cblx0XHRcdFx0XHRcdFx0XHRzY3JvbGxFYXNpbmc6XCJtY3NFYXNlSW5PdXRcIiwgLyogYW5pbWF0aW9uIGVhc2luZyAqL1xuXHRcdFx0XHRcdFx0XHRcdG1vdmVEcmFnZ2VyOmZhbHNlLCAvKiBtb3ZlIGRyYWdnZXIgaW5zdGVhZCBvZiBjb250ZW50ICovXG5cdFx0XHRcdFx0XHRcdFx0dGltZW91dDo2MCwgLyogc2Nyb2xsLXRvIGRlbGF5ICovXG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzOnRydWUsIC8qIGVuYWJsZS9kaXNhYmxlIGNhbGxiYWNrcyAqL1xuXHRcdFx0XHRcdFx0XHRcdG9uU3RhcnQ6dHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRvblVwZGF0ZTp0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdG9uQ29tcGxldGU6dHJ1ZVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRtZXRob2RPcHRpb25zPSQuZXh0ZW5kKHRydWUse30sbWV0aG9kRGVmYXVsdHMsb3B0aW9ucyksXG5cdFx0XHRcdFx0XHRcdHRvPV9hcnIuY2FsbCh0aGlzLHZhbCksZHVyPW1ldGhvZE9wdGlvbnMuc2Nyb2xsSW5lcnRpYT4wICYmIG1ldGhvZE9wdGlvbnMuc2Nyb2xsSW5lcnRpYTwxNyA/IDE3IDogbWV0aG9kT3B0aW9ucy5zY3JvbGxJbmVydGlhO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQvKiB0cmFuc2xhdGUgeXggdmFsdWVzIHRvIGFjdHVhbCBzY3JvbGwtdG8gcG9zaXRpb25zICovXG5cdFx0XHRcdFx0XHR0b1swXT1fdG8uY2FsbCh0aGlzLHRvWzBdLFwieVwiKTtcblx0XHRcdFx0XHRcdHRvWzFdPV90by5jYWxsKHRoaXMsdG9bMV0sXCJ4XCIpO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQvKiBcblx0XHRcdFx0XHRcdGNoZWNrIGlmIHNjcm9sbC10byB2YWx1ZSBtb3ZlcyB0aGUgZHJhZ2dlciBpbnN0ZWFkIG9mIGNvbnRlbnQuIFxuXHRcdFx0XHRcdFx0T25seSBwaXhlbCB2YWx1ZXMgYXBwbHkgb24gZHJhZ2dlciAoZS5nLiAxMDAsIFwiMTAwcHhcIiwgXCItPTEwMFwiIGV0Yy4pIFxuXHRcdFx0XHRcdFx0Ki9cblx0XHRcdFx0XHRcdGlmKG1ldGhvZE9wdGlvbnMubW92ZURyYWdnZXIpe1xuXHRcdFx0XHRcdFx0XHR0b1swXSo9ZC5zY3JvbGxSYXRpby55O1xuXHRcdFx0XHRcdFx0XHR0b1sxXSo9ZC5zY3JvbGxSYXRpby54O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRtZXRob2RPcHRpb25zLmR1cj1faXNUYWJIaWRkZW4oKSA/IDAgOiBkdXI7IC8vc2tpcCBhbmltYXRpb25zIGlmIGJyb3dzZXIgdGFiIGlzIGhpZGRlblxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IFxuXHRcdFx0XHRcdFx0XHQvKiBkbyB0aGUgc2Nyb2xsaW5nICovXG5cdFx0XHRcdFx0XHRcdGlmKHRvWzBdIT09bnVsbCAmJiB0eXBlb2YgdG9bMF0hPT1cInVuZGVmaW5lZFwiICYmIG8uYXhpcyE9PVwieFwiICYmIGQub3ZlcmZsb3dlZFswXSl7IC8qIHNjcm9sbCB5ICovXG5cdFx0XHRcdFx0XHRcdFx0bWV0aG9kT3B0aW9ucy5kaXI9XCJ5XCI7XG5cdFx0XHRcdFx0XHRcdFx0bWV0aG9kT3B0aW9ucy5vdmVyd3JpdGU9XCJhbGxcIjtcblx0XHRcdFx0XHRcdFx0XHRfc2Nyb2xsVG8oJHRoaXMsdG9bMF0udG9TdHJpbmcoKSxtZXRob2RPcHRpb25zKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRpZih0b1sxXSE9PW51bGwgJiYgdHlwZW9mIHRvWzFdIT09XCJ1bmRlZmluZWRcIiAmJiBvLmF4aXMhPT1cInlcIiAmJiBkLm92ZXJmbG93ZWRbMV0peyAvKiBzY3JvbGwgeCAqL1xuXHRcdFx0XHRcdFx0XHRcdG1ldGhvZE9wdGlvbnMuZGlyPVwieFwiO1xuXHRcdFx0XHRcdFx0XHRcdG1ldGhvZE9wdGlvbnMub3ZlcndyaXRlPVwibm9uZVwiO1xuXHRcdFx0XHRcdFx0XHRcdF9zY3JvbGxUbygkdGhpcyx0b1sxXS50b1N0cmluZygpLG1ldGhvZE9wdGlvbnMpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LG1ldGhvZE9wdGlvbnMudGltZW91dCk7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdH0sXG5cdFx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XHRcblx0XHRcdFxuXHRcdFx0XG5cdFx0XHQvKlxuXHRcdFx0cGx1Z2luIHN0b3AgbWV0aG9kIFxuXHRcdFx0c3RvcHMgc2Nyb2xsaW5nIGFuaW1hdGlvblxuXHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRcdFx0dXNhZ2U6ICQoc2VsZWN0b3IpLm1DdXN0b21TY3JvbGxiYXIoXCJzdG9wXCIpO1xuXHRcdFx0Ki9cblx0XHRcdHN0b3A6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XG5cdFx0XHRcdHZhciBzZWxlY3Rvcj1fc2VsZWN0b3IuY2FsbCh0aGlzKTsgLyogdmFsaWRhdGUgc2VsZWN0b3IgKi9cblx0XHRcdFx0XG5cdFx0XHRcdHJldHVybiAkKHNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0dmFyICR0aGlzPSQodGhpcyk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYoJHRoaXMuZGF0YShwbHVnaW5QZngpKXsgLyogY2hlY2sgaWYgcGx1Z2luIGhhcyBpbml0aWFsaXplZCAqL1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdF9zdG9wKCR0aGlzKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdH0sXG5cdFx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XHRcblx0XHRcdFxuXHRcdFx0XG5cdFx0XHQvKlxuXHRcdFx0cGx1Z2luIGRpc2FibGUgbWV0aG9kIFxuXHRcdFx0dGVtcG9yYXJpbHkgZGlzYWJsZXMgdGhlIHNjcm9sbGJhcihzKSBcblx0XHRcdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0XHRcdHVzYWdlOiAkKHNlbGVjdG9yKS5tQ3VzdG9tU2Nyb2xsYmFyKFwiZGlzYWJsZVwiLHJlc2V0KTsgXG5cdFx0XHRyZXNldCAoYm9vbGVhbik6IHJlc2V0cyBjb250ZW50IHBvc2l0aW9uIHRvIDAgXG5cdFx0XHQqL1xuXHRcdFx0ZGlzYWJsZTpmdW5jdGlvbihyKXtcblx0XHRcdFx0XG5cdFx0XHRcdHZhciBzZWxlY3Rvcj1fc2VsZWN0b3IuY2FsbCh0aGlzKTsgLyogdmFsaWRhdGUgc2VsZWN0b3IgKi9cblx0XHRcdFx0XG5cdFx0XHRcdHJldHVybiAkKHNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0dmFyICR0aGlzPSQodGhpcyk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYoJHRoaXMuZGF0YShwbHVnaW5QZngpKXsgLyogY2hlY2sgaWYgcGx1Z2luIGhhcyBpbml0aWFsaXplZCAqL1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHR2YXIgZD0kdGhpcy5kYXRhKHBsdWdpblBmeCk7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdF9hdXRvVXBkYXRlLmNhbGwodGhpcyxcInJlbW92ZVwiKTsgLyogcmVtb3ZlIGF1dG9tYXRpYyB1cGRhdGluZyAqL1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRfdW5iaW5kRXZlbnRzLmNhbGwodGhpcyk7IC8qIHVuYmluZCBldmVudHMgKi9cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYocil7X3Jlc2V0Q29udGVudFBvc2l0aW9uLmNhbGwodGhpcyk7fSAvKiByZXNldCBjb250ZW50IHBvc2l0aW9uICovXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdF9zY3JvbGxiYXJWaXNpYmlsaXR5LmNhbGwodGhpcyx0cnVlKTsgLyogc2hvdy9oaWRlIHNjcm9sbGJhcihzKSAqL1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQkdGhpcy5hZGRDbGFzcyhjbGFzc2VzWzNdKTsgLyogYWRkIGRpc2FibGUgY2xhc3MgKi9cblx0XHRcdFx0XHRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdH0sXG5cdFx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XHRcblx0XHRcdFxuXHRcdFx0XG5cdFx0XHQvKlxuXHRcdFx0cGx1Z2luIGRlc3Ryb3kgbWV0aG9kIFxuXHRcdFx0Y29tcGxldGVseSByZW1vdmVzIHRoZSBzY3JvbGxiYXIocykgYW5kIHJldHVybnMgdGhlIGVsZW1lbnQgdG8gaXRzIG9yaWdpbmFsIHN0YXRlXG5cdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdFx0XHR1c2FnZTogJChzZWxlY3RvcikubUN1c3RvbVNjcm9sbGJhcihcImRlc3Ryb3lcIik7IFxuXHRcdFx0Ki9cblx0XHRcdGRlc3Ryb3k6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XG5cdFx0XHRcdHZhciBzZWxlY3Rvcj1fc2VsZWN0b3IuY2FsbCh0aGlzKTsgLyogdmFsaWRhdGUgc2VsZWN0b3IgKi9cblx0XHRcdFx0XG5cdFx0XHRcdHJldHVybiAkKHNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0dmFyICR0aGlzPSQodGhpcyk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYoJHRoaXMuZGF0YShwbHVnaW5QZngpKXsgLyogY2hlY2sgaWYgcGx1Z2luIGhhcyBpbml0aWFsaXplZCAqL1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0dmFyIGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXG5cdFx0XHRcdFx0XHRcdG1DdXN0b21TY3JvbGxCb3g9JChcIiNtQ1NCX1wiK2QuaWR4KSxcblx0XHRcdFx0XHRcdFx0bUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcblx0XHRcdFx0XHRcdFx0c2Nyb2xsYmFyPSQoXCIubUNTQl9cIitkLmlkeCtcIl9zY3JvbGxiYXJcIik7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRpZihvLmxpdmUpe3JlbW92ZUxpdmVUaW1lcnMoby5saXZlU2VsZWN0b3IgfHwgJChzZWxlY3Rvcikuc2VsZWN0b3IpO30gLyogcmVtb3ZlIGxpdmUgdGltZXJzICovXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdF9hdXRvVXBkYXRlLmNhbGwodGhpcyxcInJlbW92ZVwiKTsgLyogcmVtb3ZlIGF1dG9tYXRpYyB1cGRhdGluZyAqL1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRfdW5iaW5kRXZlbnRzLmNhbGwodGhpcyk7IC8qIHVuYmluZCBldmVudHMgKi9cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0X3Jlc2V0Q29udGVudFBvc2l0aW9uLmNhbGwodGhpcyk7IC8qIHJlc2V0IGNvbnRlbnQgcG9zaXRpb24gKi9cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0JHRoaXMucmVtb3ZlRGF0YShwbHVnaW5QZngpOyAvKiByZW1vdmUgcGx1Z2luIGRhdGEgb2JqZWN0ICovXG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdF9kZWxldGUodGhpcyxcIm1jc1wiKTsgLyogZGVsZXRlIGNhbGxiYWNrcyBvYmplY3QgKi9cblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0LyogcmVtb3ZlIHBsdWdpbiBtYXJrdXAgKi9cblx0XHRcdFx0XHRcdHNjcm9sbGJhci5yZW1vdmUoKTsgLyogcmVtb3ZlIHNjcm9sbGJhcihzKSBmaXJzdCAodGhvc2UgY2FuIGJlIGVpdGhlciBpbnNpZGUgb3Igb3V0c2lkZSBwbHVnaW4ncyBpbm5lciB3cmFwcGVyKSAqL1xuXHRcdFx0XHRcdFx0bUNTQl9jb250YWluZXIuZmluZChcImltZy5cIitjbGFzc2VzWzJdKS5yZW1vdmVDbGFzcyhjbGFzc2VzWzJdKTsgLyogcmVtb3ZlIGxvYWRlZCBpbWFnZXMgZmxhZyAqL1xuXHRcdFx0XHRcdFx0bUN1c3RvbVNjcm9sbEJveC5yZXBsYWNlV2l0aChtQ1NCX2NvbnRhaW5lci5jb250ZW50cygpKTsgLyogcmVwbGFjZSBwbHVnaW4ncyBpbm5lciB3cmFwcGVyIHdpdGggdGhlIG9yaWdpbmFsIGNvbnRlbnQgKi9cblx0XHRcdFx0XHRcdC8qIHJlbW92ZSBwbHVnaW4gY2xhc3NlcyBmcm9tIHRoZSBlbGVtZW50IGFuZCBhZGQgZGVzdHJveSBjbGFzcyAqL1xuXHRcdFx0XHRcdFx0JHRoaXMucmVtb3ZlQ2xhc3MocGx1Z2luTlMrXCIgX1wiK3BsdWdpblBmeCtcIl9cIitkLmlkeCtcIiBcIitjbGFzc2VzWzZdK1wiIFwiK2NsYXNzZXNbN10rXCIgXCIrY2xhc3Nlc1s1XStcIiBcIitjbGFzc2VzWzNdKS5hZGRDbGFzcyhjbGFzc2VzWzRdKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRcblx0XHRcdH1cblx0XHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcdFxuXHRcdH0sXG5cdFxuXHRcblx0XG5cdFxuXHRcdFxuXHQvKiBcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHRGVU5DVElPTlNcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQqL1xuXHRcblx0XHQvKiB2YWxpZGF0ZXMgc2VsZWN0b3IgKGlmIHNlbGVjdG9yIGlzIGludmFsaWQgb3IgdW5kZWZpbmVkIHVzZXMgdGhlIGRlZmF1bHQgb25lKSAqL1xuXHRcdF9zZWxlY3Rvcj1mdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuICh0eXBlb2YgJCh0aGlzKSE9PVwib2JqZWN0XCIgfHwgJCh0aGlzKS5sZW5ndGg8MSkgPyBkZWZhdWx0U2VsZWN0b3IgOiB0aGlzO1xuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiBjaGFuZ2VzIG9wdGlvbnMgYWNjb3JkaW5nIHRvIHRoZW1lICovXG5cdFx0X3RoZW1lPWZ1bmN0aW9uKG9iail7XG5cdFx0XHR2YXIgZml4ZWRTaXplU2Nyb2xsYmFyVGhlbWVzPVtcInJvdW5kZWRcIixcInJvdW5kZWQtZGFya1wiLFwicm91bmRlZC1kb3RzXCIsXCJyb3VuZGVkLWRvdHMtZGFya1wiXSxcblx0XHRcdFx0bm9uRXhwYW5kZWRTY3JvbGxiYXJUaGVtZXM9W1wicm91bmRlZC1kb3RzXCIsXCJyb3VuZGVkLWRvdHMtZGFya1wiLFwiM2RcIixcIjNkLWRhcmtcIixcIjNkLXRoaWNrXCIsXCIzZC10aGljay1kYXJrXCIsXCJpbnNldFwiLFwiaW5zZXQtZGFya1wiLFwiaW5zZXQtMlwiLFwiaW5zZXQtMi1kYXJrXCIsXCJpbnNldC0zXCIsXCJpbnNldC0zLWRhcmtcIl0sXG5cdFx0XHRcdGRpc2FibGVkU2Nyb2xsQnV0dG9uc1RoZW1lcz1bXCJtaW5pbWFsXCIsXCJtaW5pbWFsLWRhcmtcIl0sXG5cdFx0XHRcdGVuYWJsZWRBdXRvSGlkZVNjcm9sbGJhclRoZW1lcz1bXCJtaW5pbWFsXCIsXCJtaW5pbWFsLWRhcmtcIl0sXG5cdFx0XHRcdHNjcm9sbGJhclBvc2l0aW9uT3V0c2lkZVRoZW1lcz1bXCJtaW5pbWFsXCIsXCJtaW5pbWFsLWRhcmtcIl07XG5cdFx0XHRvYmouYXV0b0RyYWdnZXJMZW5ndGg9JC5pbkFycmF5KG9iai50aGVtZSxmaXhlZFNpemVTY3JvbGxiYXJUaGVtZXMpID4gLTEgPyBmYWxzZSA6IG9iai5hdXRvRHJhZ2dlckxlbmd0aDtcblx0XHRcdG9iai5hdXRvRXhwYW5kU2Nyb2xsYmFyPSQuaW5BcnJheShvYmoudGhlbWUsbm9uRXhwYW5kZWRTY3JvbGxiYXJUaGVtZXMpID4gLTEgPyBmYWxzZSA6IG9iai5hdXRvRXhwYW5kU2Nyb2xsYmFyO1xuXHRcdFx0b2JqLnNjcm9sbEJ1dHRvbnMuZW5hYmxlPSQuaW5BcnJheShvYmoudGhlbWUsZGlzYWJsZWRTY3JvbGxCdXR0b25zVGhlbWVzKSA+IC0xID8gZmFsc2UgOiBvYmouc2Nyb2xsQnV0dG9ucy5lbmFibGU7XG5cdFx0XHRvYmouYXV0b0hpZGVTY3JvbGxiYXI9JC5pbkFycmF5KG9iai50aGVtZSxlbmFibGVkQXV0b0hpZGVTY3JvbGxiYXJUaGVtZXMpID4gLTEgPyB0cnVlIDogb2JqLmF1dG9IaWRlU2Nyb2xsYmFyO1xuXHRcdFx0b2JqLnNjcm9sbGJhclBvc2l0aW9uPSQuaW5BcnJheShvYmoudGhlbWUsc2Nyb2xsYmFyUG9zaXRpb25PdXRzaWRlVGhlbWVzKSA+IC0xID8gXCJvdXRzaWRlXCIgOiBvYmouc2Nyb2xsYmFyUG9zaXRpb247XG5cdFx0fSxcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFxuXHRcdFxuXHRcdC8qIGxpdmUgb3B0aW9uIHRpbWVycyByZW1vdmFsICovXG5cdFx0cmVtb3ZlTGl2ZVRpbWVycz1mdW5jdGlvbihzZWxlY3Rvcil7XG5cdFx0XHRpZihsaXZlVGltZXJzW3NlbGVjdG9yXSl7XG5cdFx0XHRcdGNsZWFyVGltZW91dChsaXZlVGltZXJzW3NlbGVjdG9yXSk7XG5cdFx0XHRcdF9kZWxldGUobGl2ZVRpbWVycyxzZWxlY3Rvcik7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFxuXHRcdFxuXHRcdC8qIG5vcm1hbGl6ZXMgYXhpcyBvcHRpb24gdG8gdmFsaWQgdmFsdWVzOiBcInlcIiwgXCJ4XCIsIFwieXhcIiAqL1xuXHRcdF9maW5kQXhpcz1mdW5jdGlvbih2YWwpe1xuXHRcdFx0cmV0dXJuICh2YWw9PT1cInl4XCIgfHwgdmFsPT09XCJ4eVwiIHx8IHZhbD09PVwiYXV0b1wiKSA/IFwieXhcIiA6ICh2YWw9PT1cInhcIiB8fCB2YWw9PT1cImhvcml6b250YWxcIikgPyBcInhcIiA6IFwieVwiO1xuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiBub3JtYWxpemVzIHNjcm9sbEJ1dHRvbnMuc2Nyb2xsVHlwZSBvcHRpb24gdG8gdmFsaWQgdmFsdWVzOiBcInN0ZXBsZXNzXCIsIFwic3RlcHBlZFwiICovXG5cdFx0X2ZpbmRTY3JvbGxCdXR0b25zVHlwZT1mdW5jdGlvbih2YWwpe1xuXHRcdFx0cmV0dXJuICh2YWw9PT1cInN0ZXBwZWRcIiB8fCB2YWw9PT1cInBpeGVsc1wiIHx8IHZhbD09PVwic3RlcFwiIHx8IHZhbD09PVwiY2xpY2tcIikgPyBcInN0ZXBwZWRcIiA6IFwic3RlcGxlc3NcIjtcblx0XHR9LFxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XG5cdFx0XG5cdFx0LyogZ2VuZXJhdGVzIHBsdWdpbiBtYXJrdXAgKi9cblx0XHRfcGx1Z2luTWFya3VwPWZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxuXHRcdFx0XHRleHBhbmRDbGFzcz1vLmF1dG9FeHBhbmRTY3JvbGxiYXIgPyBcIiBcIitjbGFzc2VzWzFdK1wiX2V4cGFuZFwiIDogXCJcIixcblx0XHRcdFx0c2Nyb2xsYmFyPVtcIjxkaXYgaWQ9J21DU0JfXCIrZC5pZHgrXCJfc2Nyb2xsYmFyX3ZlcnRpY2FsJyBjbGFzcz0nbUNTQl9zY3JvbGxUb29scyBtQ1NCX1wiK2QuaWR4K1wiX3Njcm9sbGJhciBtQ1MtXCIrby50aGVtZStcIiBtQ1NCX3Njcm9sbFRvb2xzX3ZlcnRpY2FsXCIrZXhwYW5kQ2xhc3MrXCInPjxkaXYgY2xhc3M9J1wiK2NsYXNzZXNbMTJdK1wiJz48ZGl2IGlkPSdtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfdmVydGljYWwnIGNsYXNzPSdtQ1NCX2RyYWdnZXInIHN0eWxlPSdwb3NpdGlvbjphYnNvbHV0ZTsnPjxkaXYgY2xhc3M9J21DU0JfZHJhZ2dlcl9iYXInIC8+PC9kaXY+PGRpdiBjbGFzcz0nbUNTQl9kcmFnZ2VyUmFpbCcgLz48L2Rpdj48L2Rpdj5cIixcIjxkaXYgaWQ9J21DU0JfXCIrZC5pZHgrXCJfc2Nyb2xsYmFyX2hvcml6b250YWwnIGNsYXNzPSdtQ1NCX3Njcm9sbFRvb2xzIG1DU0JfXCIrZC5pZHgrXCJfc2Nyb2xsYmFyIG1DUy1cIitvLnRoZW1lK1wiIG1DU0Jfc2Nyb2xsVG9vbHNfaG9yaXpvbnRhbFwiK2V4cGFuZENsYXNzK1wiJz48ZGl2IGNsYXNzPSdcIitjbGFzc2VzWzEyXStcIic+PGRpdiBpZD0nbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWwnIGNsYXNzPSdtQ1NCX2RyYWdnZXInIHN0eWxlPSdwb3NpdGlvbjphYnNvbHV0ZTsnPjxkaXYgY2xhc3M9J21DU0JfZHJhZ2dlcl9iYXInIC8+PC9kaXY+PGRpdiBjbGFzcz0nbUNTQl9kcmFnZ2VyUmFpbCcgLz48L2Rpdj48L2Rpdj5cIl0sXG5cdFx0XHRcdHdyYXBwZXJDbGFzcz1vLmF4aXM9PT1cInl4XCIgPyBcIm1DU0JfdmVydGljYWxfaG9yaXpvbnRhbFwiIDogby5heGlzPT09XCJ4XCIgPyBcIm1DU0JfaG9yaXpvbnRhbFwiIDogXCJtQ1NCX3ZlcnRpY2FsXCIsXG5cdFx0XHRcdHNjcm9sbGJhcnM9by5heGlzPT09XCJ5eFwiID8gc2Nyb2xsYmFyWzBdK3Njcm9sbGJhclsxXSA6IG8uYXhpcz09PVwieFwiID8gc2Nyb2xsYmFyWzFdIDogc2Nyb2xsYmFyWzBdLFxuXHRcdFx0XHRjb250ZW50V3JhcHBlcj1vLmF4aXM9PT1cInl4XCIgPyBcIjxkaXYgaWQ9J21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyX3dyYXBwZXInIGNsYXNzPSdtQ1NCX2NvbnRhaW5lcl93cmFwcGVyJyAvPlwiIDogXCJcIixcblx0XHRcdFx0YXV0b0hpZGVDbGFzcz1vLmF1dG9IaWRlU2Nyb2xsYmFyID8gXCIgXCIrY2xhc3Nlc1s2XSA6IFwiXCIsXG5cdFx0XHRcdHNjcm9sbGJhckRpckNsYXNzPShvLmF4aXMhPT1cInhcIiAmJiBkLmxhbmdEaXI9PT1cInJ0bFwiKSA/IFwiIFwiK2NsYXNzZXNbN10gOiBcIlwiO1xuXHRcdFx0aWYoby5zZXRXaWR0aCl7JHRoaXMuY3NzKFwid2lkdGhcIixvLnNldFdpZHRoKTt9IC8qIHNldCBlbGVtZW50IHdpZHRoICovXG5cdFx0XHRpZihvLnNldEhlaWdodCl7JHRoaXMuY3NzKFwiaGVpZ2h0XCIsby5zZXRIZWlnaHQpO30gLyogc2V0IGVsZW1lbnQgaGVpZ2h0ICovXG5cdFx0XHRvLnNldExlZnQ9KG8uYXhpcyE9PVwieVwiICYmIGQubGFuZ0Rpcj09PVwicnRsXCIpID8gXCI5ODk5OTlweFwiIDogby5zZXRMZWZ0OyAvKiBhZGp1c3QgbGVmdCBwb3NpdGlvbiBmb3IgcnRsIGRpcmVjdGlvbiAqL1xuXHRcdFx0JHRoaXMuYWRkQ2xhc3MocGx1Z2luTlMrXCIgX1wiK3BsdWdpblBmeCtcIl9cIitkLmlkeCthdXRvSGlkZUNsYXNzK3Njcm9sbGJhckRpckNsYXNzKS53cmFwSW5uZXIoXCI8ZGl2IGlkPSdtQ1NCX1wiK2QuaWR4K1wiJyBjbGFzcz0nbUN1c3RvbVNjcm9sbEJveCBtQ1MtXCIrby50aGVtZStcIiBcIit3cmFwcGVyQ2xhc3MrXCInPjxkaXYgaWQ9J21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyJyBjbGFzcz0nbUNTQl9jb250YWluZXInIHN0eWxlPSdwb3NpdGlvbjpyZWxhdGl2ZTsgdG9wOlwiK28uc2V0VG9wK1wiOyBsZWZ0OlwiK28uc2V0TGVmdCtcIjsnIGRpcj0nXCIrZC5sYW5nRGlyK1wiJyAvPjwvZGl2PlwiKTtcblx0XHRcdHZhciBtQ3VzdG9tU2Nyb2xsQm94PSQoXCIjbUNTQl9cIitkLmlkeCksXG5cdFx0XHRcdG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIik7XG5cdFx0XHRpZihvLmF4aXMhPT1cInlcIiAmJiAhby5hZHZhbmNlZC5hdXRvRXhwYW5kSG9yaXpvbnRhbFNjcm9sbCl7XG5cdFx0XHRcdG1DU0JfY29udGFpbmVyLmNzcyhcIndpZHRoXCIsX2NvbnRlbnRXaWR0aChtQ1NCX2NvbnRhaW5lcikpO1xuXHRcdFx0fVxuXHRcdFx0aWYoby5zY3JvbGxiYXJQb3NpdGlvbj09PVwib3V0c2lkZVwiKXtcblx0XHRcdFx0aWYoJHRoaXMuY3NzKFwicG9zaXRpb25cIik9PT1cInN0YXRpY1wiKXsgLyogcmVxdWlyZXMgZWxlbWVudHMgd2l0aCBub24tc3RhdGljIHBvc2l0aW9uICovXG5cdFx0XHRcdFx0JHRoaXMuY3NzKFwicG9zaXRpb25cIixcInJlbGF0aXZlXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCR0aGlzLmNzcyhcIm92ZXJmbG93XCIsXCJ2aXNpYmxlXCIpO1xuXHRcdFx0XHRtQ3VzdG9tU2Nyb2xsQm94LmFkZENsYXNzKFwibUNTQl9vdXRzaWRlXCIpLmFmdGVyKHNjcm9sbGJhcnMpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdG1DdXN0b21TY3JvbGxCb3guYWRkQ2xhc3MoXCJtQ1NCX2luc2lkZVwiKS5hcHBlbmQoc2Nyb2xsYmFycyk7XG5cdFx0XHRcdG1DU0JfY29udGFpbmVyLndyYXAoY29udGVudFdyYXBwZXIpO1xuXHRcdFx0fVxuXHRcdFx0X3Njcm9sbEJ1dHRvbnMuY2FsbCh0aGlzKTsgLyogYWRkIHNjcm9sbGJhciBidXR0b25zICovXG5cdFx0XHQvKiBtaW5pbXVtIGRyYWdnZXIgbGVuZ3RoICovXG5cdFx0XHR2YXIgbUNTQl9kcmFnZ2VyPVskKFwiI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl92ZXJ0aWNhbFwiKSwkKFwiI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl9ob3Jpem9udGFsXCIpXTtcblx0XHRcdG1DU0JfZHJhZ2dlclswXS5jc3MoXCJtaW4taGVpZ2h0XCIsbUNTQl9kcmFnZ2VyWzBdLmhlaWdodCgpKTtcblx0XHRcdG1DU0JfZHJhZ2dlclsxXS5jc3MoXCJtaW4td2lkdGhcIixtQ1NCX2RyYWdnZXJbMV0ud2lkdGgoKSk7XG5cdFx0fSxcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFxuXHRcdFxuXHRcdC8qIGNhbGN1bGF0ZXMgY29udGVudCB3aWR0aCAqL1xuXHRcdF9jb250ZW50V2lkdGg9ZnVuY3Rpb24oZWwpe1xuXHRcdFx0dmFyIHZhbD1bZWxbMF0uc2Nyb2xsV2lkdGgsTWF0aC5tYXguYXBwbHkoTWF0aCxlbC5jaGlsZHJlbigpLm1hcChmdW5jdGlvbigpe3JldHVybiAkKHRoaXMpLm91dGVyV2lkdGgodHJ1ZSk7fSkuZ2V0KCkpXSx3PWVsLnBhcmVudCgpLndpZHRoKCk7XG5cdFx0XHRyZXR1cm4gdmFsWzBdPncgPyB2YWxbMF0gOiB2YWxbMV0+dyA/IHZhbFsxXSA6IFwiMTAwJVwiO1xuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiBleHBhbmRzIGNvbnRlbnQgaG9yaXpvbnRhbGx5ICovXG5cdFx0X2V4cGFuZENvbnRlbnRIb3Jpem9udGFsbHk9ZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXG5cdFx0XHRcdG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIik7XG5cdFx0XHRpZihvLmFkdmFuY2VkLmF1dG9FeHBhbmRIb3Jpem9udGFsU2Nyb2xsICYmIG8uYXhpcyE9PVwieVwiKXtcblx0XHRcdFx0LyogY2FsY3VsYXRlIHNjcm9sbFdpZHRoICovXG5cdFx0XHRcdG1DU0JfY29udGFpbmVyLmNzcyh7XCJ3aWR0aFwiOlwiYXV0b1wiLFwibWluLXdpZHRoXCI6MCxcIm92ZXJmbG93LXhcIjpcInNjcm9sbFwifSk7XG5cdFx0XHRcdHZhciB3PU1hdGguY2VpbChtQ1NCX2NvbnRhaW5lclswXS5zY3JvbGxXaWR0aCk7XG5cdFx0XHRcdGlmKG8uYWR2YW5jZWQuYXV0b0V4cGFuZEhvcml6b250YWxTY3JvbGw9PT0zIHx8IChvLmFkdmFuY2VkLmF1dG9FeHBhbmRIb3Jpem9udGFsU2Nyb2xsIT09MiAmJiB3Pm1DU0JfY29udGFpbmVyLnBhcmVudCgpLndpZHRoKCkpKXtcblx0XHRcdFx0XHRtQ1NCX2NvbnRhaW5lci5jc3Moe1wid2lkdGhcIjp3LFwibWluLXdpZHRoXCI6XCIxMDAlXCIsXCJvdmVyZmxvdy14XCI6XCJpbmhlcml0XCJ9KTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0LyogXG5cdFx0XHRcdFx0d3JhcCBjb250ZW50IHdpdGggYW4gaW5maW5pdGUgd2lkdGggZGl2IGFuZCBzZXQgaXRzIHBvc2l0aW9uIHRvIGFic29sdXRlIGFuZCB3aWR0aCB0byBhdXRvLiBcblx0XHRcdFx0XHRTZXR0aW5nIHdpZHRoIHRvIGF1dG8gYmVmb3JlIGNhbGN1bGF0aW5nIHRoZSBhY3R1YWwgd2lkdGggaXMgaW1wb3J0YW50ISBcblx0XHRcdFx0XHRXZSBtdXN0IGxldCB0aGUgYnJvd3NlciBzZXQgdGhlIHdpZHRoIGFzIGJyb3dzZXIgem9vbSB2YWx1ZXMgYXJlIGltcG9zc2libGUgdG8gY2FsY3VsYXRlLlxuXHRcdFx0XHRcdCovXG5cdFx0XHRcdFx0bUNTQl9jb250YWluZXIuY3NzKHtcIm92ZXJmbG93LXhcIjpcImluaGVyaXRcIixcInBvc2l0aW9uXCI6XCJhYnNvbHV0ZVwifSlcblx0XHRcdFx0XHRcdC53cmFwKFwiPGRpdiBjbGFzcz0nbUNTQl9oX3dyYXBwZXInIHN0eWxlPSdwb3NpdGlvbjpyZWxhdGl2ZTsgbGVmdDowOyB3aWR0aDo5OTk5OTlweDsnIC8+XCIpXG5cdFx0XHRcdFx0XHQuY3NzKHsgLyogc2V0IGFjdHVhbCB3aWR0aCwgb3JpZ2luYWwgcG9zaXRpb24gYW5kIHVuLXdyYXAgKi9cblx0XHRcdFx0XHRcdFx0LyogXG5cdFx0XHRcdFx0XHRcdGdldCB0aGUgZXhhY3Qgd2lkdGggKHdpdGggZGVjaW1hbHMpIGFuZCB0aGVuIHJvdW5kLXVwLiBcblx0XHRcdFx0XHRcdFx0VXNpbmcganF1ZXJ5IG91dGVyV2lkdGgoKSB3aWxsIHJvdW5kIHRoZSB3aWR0aCB2YWx1ZSB3aGljaCB3aWxsIG1lc3MgdXAgd2l0aCBpbm5lciBlbGVtZW50cyB0aGF0IGhhdmUgbm9uLWludGVnZXIgd2lkdGhcblx0XHRcdFx0XHRcdFx0Ki9cblx0XHRcdFx0XHRcdFx0XCJ3aWR0aFwiOihNYXRoLmNlaWwobUNTQl9jb250YWluZXJbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkucmlnaHQrMC40KS1NYXRoLmZsb29yKG1DU0JfY29udGFpbmVyWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQpKSxcblx0XHRcdFx0XHRcdFx0XCJtaW4td2lkdGhcIjpcIjEwMCVcIixcblx0XHRcdFx0XHRcdFx0XCJwb3NpdGlvblwiOlwicmVsYXRpdmVcIlxuXHRcdFx0XHRcdFx0fSkudW53cmFwKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XG5cdFx0XG5cdFx0LyogYWRkcyBzY3JvbGxiYXIgYnV0dG9ucyAqL1xuXHRcdF9zY3JvbGxCdXR0b25zPWZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxuXHRcdFx0XHRtQ1NCX3Njcm9sbFRvb2xzPSQoXCIubUNTQl9cIitkLmlkeCtcIl9zY3JvbGxiYXI6Zmlyc3RcIiksXG5cdFx0XHRcdHRhYmluZGV4PSFfaXNOdW1lcmljKG8uc2Nyb2xsQnV0dG9ucy50YWJpbmRleCkgPyBcIlwiIDogXCJ0YWJpbmRleD0nXCIrby5zY3JvbGxCdXR0b25zLnRhYmluZGV4K1wiJ1wiLFxuXHRcdFx0XHRidG5IVE1MPVtcblx0XHRcdFx0XHRcIjxhIGhyZWY9JyMnIGNsYXNzPSdcIitjbGFzc2VzWzEzXStcIicgXCIrdGFiaW5kZXgrXCIgLz5cIixcblx0XHRcdFx0XHRcIjxhIGhyZWY9JyMnIGNsYXNzPSdcIitjbGFzc2VzWzE0XStcIicgXCIrdGFiaW5kZXgrXCIgLz5cIixcblx0XHRcdFx0XHRcIjxhIGhyZWY9JyMnIGNsYXNzPSdcIitjbGFzc2VzWzE1XStcIicgXCIrdGFiaW5kZXgrXCIgLz5cIixcblx0XHRcdFx0XHRcIjxhIGhyZWY9JyMnIGNsYXNzPSdcIitjbGFzc2VzWzE2XStcIicgXCIrdGFiaW5kZXgrXCIgLz5cIlxuXHRcdFx0XHRdLFxuXHRcdFx0XHRidG49WyhvLmF4aXM9PT1cInhcIiA/IGJ0bkhUTUxbMl0gOiBidG5IVE1MWzBdKSwoby5heGlzPT09XCJ4XCIgPyBidG5IVE1MWzNdIDogYnRuSFRNTFsxXSksYnRuSFRNTFsyXSxidG5IVE1MWzNdXTtcblx0XHRcdGlmKG8uc2Nyb2xsQnV0dG9ucy5lbmFibGUpe1xuXHRcdFx0XHRtQ1NCX3Njcm9sbFRvb2xzLnByZXBlbmQoYnRuWzBdKS5hcHBlbmQoYnRuWzFdKS5uZXh0KFwiLm1DU0Jfc2Nyb2xsVG9vbHNcIikucHJlcGVuZChidG5bMl0pLmFwcGVuZChidG5bM10pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiBhdXRvLWFkanVzdHMgc2Nyb2xsYmFyIGRyYWdnZXIgbGVuZ3RoICovXG5cdFx0X3NldERyYWdnZXJMZW5ndGg9ZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLFxuXHRcdFx0XHRtQ3VzdG9tU2Nyb2xsQm94PSQoXCIjbUNTQl9cIitkLmlkeCksXG5cdFx0XHRcdG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIiksXG5cdFx0XHRcdG1DU0JfZHJhZ2dlcj1bJChcIiNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfdmVydGljYWxcIiksJChcIiNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfaG9yaXpvbnRhbFwiKV0sXG5cdFx0XHRcdHJhdGlvPVttQ3VzdG9tU2Nyb2xsQm94LmhlaWdodCgpL21DU0JfY29udGFpbmVyLm91dGVySGVpZ2h0KGZhbHNlKSxtQ3VzdG9tU2Nyb2xsQm94LndpZHRoKCkvbUNTQl9jb250YWluZXIub3V0ZXJXaWR0aChmYWxzZSldLFxuXHRcdFx0XHRsPVtcblx0XHRcdFx0XHRwYXJzZUludChtQ1NCX2RyYWdnZXJbMF0uY3NzKFwibWluLWhlaWdodFwiKSksTWF0aC5yb3VuZChyYXRpb1swXSptQ1NCX2RyYWdnZXJbMF0ucGFyZW50KCkuaGVpZ2h0KCkpLFxuXHRcdFx0XHRcdHBhcnNlSW50KG1DU0JfZHJhZ2dlclsxXS5jc3MoXCJtaW4td2lkdGhcIikpLE1hdGgucm91bmQocmF0aW9bMV0qbUNTQl9kcmFnZ2VyWzFdLnBhcmVudCgpLndpZHRoKCkpXG5cdFx0XHRcdF0sXG5cdFx0XHRcdGg9b2xkSUUgJiYgKGxbMV08bFswXSkgPyBsWzBdIDogbFsxXSx3PW9sZElFICYmIChsWzNdPGxbMl0pID8gbFsyXSA6IGxbM107XG5cdFx0XHRtQ1NCX2RyYWdnZXJbMF0uY3NzKHtcblx0XHRcdFx0XCJoZWlnaHRcIjpoLFwibWF4LWhlaWdodFwiOihtQ1NCX2RyYWdnZXJbMF0ucGFyZW50KCkuaGVpZ2h0KCktMTApXG5cdFx0XHR9KS5maW5kKFwiLm1DU0JfZHJhZ2dlcl9iYXJcIikuY3NzKHtcImxpbmUtaGVpZ2h0XCI6bFswXStcInB4XCJ9KTtcblx0XHRcdG1DU0JfZHJhZ2dlclsxXS5jc3Moe1xuXHRcdFx0XHRcIndpZHRoXCI6dyxcIm1heC13aWR0aFwiOihtQ1NCX2RyYWdnZXJbMV0ucGFyZW50KCkud2lkdGgoKS0xMClcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiBjYWxjdWxhdGVzIHNjcm9sbGJhciB0byBjb250ZW50IHJhdGlvICovXG5cdFx0X3Njcm9sbFJhdGlvPWZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxcblx0XHRcdFx0bUN1c3RvbVNjcm9sbEJveD0kKFwiI21DU0JfXCIrZC5pZHgpLFxuXHRcdFx0XHRtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLFxuXHRcdFx0XHRtQ1NCX2RyYWdnZXI9WyQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX3ZlcnRpY2FsXCIpLCQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIildLFxuXHRcdFx0XHRzY3JvbGxBbW91bnQ9W21DU0JfY29udGFpbmVyLm91dGVySGVpZ2h0KGZhbHNlKS1tQ3VzdG9tU2Nyb2xsQm94LmhlaWdodCgpLG1DU0JfY29udGFpbmVyLm91dGVyV2lkdGgoZmFsc2UpLW1DdXN0b21TY3JvbGxCb3gud2lkdGgoKV0sXG5cdFx0XHRcdHJhdGlvPVtcblx0XHRcdFx0XHRzY3JvbGxBbW91bnRbMF0vKG1DU0JfZHJhZ2dlclswXS5wYXJlbnQoKS5oZWlnaHQoKS1tQ1NCX2RyYWdnZXJbMF0uaGVpZ2h0KCkpLFxuXHRcdFx0XHRcdHNjcm9sbEFtb3VudFsxXS8obUNTQl9kcmFnZ2VyWzFdLnBhcmVudCgpLndpZHRoKCktbUNTQl9kcmFnZ2VyWzFdLndpZHRoKCkpXG5cdFx0XHRcdF07XG5cdFx0XHRkLnNjcm9sbFJhdGlvPXt5OnJhdGlvWzBdLHg6cmF0aW9bMV19O1xuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiB0b2dnbGVzIHNjcm9sbGluZyBjbGFzc2VzICovXG5cdFx0X29uRHJhZ0NsYXNzZXM9ZnVuY3Rpb24oZWwsYWN0aW9uLHhwbmQpe1xuXHRcdFx0dmFyIGV4cGFuZENsYXNzPXhwbmQgPyBjbGFzc2VzWzBdK1wiX2V4cGFuZGVkXCIgOiBcIlwiLFxuXHRcdFx0XHRzY3JvbGxiYXI9ZWwuY2xvc2VzdChcIi5tQ1NCX3Njcm9sbFRvb2xzXCIpO1xuXHRcdFx0aWYoYWN0aW9uPT09XCJhY3RpdmVcIil7XG5cdFx0XHRcdGVsLnRvZ2dsZUNsYXNzKGNsYXNzZXNbMF0rXCIgXCIrZXhwYW5kQ2xhc3MpOyBzY3JvbGxiYXIudG9nZ2xlQ2xhc3MoY2xhc3Nlc1sxXSk7IFxuXHRcdFx0XHRlbFswXS5fZHJhZ2dhYmxlPWVsWzBdLl9kcmFnZ2FibGUgPyAwIDogMTtcblx0XHRcdH1lbHNle1xuXHRcdFx0XHRpZighZWxbMF0uX2RyYWdnYWJsZSl7XG5cdFx0XHRcdFx0aWYoYWN0aW9uPT09XCJoaWRlXCIpe1xuXHRcdFx0XHRcdFx0ZWwucmVtb3ZlQ2xhc3MoY2xhc3Nlc1swXSk7IHNjcm9sbGJhci5yZW1vdmVDbGFzcyhjbGFzc2VzWzFdKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdGVsLmFkZENsYXNzKGNsYXNzZXNbMF0pOyBzY3JvbGxiYXIuYWRkQ2xhc3MoY2xhc3Nlc1sxXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFxuXHRcdFxuXHRcdC8qIGNoZWNrcyBpZiBjb250ZW50IG92ZXJmbG93cyBpdHMgY29udGFpbmVyIHRvIGRldGVybWluZSBpZiBzY3JvbGxpbmcgaXMgcmVxdWlyZWQgKi9cblx0XHRfb3ZlcmZsb3dlZD1mdW5jdGlvbigpe1xuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksXG5cdFx0XHRcdG1DdXN0b21TY3JvbGxCb3g9JChcIiNtQ1NCX1wiK2QuaWR4KSxcblx0XHRcdFx0bUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcblx0XHRcdFx0Y29udGVudEhlaWdodD1kLm92ZXJmbG93ZWQ9PW51bGwgPyBtQ1NCX2NvbnRhaW5lci5oZWlnaHQoKSA6IG1DU0JfY29udGFpbmVyLm91dGVySGVpZ2h0KGZhbHNlKSxcblx0XHRcdFx0Y29udGVudFdpZHRoPWQub3ZlcmZsb3dlZD09bnVsbCA/IG1DU0JfY29udGFpbmVyLndpZHRoKCkgOiBtQ1NCX2NvbnRhaW5lci5vdXRlcldpZHRoKGZhbHNlKSxcblx0XHRcdFx0aD1tQ1NCX2NvbnRhaW5lclswXS5zY3JvbGxIZWlnaHQsdz1tQ1NCX2NvbnRhaW5lclswXS5zY3JvbGxXaWR0aDtcblx0XHRcdGlmKGg+Y29udGVudEhlaWdodCl7Y29udGVudEhlaWdodD1oO31cblx0XHRcdGlmKHc+Y29udGVudFdpZHRoKXtjb250ZW50V2lkdGg9dzt9XG5cdFx0XHRyZXR1cm4gW2NvbnRlbnRIZWlnaHQ+bUN1c3RvbVNjcm9sbEJveC5oZWlnaHQoKSxjb250ZW50V2lkdGg+bUN1c3RvbVNjcm9sbEJveC53aWR0aCgpXTtcblx0XHR9LFxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XG5cdFx0XG5cdFx0LyogcmVzZXRzIGNvbnRlbnQgcG9zaXRpb24gdG8gMCAqL1xuXHRcdF9yZXNldENvbnRlbnRQb3NpdGlvbj1mdW5jdGlvbigpe1xuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcblx0XHRcdFx0bUN1c3RvbVNjcm9sbEJveD0kKFwiI21DU0JfXCIrZC5pZHgpLFxuXHRcdFx0XHRtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLFxuXHRcdFx0XHRtQ1NCX2RyYWdnZXI9WyQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX3ZlcnRpY2FsXCIpLCQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIildO1xuXHRcdFx0X3N0b3AoJHRoaXMpOyAvKiBzdG9wIGFueSBjdXJyZW50IHNjcm9sbGluZyBiZWZvcmUgcmVzZXR0aW5nICovXG5cdFx0XHRpZigoby5heGlzIT09XCJ4XCIgJiYgIWQub3ZlcmZsb3dlZFswXSkgfHwgKG8uYXhpcz09PVwieVwiICYmIGQub3ZlcmZsb3dlZFswXSkpeyAvKiByZXNldCB5ICovXG5cdFx0XHRcdG1DU0JfZHJhZ2dlclswXS5hZGQobUNTQl9jb250YWluZXIpLmNzcyhcInRvcFwiLDApO1xuXHRcdFx0XHRfc2Nyb2xsVG8oJHRoaXMsXCJfcmVzZXRZXCIpO1xuXHRcdFx0fVxuXHRcdFx0aWYoKG8uYXhpcyE9PVwieVwiICYmICFkLm92ZXJmbG93ZWRbMV0pIHx8IChvLmF4aXM9PT1cInhcIiAmJiBkLm92ZXJmbG93ZWRbMV0pKXsgLyogcmVzZXQgeCAqL1xuXHRcdFx0XHR2YXIgY3g9ZHg9MDtcblx0XHRcdFx0aWYoZC5sYW5nRGlyPT09XCJydGxcIil7IC8qIGFkanVzdCBsZWZ0IHBvc2l0aW9uIGZvciBydGwgZGlyZWN0aW9uICovXG5cdFx0XHRcdFx0Y3g9bUN1c3RvbVNjcm9sbEJveC53aWR0aCgpLW1DU0JfY29udGFpbmVyLm91dGVyV2lkdGgoZmFsc2UpO1xuXHRcdFx0XHRcdGR4PU1hdGguYWJzKGN4L2Quc2Nyb2xsUmF0aW8ueCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0bUNTQl9jb250YWluZXIuY3NzKFwibGVmdFwiLGN4KTtcblx0XHRcdFx0bUNTQl9kcmFnZ2VyWzFdLmNzcyhcImxlZnRcIixkeCk7XG5cdFx0XHRcdF9zY3JvbGxUbygkdGhpcyxcIl9yZXNldFhcIik7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFxuXHRcdFxuXHRcdC8qIGJpbmRzIHNjcm9sbGJhciBldmVudHMgKi9cblx0XHRfYmluZEV2ZW50cz1mdW5jdGlvbigpe1xuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdDtcblx0XHRcdGlmKCFkLmJpbmRFdmVudHMpeyAvKiBjaGVjayBpZiBldmVudHMgYXJlIGFscmVhZHkgYm91bmQgKi9cblx0XHRcdFx0X2RyYWdnYWJsZS5jYWxsKHRoaXMpO1xuXHRcdFx0XHRpZihvLmNvbnRlbnRUb3VjaFNjcm9sbCl7X2NvbnRlbnREcmFnZ2FibGUuY2FsbCh0aGlzKTt9XG5cdFx0XHRcdF9zZWxlY3RhYmxlLmNhbGwodGhpcyk7XG5cdFx0XHRcdGlmKG8ubW91c2VXaGVlbC5lbmFibGUpeyAvKiBiaW5kIG1vdXNld2hlZWwgZm4gd2hlbiBwbHVnaW4gaXMgYXZhaWxhYmxlICovXG5cdFx0XHRcdFx0ZnVuY3Rpb24gX213dCgpe1xuXHRcdFx0XHRcdFx0bW91c2V3aGVlbFRpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRpZighJC5ldmVudC5zcGVjaWFsLm1vdXNld2hlZWwpe1xuXHRcdFx0XHRcdFx0XHRcdF9td3QoKTtcblx0XHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KG1vdXNld2hlZWxUaW1lb3V0KTtcblx0XHRcdFx0XHRcdFx0XHRfbW91c2V3aGVlbC5jYWxsKCR0aGlzWzBdKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSwxMDApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgbW91c2V3aGVlbFRpbWVvdXQ7XG5cdFx0XHRcdFx0X213dCgpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdF9kcmFnZ2VyUmFpbC5jYWxsKHRoaXMpO1xuXHRcdFx0XHRfd3JhcHBlclNjcm9sbC5jYWxsKHRoaXMpO1xuXHRcdFx0XHRpZihvLmFkdmFuY2VkLmF1dG9TY3JvbGxPbkZvY3VzKXtfZm9jdXMuY2FsbCh0aGlzKTt9XG5cdFx0XHRcdGlmKG8uc2Nyb2xsQnV0dG9ucy5lbmFibGUpe19idXR0b25zLmNhbGwodGhpcyk7fVxuXHRcdFx0XHRpZihvLmtleWJvYXJkLmVuYWJsZSl7X2tleWJvYXJkLmNhbGwodGhpcyk7fVxuXHRcdFx0XHRkLmJpbmRFdmVudHM9dHJ1ZTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XG5cdFx0XG5cdFx0LyogdW5iaW5kcyBzY3JvbGxiYXIgZXZlbnRzICovXG5cdFx0X3VuYmluZEV2ZW50cz1mdW5jdGlvbigpe1xuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcblx0XHRcdFx0bmFtZXNwYWNlPXBsdWdpblBmeCtcIl9cIitkLmlkeCxcblx0XHRcdFx0c2I9XCIubUNTQl9cIitkLmlkeCtcIl9zY3JvbGxiYXJcIixcblx0XHRcdFx0c2VsPSQoXCIjbUNTQl9cIitkLmlkeCtcIiwjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXIsI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyX3dyYXBwZXIsXCIrc2IrXCIgLlwiK2NsYXNzZXNbMTJdK1wiLCNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfdmVydGljYWwsI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl9ob3Jpem9udGFsLFwiK3NiK1wiPmFcIiksXG5cdFx0XHRcdG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIik7XG5cdFx0XHRpZihvLmFkdmFuY2VkLnJlbGVhc2VEcmFnZ2FibGVTZWxlY3RvcnMpe3NlbC5hZGQoJChvLmFkdmFuY2VkLnJlbGVhc2VEcmFnZ2FibGVTZWxlY3RvcnMpKTt9XG5cdFx0XHRpZihvLmFkdmFuY2VkLmV4dHJhRHJhZ2dhYmxlU2VsZWN0b3JzKXtzZWwuYWRkKCQoby5hZHZhbmNlZC5leHRyYURyYWdnYWJsZVNlbGVjdG9ycykpO31cblx0XHRcdGlmKGQuYmluZEV2ZW50cyl7IC8qIGNoZWNrIGlmIGV2ZW50cyBhcmUgYm91bmQgKi9cblx0XHRcdFx0LyogdW5iaW5kIG5hbWVzcGFjZWQgZXZlbnRzIGZyb20gZG9jdW1lbnQvc2VsZWN0b3JzICovXG5cdFx0XHRcdCQoZG9jdW1lbnQpLmFkZCgkKCFfY2FuQWNjZXNzSUZyYW1lKCkgfHwgdG9wLmRvY3VtZW50KSkudW5iaW5kKFwiLlwiK25hbWVzcGFjZSk7XG5cdFx0XHRcdHNlbC5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0JCh0aGlzKS51bmJpbmQoXCIuXCIrbmFtZXNwYWNlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdC8qIGNsZWFyIGFuZCBkZWxldGUgdGltZW91dHMvb2JqZWN0cyAqL1xuXHRcdFx0XHRjbGVhclRpbWVvdXQoJHRoaXNbMF0uX2ZvY3VzVGltZW91dCk7IF9kZWxldGUoJHRoaXNbMF0sXCJfZm9jdXNUaW1lb3V0XCIpO1xuXHRcdFx0XHRjbGVhclRpbWVvdXQoZC5zZXF1ZW50aWFsLnN0ZXApOyBfZGVsZXRlKGQuc2VxdWVudGlhbCxcInN0ZXBcIik7XG5cdFx0XHRcdGNsZWFyVGltZW91dChtQ1NCX2NvbnRhaW5lclswXS5vbkNvbXBsZXRlVGltZW91dCk7IF9kZWxldGUobUNTQl9jb250YWluZXJbMF0sXCJvbkNvbXBsZXRlVGltZW91dFwiKTtcblx0XHRcdFx0ZC5iaW5kRXZlbnRzPWZhbHNlO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiB0b2dnbGVzIHNjcm9sbGJhciB2aXNpYmlsaXR5ICovXG5cdFx0X3Njcm9sbGJhclZpc2liaWxpdHk9ZnVuY3Rpb24oZGlzYWJsZWQpe1xuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcblx0XHRcdFx0Y29udGVudFdyYXBwZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lcl93cmFwcGVyXCIpLFxuXHRcdFx0XHRjb250ZW50PWNvbnRlbnRXcmFwcGVyLmxlbmd0aCA/IGNvbnRlbnRXcmFwcGVyIDogJChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcblx0XHRcdFx0c2Nyb2xsYmFyPVskKFwiI21DU0JfXCIrZC5pZHgrXCJfc2Nyb2xsYmFyX3ZlcnRpY2FsXCIpLCQoXCIjbUNTQl9cIitkLmlkeCtcIl9zY3JvbGxiYXJfaG9yaXpvbnRhbFwiKV0sXG5cdFx0XHRcdG1DU0JfZHJhZ2dlcj1bc2Nyb2xsYmFyWzBdLmZpbmQoXCIubUNTQl9kcmFnZ2VyXCIpLHNjcm9sbGJhclsxXS5maW5kKFwiLm1DU0JfZHJhZ2dlclwiKV07XG5cdFx0XHRpZihvLmF4aXMhPT1cInhcIil7XG5cdFx0XHRcdGlmKGQub3ZlcmZsb3dlZFswXSAmJiAhZGlzYWJsZWQpe1xuXHRcdFx0XHRcdHNjcm9sbGJhclswXS5hZGQobUNTQl9kcmFnZ2VyWzBdKS5hZGQoc2Nyb2xsYmFyWzBdLmNoaWxkcmVuKFwiYVwiKSkuY3NzKFwiZGlzcGxheVwiLFwiYmxvY2tcIik7XG5cdFx0XHRcdFx0Y29udGVudC5yZW1vdmVDbGFzcyhjbGFzc2VzWzhdK1wiIFwiK2NsYXNzZXNbMTBdKTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0aWYoby5hbHdheXNTaG93U2Nyb2xsYmFyKXtcblx0XHRcdFx0XHRcdGlmKG8uYWx3YXlzU2hvd1Njcm9sbGJhciE9PTIpe21DU0JfZHJhZ2dlclswXS5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpO31cblx0XHRcdFx0XHRcdGNvbnRlbnQucmVtb3ZlQ2xhc3MoY2xhc3Nlc1sxMF0pO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0c2Nyb2xsYmFyWzBdLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIik7XG5cdFx0XHRcdFx0XHRjb250ZW50LmFkZENsYXNzKGNsYXNzZXNbMTBdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y29udGVudC5hZGRDbGFzcyhjbGFzc2VzWzhdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYoby5heGlzIT09XCJ5XCIpe1xuXHRcdFx0XHRpZihkLm92ZXJmbG93ZWRbMV0gJiYgIWRpc2FibGVkKXtcblx0XHRcdFx0XHRzY3JvbGxiYXJbMV0uYWRkKG1DU0JfZHJhZ2dlclsxXSkuYWRkKHNjcm9sbGJhclsxXS5jaGlsZHJlbihcImFcIikpLmNzcyhcImRpc3BsYXlcIixcImJsb2NrXCIpO1xuXHRcdFx0XHRcdGNvbnRlbnQucmVtb3ZlQ2xhc3MoY2xhc3Nlc1s5XStcIiBcIitjbGFzc2VzWzExXSk7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdGlmKG8uYWx3YXlzU2hvd1Njcm9sbGJhcil7XG5cdFx0XHRcdFx0XHRpZihvLmFsd2F5c1Nob3dTY3JvbGxiYXIhPT0yKXttQ1NCX2RyYWdnZXJbMV0uY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKTt9XG5cdFx0XHRcdFx0XHRjb250ZW50LnJlbW92ZUNsYXNzKGNsYXNzZXNbMTFdKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHNjcm9sbGJhclsxXS5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpO1xuXHRcdFx0XHRcdFx0Y29udGVudC5hZGRDbGFzcyhjbGFzc2VzWzExXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGNvbnRlbnQuYWRkQ2xhc3MoY2xhc3Nlc1s5XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGlmKCFkLm92ZXJmbG93ZWRbMF0gJiYgIWQub3ZlcmZsb3dlZFsxXSl7XG5cdFx0XHRcdCR0aGlzLmFkZENsYXNzKGNsYXNzZXNbNV0pO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdCR0aGlzLnJlbW92ZUNsYXNzKGNsYXNzZXNbNV0pO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiByZXR1cm5zIGlucHV0IGNvb3JkaW5hdGVzIG9mIHBvaW50ZXIsIHRvdWNoIGFuZCBtb3VzZSBldmVudHMgKHJlbGF0aXZlIHRvIGRvY3VtZW50KSAqL1xuXHRcdF9jb29yZGluYXRlcz1mdW5jdGlvbihlKXtcblx0XHRcdHZhciB0PWUudHlwZSxvPWUudGFyZ2V0Lm93bmVyRG9jdW1lbnQhPT1kb2N1bWVudCAmJiBmcmFtZUVsZW1lbnQhPT1udWxsID8gWyQoZnJhbWVFbGVtZW50KS5vZmZzZXQoKS50b3AsJChmcmFtZUVsZW1lbnQpLm9mZnNldCgpLmxlZnRdIDogbnVsbCxcblx0XHRcdFx0aW89X2NhbkFjY2Vzc0lGcmFtZSgpICYmIGUudGFyZ2V0Lm93bmVyRG9jdW1lbnQhPT10b3AuZG9jdW1lbnQgJiYgZnJhbWVFbGVtZW50IT09bnVsbCA/IFskKGUudmlldy5mcmFtZUVsZW1lbnQpLm9mZnNldCgpLnRvcCwkKGUudmlldy5mcmFtZUVsZW1lbnQpLm9mZnNldCgpLmxlZnRdIDogWzAsMF07XG5cdFx0XHRzd2l0Y2godCl7XG5cdFx0XHRcdGNhc2UgXCJwb2ludGVyZG93blwiOiBjYXNlIFwiTVNQb2ludGVyRG93blwiOiBjYXNlIFwicG9pbnRlcm1vdmVcIjogY2FzZSBcIk1TUG9pbnRlck1vdmVcIjogY2FzZSBcInBvaW50ZXJ1cFwiOiBjYXNlIFwiTVNQb2ludGVyVXBcIjpcblx0XHRcdFx0XHRyZXR1cm4gbyA/IFtlLm9yaWdpbmFsRXZlbnQucGFnZVktb1swXStpb1swXSxlLm9yaWdpbmFsRXZlbnQucGFnZVgtb1sxXStpb1sxXSxmYWxzZV0gOiBbZS5vcmlnaW5hbEV2ZW50LnBhZ2VZLGUub3JpZ2luYWxFdmVudC5wYWdlWCxmYWxzZV07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJ0b3VjaHN0YXJ0XCI6IGNhc2UgXCJ0b3VjaG1vdmVcIjogY2FzZSBcInRvdWNoZW5kXCI6XG5cdFx0XHRcdFx0dmFyIHRvdWNoPWUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdIHx8IGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXSxcblx0XHRcdFx0XHRcdHRvdWNoZXM9ZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXMubGVuZ3RoIHx8IGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGg7XG5cdFx0XHRcdFx0cmV0dXJuIGUudGFyZ2V0Lm93bmVyRG9jdW1lbnQhPT1kb2N1bWVudCA/IFt0b3VjaC5zY3JlZW5ZLHRvdWNoLnNjcmVlblgsdG91Y2hlcz4xXSA6IFt0b3VjaC5wYWdlWSx0b3VjaC5wYWdlWCx0b3VjaGVzPjFdO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHJldHVybiBvID8gW2UucGFnZVktb1swXStpb1swXSxlLnBhZ2VYLW9bMV0raW9bMV0sZmFsc2VdIDogW2UucGFnZVksZS5wYWdlWCxmYWxzZV07XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFxuXHRcdFxuXHRcdC8qIFxuXHRcdFNDUk9MTEJBUiBEUkFHIEVWRU5UU1xuXHRcdHNjcm9sbHMgY29udGVudCB2aWEgc2Nyb2xsYmFyIGRyYWdnaW5nIFxuXHRcdCovXG5cdFx0X2RyYWdnYWJsZT1mdW5jdGlvbigpe1xuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcblx0XHRcdFx0bmFtZXNwYWNlPXBsdWdpblBmeCtcIl9cIitkLmlkeCxcblx0XHRcdFx0ZHJhZ2dlcklkPVtcIm1DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl92ZXJ0aWNhbFwiLFwibUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIl0sXG5cdFx0XHRcdG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIiksXG5cdFx0XHRcdG1DU0JfZHJhZ2dlcj0kKFwiI1wiK2RyYWdnZXJJZFswXStcIiwjXCIrZHJhZ2dlcklkWzFdKSxcblx0XHRcdFx0ZHJhZ2dhYmxlLGRyYWdZLGRyYWdYLFxuXHRcdFx0XHRyZHM9by5hZHZhbmNlZC5yZWxlYXNlRHJhZ2dhYmxlU2VsZWN0b3JzID8gbUNTQl9kcmFnZ2VyLmFkZCgkKG8uYWR2YW5jZWQucmVsZWFzZURyYWdnYWJsZVNlbGVjdG9ycykpIDogbUNTQl9kcmFnZ2VyLFxuXHRcdFx0XHRlZHM9by5hZHZhbmNlZC5leHRyYURyYWdnYWJsZVNlbGVjdG9ycyA/ICQoIV9jYW5BY2Nlc3NJRnJhbWUoKSB8fCB0b3AuZG9jdW1lbnQpLmFkZCgkKG8uYWR2YW5jZWQuZXh0cmFEcmFnZ2FibGVTZWxlY3RvcnMpKSA6ICQoIV9jYW5BY2Nlc3NJRnJhbWUoKSB8fCB0b3AuZG9jdW1lbnQpO1xuXHRcdFx0bUNTQl9kcmFnZ2VyLmJpbmQoXCJjb250ZXh0bWVudS5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTsgLy9wcmV2ZW50IHJpZ2h0IGNsaWNrXG5cdFx0XHR9KS5iaW5kKFwibW91c2Vkb3duLlwiK25hbWVzcGFjZStcIiB0b3VjaHN0YXJ0LlwiK25hbWVzcGFjZStcIiBwb2ludGVyZG93bi5cIituYW1lc3BhY2UrXCIgTVNQb2ludGVyRG93bi5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0aWYoIV9tb3VzZUJ0bkxlZnQoZSkpe3JldHVybjt9IC8qIGxlZnQgbW91c2UgYnV0dG9uIG9ubHkgKi9cblx0XHRcdFx0dG91Y2hBY3RpdmU9dHJ1ZTtcblx0XHRcdFx0aWYob2xkSUUpe2RvY3VtZW50Lm9uc2VsZWN0c3RhcnQ9ZnVuY3Rpb24oKXtyZXR1cm4gZmFsc2U7fX0gLyogZGlzYWJsZSB0ZXh0IHNlbGVjdGlvbiBmb3IgSUUgPCA5ICovXG5cdFx0XHRcdF9pZnJhbWUuY2FsbChtQ1NCX2NvbnRhaW5lcixmYWxzZSk7IC8qIGVuYWJsZSBzY3JvbGxiYXIgZHJhZ2dpbmcgb3ZlciBpZnJhbWVzIGJ5IGRpc2FibGluZyB0aGVpciBldmVudHMgKi9cblx0XHRcdFx0X3N0b3AoJHRoaXMpO1xuXHRcdFx0XHRkcmFnZ2FibGU9JCh0aGlzKTtcblx0XHRcdFx0dmFyIG9mZnNldD1kcmFnZ2FibGUub2Zmc2V0KCkseT1fY29vcmRpbmF0ZXMoZSlbMF0tb2Zmc2V0LnRvcCx4PV9jb29yZGluYXRlcyhlKVsxXS1vZmZzZXQubGVmdCxcblx0XHRcdFx0XHRoPWRyYWdnYWJsZS5oZWlnaHQoKStvZmZzZXQudG9wLHc9ZHJhZ2dhYmxlLndpZHRoKCkrb2Zmc2V0LmxlZnQ7XG5cdFx0XHRcdGlmKHk8aCAmJiB5PjAgJiYgeDx3ICYmIHg+MCl7XG5cdFx0XHRcdFx0ZHJhZ1k9eTsgXG5cdFx0XHRcdFx0ZHJhZ1g9eDtcblx0XHRcdFx0fVxuXHRcdFx0XHRfb25EcmFnQ2xhc3NlcyhkcmFnZ2FibGUsXCJhY3RpdmVcIixvLmF1dG9FeHBhbmRTY3JvbGxiYXIpOyBcblx0XHRcdH0pLmJpbmQoXCJ0b3VjaG1vdmUuXCIrbmFtZXNwYWNlLGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBvZmZzZXQ9ZHJhZ2dhYmxlLm9mZnNldCgpLHk9X2Nvb3JkaW5hdGVzKGUpWzBdLW9mZnNldC50b3AseD1fY29vcmRpbmF0ZXMoZSlbMV0tb2Zmc2V0LmxlZnQ7XG5cdFx0XHRcdF9kcmFnKGRyYWdZLGRyYWdYLHkseCk7XG5cdFx0XHR9KTtcblx0XHRcdCQoZG9jdW1lbnQpLmFkZChlZHMpLmJpbmQoXCJtb3VzZW1vdmUuXCIrbmFtZXNwYWNlK1wiIHBvaW50ZXJtb3ZlLlwiK25hbWVzcGFjZStcIiBNU1BvaW50ZXJNb3ZlLlwiK25hbWVzcGFjZSxmdW5jdGlvbihlKXtcblx0XHRcdFx0aWYoZHJhZ2dhYmxlKXtcblx0XHRcdFx0XHR2YXIgb2Zmc2V0PWRyYWdnYWJsZS5vZmZzZXQoKSx5PV9jb29yZGluYXRlcyhlKVswXS1vZmZzZXQudG9wLHg9X2Nvb3JkaW5hdGVzKGUpWzFdLW9mZnNldC5sZWZ0O1xuXHRcdFx0XHRcdGlmKGRyYWdZPT09eSAmJiBkcmFnWD09PXgpe3JldHVybjt9IC8qIGhhcyBpdCByZWFsbHkgbW92ZWQ/ICovXG5cdFx0XHRcdFx0X2RyYWcoZHJhZ1ksZHJhZ1gseSx4KTtcblx0XHRcdFx0fVxuXHRcdFx0fSkuYWRkKHJkcykuYmluZChcIm1vdXNldXAuXCIrbmFtZXNwYWNlK1wiIHRvdWNoZW5kLlwiK25hbWVzcGFjZStcIiBwb2ludGVydXAuXCIrbmFtZXNwYWNlK1wiIE1TUG9pbnRlclVwLlwiK25hbWVzcGFjZSxmdW5jdGlvbihlKXtcblx0XHRcdFx0aWYoZHJhZ2dhYmxlKXtcblx0XHRcdFx0XHRfb25EcmFnQ2xhc3NlcyhkcmFnZ2FibGUsXCJhY3RpdmVcIixvLmF1dG9FeHBhbmRTY3JvbGxiYXIpOyBcblx0XHRcdFx0XHRkcmFnZ2FibGU9bnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0XHR0b3VjaEFjdGl2ZT1mYWxzZTtcblx0XHRcdFx0aWYob2xkSUUpe2RvY3VtZW50Lm9uc2VsZWN0c3RhcnQ9bnVsbDt9IC8qIGVuYWJsZSB0ZXh0IHNlbGVjdGlvbiBmb3IgSUUgPCA5ICovXG5cdFx0XHRcdF9pZnJhbWUuY2FsbChtQ1NCX2NvbnRhaW5lcix0cnVlKTsgLyogZW5hYmxlIGlmcmFtZXMgZXZlbnRzICovXG5cdFx0XHR9KTtcblx0XHRcdGZ1bmN0aW9uIF9kcmFnKGRyYWdZLGRyYWdYLHkseCl7XG5cdFx0XHRcdG1DU0JfY29udGFpbmVyWzBdLmlkbGVUaW1lcj1vLnNjcm9sbEluZXJ0aWE8MjMzID8gMjUwIDogMDtcblx0XHRcdFx0aWYoZHJhZ2dhYmxlLmF0dHIoXCJpZFwiKT09PWRyYWdnZXJJZFsxXSl7XG5cdFx0XHRcdFx0dmFyIGRpcj1cInhcIix0bz0oKGRyYWdnYWJsZVswXS5vZmZzZXRMZWZ0LWRyYWdYKSt4KSpkLnNjcm9sbFJhdGlvLng7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHZhciBkaXI9XCJ5XCIsdG89KChkcmFnZ2FibGVbMF0ub2Zmc2V0VG9wLWRyYWdZKSt5KSpkLnNjcm9sbFJhdGlvLnk7XG5cdFx0XHRcdH1cblx0XHRcdFx0X3Njcm9sbFRvKCR0aGlzLHRvLnRvU3RyaW5nKCkse2RpcjpkaXIsZHJhZzp0cnVlfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFxuXHRcdFxuXHRcdC8qIFxuXHRcdFRPVUNIIFNXSVBFIEVWRU5UU1xuXHRcdHNjcm9sbHMgY29udGVudCB2aWEgdG91Y2ggc3dpcGUgXG5cdFx0RW11bGF0ZXMgdGhlIG5hdGl2ZSB0b3VjaC1zd2lwZSBzY3JvbGxpbmcgd2l0aCBtb21lbnR1bSBmb3VuZCBpbiBpT1MsIEFuZHJvaWQgYW5kIFdQIGRldmljZXMgXG5cdFx0Ki9cblx0XHRfY29udGVudERyYWdnYWJsZT1mdW5jdGlvbigpe1xuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcblx0XHRcdFx0bmFtZXNwYWNlPXBsdWdpblBmeCtcIl9cIitkLmlkeCxcblx0XHRcdFx0bUN1c3RvbVNjcm9sbEJveD0kKFwiI21DU0JfXCIrZC5pZHgpLFxuXHRcdFx0XHRtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLFxuXHRcdFx0XHRtQ1NCX2RyYWdnZXI9WyQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX3ZlcnRpY2FsXCIpLCQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIildLFxuXHRcdFx0XHRkcmFnZ2FibGUsZHJhZ1ksZHJhZ1gsdG91Y2hTdGFydFksdG91Y2hTdGFydFgsdG91Y2hNb3ZlWT1bXSx0b3VjaE1vdmVYPVtdLHN0YXJ0VGltZSxydW5uaW5nVGltZSxlbmRUaW1lLGRpc3RhbmNlLHNwZWVkLGFtb3VudCxcblx0XHRcdFx0ZHVyQT0wLGR1ckIsb3ZlcndyaXRlPW8uYXhpcz09PVwieXhcIiA/IFwibm9uZVwiIDogXCJhbGxcIix0b3VjaEludGVudD1bXSx0b3VjaERyYWcsZG9jRHJhZyxcblx0XHRcdFx0aWZyYW1lPW1DU0JfY29udGFpbmVyLmZpbmQoXCJpZnJhbWVcIiksXG5cdFx0XHRcdGV2ZW50cz1bXG5cdFx0XHRcdFx0XCJ0b3VjaHN0YXJ0LlwiK25hbWVzcGFjZStcIiBwb2ludGVyZG93bi5cIituYW1lc3BhY2UrXCIgTVNQb2ludGVyRG93bi5cIituYW1lc3BhY2UsIC8vc3RhcnRcblx0XHRcdFx0XHRcInRvdWNobW92ZS5cIituYW1lc3BhY2UrXCIgcG9pbnRlcm1vdmUuXCIrbmFtZXNwYWNlK1wiIE1TUG9pbnRlck1vdmUuXCIrbmFtZXNwYWNlLCAvL21vdmVcblx0XHRcdFx0XHRcInRvdWNoZW5kLlwiK25hbWVzcGFjZStcIiBwb2ludGVydXAuXCIrbmFtZXNwYWNlK1wiIE1TUG9pbnRlclVwLlwiK25hbWVzcGFjZSAvL2VuZFxuXHRcdFx0XHRdLFxuXHRcdFx0XHR0b3VjaEFjdGlvbj1kb2N1bWVudC5ib2R5LnN0eWxlLnRvdWNoQWN0aW9uIT09dW5kZWZpbmVkICYmIGRvY3VtZW50LmJvZHkuc3R5bGUudG91Y2hBY3Rpb24hPT1cIlwiO1xuXHRcdFx0bUNTQl9jb250YWluZXIuYmluZChldmVudHNbMF0sZnVuY3Rpb24oZSl7XG5cdFx0XHRcdF9vblRvdWNoc3RhcnQoZSk7XG5cdFx0XHR9KS5iaW5kKGV2ZW50c1sxXSxmdW5jdGlvbihlKXtcblx0XHRcdFx0X29uVG91Y2htb3ZlKGUpO1xuXHRcdFx0fSk7XG5cdFx0XHRtQ3VzdG9tU2Nyb2xsQm94LmJpbmQoZXZlbnRzWzBdLGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRfb25Ub3VjaHN0YXJ0MihlKTtcblx0XHRcdH0pLmJpbmQoZXZlbnRzWzJdLGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRfb25Ub3VjaGVuZChlKTtcblx0XHRcdH0pO1xuXHRcdFx0aWYoaWZyYW1lLmxlbmd0aCl7XG5cdFx0XHRcdGlmcmFtZS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0JCh0aGlzKS5iaW5kKFwibG9hZFwiLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHQvKiBiaW5kIGV2ZW50cyBvbiBhY2Nlc3NpYmxlIGlmcmFtZXMgKi9cblx0XHRcdFx0XHRcdGlmKF9jYW5BY2Nlc3NJRnJhbWUodGhpcykpe1xuXHRcdFx0XHRcdFx0XHQkKHRoaXMuY29udGVudERvY3VtZW50IHx8IHRoaXMuY29udGVudFdpbmRvdy5kb2N1bWVudCkuYmluZChldmVudHNbMF0sZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0XHRcdFx0X29uVG91Y2hzdGFydChlKTtcblx0XHRcdFx0XHRcdFx0XHRfb25Ub3VjaHN0YXJ0MihlKTtcblx0XHRcdFx0XHRcdFx0fSkuYmluZChldmVudHNbMV0sZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0XHRcdFx0X29uVG91Y2htb3ZlKGUpO1xuXHRcdFx0XHRcdFx0XHR9KS5iaW5kKGV2ZW50c1syXSxmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRcdFx0XHRfb25Ub3VjaGVuZChlKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZnVuY3Rpb24gX29uVG91Y2hzdGFydChlKXtcblx0XHRcdFx0aWYoIV9wb2ludGVyVG91Y2goZSkgfHwgdG91Y2hBY3RpdmUgfHwgX2Nvb3JkaW5hdGVzKGUpWzJdKXt0b3VjaGFibGU9MDsgcmV0dXJuO31cblx0XHRcdFx0dG91Y2hhYmxlPTE7IHRvdWNoRHJhZz0wOyBkb2NEcmFnPTA7IGRyYWdnYWJsZT0xO1xuXHRcdFx0XHQkdGhpcy5yZW1vdmVDbGFzcyhcIm1DU190b3VjaF9hY3Rpb25cIik7XG5cdFx0XHRcdHZhciBvZmZzZXQ9bUNTQl9jb250YWluZXIub2Zmc2V0KCk7XG5cdFx0XHRcdGRyYWdZPV9jb29yZGluYXRlcyhlKVswXS1vZmZzZXQudG9wO1xuXHRcdFx0XHRkcmFnWD1fY29vcmRpbmF0ZXMoZSlbMV0tb2Zmc2V0LmxlZnQ7XG5cdFx0XHRcdHRvdWNoSW50ZW50PVtfY29vcmRpbmF0ZXMoZSlbMF0sX2Nvb3JkaW5hdGVzKGUpWzFdXTtcblx0XHRcdH1cblx0XHRcdGZ1bmN0aW9uIF9vblRvdWNobW92ZShlKXtcblx0XHRcdFx0aWYoIV9wb2ludGVyVG91Y2goZSkgfHwgdG91Y2hBY3RpdmUgfHwgX2Nvb3JkaW5hdGVzKGUpWzJdKXtyZXR1cm47fVxuXHRcdFx0XHRpZighby5kb2N1bWVudFRvdWNoU2Nyb2xsKXtlLnByZXZlbnREZWZhdWx0KCk7fSBcblx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0aWYoZG9jRHJhZyAmJiAhdG91Y2hEcmFnKXtyZXR1cm47fVxuXHRcdFx0XHRpZihkcmFnZ2FibGUpe1xuXHRcdFx0XHRcdHJ1bm5pbmdUaW1lPV9nZXRUaW1lKCk7XG5cdFx0XHRcdFx0dmFyIG9mZnNldD1tQ3VzdG9tU2Nyb2xsQm94Lm9mZnNldCgpLHk9X2Nvb3JkaW5hdGVzKGUpWzBdLW9mZnNldC50b3AseD1fY29vcmRpbmF0ZXMoZSlbMV0tb2Zmc2V0LmxlZnQsXG5cdFx0XHRcdFx0XHRlYXNpbmc9XCJtY3NMaW5lYXJPdXRcIjtcblx0XHRcdFx0XHR0b3VjaE1vdmVZLnB1c2goeSk7XG5cdFx0XHRcdFx0dG91Y2hNb3ZlWC5wdXNoKHgpO1xuXHRcdFx0XHRcdHRvdWNoSW50ZW50WzJdPU1hdGguYWJzKF9jb29yZGluYXRlcyhlKVswXS10b3VjaEludGVudFswXSk7IHRvdWNoSW50ZW50WzNdPU1hdGguYWJzKF9jb29yZGluYXRlcyhlKVsxXS10b3VjaEludGVudFsxXSk7XG5cdFx0XHRcdFx0aWYoZC5vdmVyZmxvd2VkWzBdKXtcblx0XHRcdFx0XHRcdHZhciBsaW1pdD1tQ1NCX2RyYWdnZXJbMF0ucGFyZW50KCkuaGVpZ2h0KCktbUNTQl9kcmFnZ2VyWzBdLmhlaWdodCgpLFxuXHRcdFx0XHRcdFx0XHRwcmV2ZW50PSgoZHJhZ1kteSk+MCAmJiAoeS1kcmFnWSk+LShsaW1pdCpkLnNjcm9sbFJhdGlvLnkpICYmICh0b3VjaEludGVudFszXSoyPHRvdWNoSW50ZW50WzJdIHx8IG8uYXhpcz09PVwieXhcIikpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihkLm92ZXJmbG93ZWRbMV0pe1xuXHRcdFx0XHRcdFx0dmFyIGxpbWl0WD1tQ1NCX2RyYWdnZXJbMV0ucGFyZW50KCkud2lkdGgoKS1tQ1NCX2RyYWdnZXJbMV0ud2lkdGgoKSxcblx0XHRcdFx0XHRcdFx0cHJldmVudFg9KChkcmFnWC14KT4wICYmICh4LWRyYWdYKT4tKGxpbWl0WCpkLnNjcm9sbFJhdGlvLngpICYmICh0b3VjaEludGVudFsyXSoyPHRvdWNoSW50ZW50WzNdIHx8IG8uYXhpcz09PVwieXhcIikpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRpZihwcmV2ZW50IHx8IHByZXZlbnRYKXsgLyogcHJldmVudCBuYXRpdmUgZG9jdW1lbnQgc2Nyb2xsaW5nICovXG5cdFx0XHRcdFx0XHRpZighdG91Y2hBY3Rpb24pe2UucHJldmVudERlZmF1bHQoKTt9IFxuXHRcdFx0XHRcdFx0dG91Y2hEcmFnPTE7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRkb2NEcmFnPTE7XG5cdFx0XHRcdFx0XHQkdGhpcy5hZGRDbGFzcyhcIm1DU190b3VjaF9hY3Rpb25cIik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKHRvdWNoQWN0aW9uKXtlLnByZXZlbnREZWZhdWx0KCk7fSBcblx0XHRcdFx0XHRhbW91bnQ9by5heGlzPT09XCJ5eFwiID8gWyhkcmFnWS15KSwoZHJhZ1gteCldIDogby5heGlzPT09XCJ4XCIgPyBbbnVsbCwoZHJhZ1gteCldIDogWyhkcmFnWS15KSxudWxsXTtcblx0XHRcdFx0XHRtQ1NCX2NvbnRhaW5lclswXS5pZGxlVGltZXI9MjUwO1xuXHRcdFx0XHRcdGlmKGQub3ZlcmZsb3dlZFswXSl7X2RyYWcoYW1vdW50WzBdLGR1ckEsZWFzaW5nLFwieVwiLFwiYWxsXCIsdHJ1ZSk7fVxuXHRcdFx0XHRcdGlmKGQub3ZlcmZsb3dlZFsxXSl7X2RyYWcoYW1vdW50WzFdLGR1ckEsZWFzaW5nLFwieFwiLG92ZXJ3cml0ZSx0cnVlKTt9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGZ1bmN0aW9uIF9vblRvdWNoc3RhcnQyKGUpe1xuXHRcdFx0XHRpZighX3BvaW50ZXJUb3VjaChlKSB8fCB0b3VjaEFjdGl2ZSB8fCBfY29vcmRpbmF0ZXMoZSlbMl0pe3RvdWNoYWJsZT0wOyByZXR1cm47fVxuXHRcdFx0XHR0b3VjaGFibGU9MTtcblx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0X3N0b3AoJHRoaXMpO1xuXHRcdFx0XHRzdGFydFRpbWU9X2dldFRpbWUoKTtcblx0XHRcdFx0dmFyIG9mZnNldD1tQ3VzdG9tU2Nyb2xsQm94Lm9mZnNldCgpO1xuXHRcdFx0XHR0b3VjaFN0YXJ0WT1fY29vcmRpbmF0ZXMoZSlbMF0tb2Zmc2V0LnRvcDtcblx0XHRcdFx0dG91Y2hTdGFydFg9X2Nvb3JkaW5hdGVzKGUpWzFdLW9mZnNldC5sZWZ0O1xuXHRcdFx0XHR0b3VjaE1vdmVZPVtdOyB0b3VjaE1vdmVYPVtdO1xuXHRcdFx0fVxuXHRcdFx0ZnVuY3Rpb24gX29uVG91Y2hlbmQoZSl7XG5cdFx0XHRcdGlmKCFfcG9pbnRlclRvdWNoKGUpIHx8IHRvdWNoQWN0aXZlIHx8IF9jb29yZGluYXRlcyhlKVsyXSl7cmV0dXJuO31cblx0XHRcdFx0ZHJhZ2dhYmxlPTA7XG5cdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdHRvdWNoRHJhZz0wOyBkb2NEcmFnPTA7XG5cdFx0XHRcdGVuZFRpbWU9X2dldFRpbWUoKTtcblx0XHRcdFx0dmFyIG9mZnNldD1tQ3VzdG9tU2Nyb2xsQm94Lm9mZnNldCgpLHk9X2Nvb3JkaW5hdGVzKGUpWzBdLW9mZnNldC50b3AseD1fY29vcmRpbmF0ZXMoZSlbMV0tb2Zmc2V0LmxlZnQ7XG5cdFx0XHRcdGlmKChlbmRUaW1lLXJ1bm5pbmdUaW1lKT4zMCl7cmV0dXJuO31cblx0XHRcdFx0c3BlZWQ9MTAwMC8oZW5kVGltZS1zdGFydFRpbWUpO1xuXHRcdFx0XHR2YXIgZWFzaW5nPVwibWNzRWFzZU91dFwiLHNsb3c9c3BlZWQ8Mi41LFxuXHRcdFx0XHRcdGRpZmY9c2xvdyA/IFt0b3VjaE1vdmVZW3RvdWNoTW92ZVkubGVuZ3RoLTJdLHRvdWNoTW92ZVhbdG91Y2hNb3ZlWC5sZW5ndGgtMl1dIDogWzAsMF07XG5cdFx0XHRcdGRpc3RhbmNlPXNsb3cgPyBbKHktZGlmZlswXSksKHgtZGlmZlsxXSldIDogW3ktdG91Y2hTdGFydFkseC10b3VjaFN0YXJ0WF07XG5cdFx0XHRcdHZhciBhYnNEaXN0YW5jZT1bTWF0aC5hYnMoZGlzdGFuY2VbMF0pLE1hdGguYWJzKGRpc3RhbmNlWzFdKV07XG5cdFx0XHRcdHNwZWVkPXNsb3cgPyBbTWF0aC5hYnMoZGlzdGFuY2VbMF0vNCksTWF0aC5hYnMoZGlzdGFuY2VbMV0vNCldIDogW3NwZWVkLHNwZWVkXTtcblx0XHRcdFx0dmFyIGE9W1xuXHRcdFx0XHRcdE1hdGguYWJzKG1DU0JfY29udGFpbmVyWzBdLm9mZnNldFRvcCktKGRpc3RhbmNlWzBdKl9tKChhYnNEaXN0YW5jZVswXS9zcGVlZFswXSksc3BlZWRbMF0pKSxcblx0XHRcdFx0XHRNYXRoLmFicyhtQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRMZWZ0KS0oZGlzdGFuY2VbMV0qX20oKGFic0Rpc3RhbmNlWzFdL3NwZWVkWzFdKSxzcGVlZFsxXSkpXG5cdFx0XHRcdF07XG5cdFx0XHRcdGFtb3VudD1vLmF4aXM9PT1cInl4XCIgPyBbYVswXSxhWzFdXSA6IG8uYXhpcz09PVwieFwiID8gW251bGwsYVsxXV0gOiBbYVswXSxudWxsXTtcblx0XHRcdFx0ZHVyQj1bKGFic0Rpc3RhbmNlWzBdKjQpK28uc2Nyb2xsSW5lcnRpYSwoYWJzRGlzdGFuY2VbMV0qNCkrby5zY3JvbGxJbmVydGlhXTtcblx0XHRcdFx0dmFyIG1kPXBhcnNlSW50KG8uY29udGVudFRvdWNoU2Nyb2xsKSB8fCAwOyAvKiBhYnNvbHV0ZSBtaW5pbXVtIGRpc3RhbmNlIHJlcXVpcmVkICovXG5cdFx0XHRcdGFtb3VudFswXT1hYnNEaXN0YW5jZVswXT5tZCA/IGFtb3VudFswXSA6IDA7XG5cdFx0XHRcdGFtb3VudFsxXT1hYnNEaXN0YW5jZVsxXT5tZCA/IGFtb3VudFsxXSA6IDA7XG5cdFx0XHRcdGlmKGQub3ZlcmZsb3dlZFswXSl7X2RyYWcoYW1vdW50WzBdLGR1ckJbMF0sZWFzaW5nLFwieVwiLG92ZXJ3cml0ZSxmYWxzZSk7fVxuXHRcdFx0XHRpZihkLm92ZXJmbG93ZWRbMV0pe19kcmFnKGFtb3VudFsxXSxkdXJCWzFdLGVhc2luZyxcInhcIixvdmVyd3JpdGUsZmFsc2UpO31cblx0XHRcdH1cblx0XHRcdGZ1bmN0aW9uIF9tKGRzLHMpe1xuXHRcdFx0XHR2YXIgcj1bcyoxLjUscyoyLHMvMS41LHMvMl07XG5cdFx0XHRcdGlmKGRzPjkwKXtcblx0XHRcdFx0XHRyZXR1cm4gcz40ID8gclswXSA6IHJbM107XG5cdFx0XHRcdH1lbHNlIGlmKGRzPjYwKXtcblx0XHRcdFx0XHRyZXR1cm4gcz4zID8gclszXSA6IHJbMl07XG5cdFx0XHRcdH1lbHNlIGlmKGRzPjMwKXtcblx0XHRcdFx0XHRyZXR1cm4gcz44ID8gclsxXSA6IHM+NiA/IHJbMF0gOiBzPjQgPyBzIDogclsyXTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0cmV0dXJuIHM+OCA/IHMgOiByWzNdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRmdW5jdGlvbiBfZHJhZyhhbW91bnQsZHVyLGVhc2luZyxkaXIsb3ZlcndyaXRlLGRyYWcpe1xuXHRcdFx0XHRpZighYW1vdW50KXtyZXR1cm47fVxuXHRcdFx0XHRfc2Nyb2xsVG8oJHRoaXMsYW1vdW50LnRvU3RyaW5nKCkse2R1cjpkdXIsc2Nyb2xsRWFzaW5nOmVhc2luZyxkaXI6ZGlyLG92ZXJ3cml0ZTpvdmVyd3JpdGUsZHJhZzpkcmFnfSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFxuXHRcdFxuXHRcdC8qIFxuXHRcdFNFTEVDVCBURVhUIEVWRU5UUyBcblx0XHRzY3JvbGxzIGNvbnRlbnQgd2hlbiB0ZXh0IGlzIHNlbGVjdGVkIFxuXHRcdCovXG5cdFx0X3NlbGVjdGFibGU9ZnVuY3Rpb24oKXtcblx0XHRcdHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsc2VxPWQuc2VxdWVudGlhbCxcblx0XHRcdFx0bmFtZXNwYWNlPXBsdWdpblBmeCtcIl9cIitkLmlkeCxcblx0XHRcdFx0bUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcblx0XHRcdFx0d3JhcHBlcj1tQ1NCX2NvbnRhaW5lci5wYXJlbnQoKSxcblx0XHRcdFx0YWN0aW9uO1xuXHRcdFx0bUNTQl9jb250YWluZXIuYmluZChcIm1vdXNlZG93bi5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGlmKHRvdWNoYWJsZSl7cmV0dXJuO31cblx0XHRcdFx0aWYoIWFjdGlvbil7YWN0aW9uPTE7IHRvdWNoQWN0aXZlPXRydWU7fVxuXHRcdFx0fSkuYWRkKGRvY3VtZW50KS5iaW5kKFwibW91c2Vtb3ZlLlwiK25hbWVzcGFjZSxmdW5jdGlvbihlKXtcblx0XHRcdFx0aWYoIXRvdWNoYWJsZSAmJiBhY3Rpb24gJiYgX3NlbCgpKXtcblx0XHRcdFx0XHR2YXIgb2Zmc2V0PW1DU0JfY29udGFpbmVyLm9mZnNldCgpLFxuXHRcdFx0XHRcdFx0eT1fY29vcmRpbmF0ZXMoZSlbMF0tb2Zmc2V0LnRvcCttQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRUb3AseD1fY29vcmRpbmF0ZXMoZSlbMV0tb2Zmc2V0LmxlZnQrbUNTQl9jb250YWluZXJbMF0ub2Zmc2V0TGVmdDtcblx0XHRcdFx0XHRpZih5PjAgJiYgeTx3cmFwcGVyLmhlaWdodCgpICYmIHg+MCAmJiB4PHdyYXBwZXIud2lkdGgoKSl7XG5cdFx0XHRcdFx0XHRpZihzZXEuc3RlcCl7X3NlcShcIm9mZlwiLG51bGwsXCJzdGVwcGVkXCIpO31cblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdGlmKG8uYXhpcyE9PVwieFwiICYmIGQub3ZlcmZsb3dlZFswXSl7XG5cdFx0XHRcdFx0XHRcdGlmKHk8MCl7XG5cdFx0XHRcdFx0XHRcdFx0X3NlcShcIm9uXCIsMzgpO1xuXHRcdFx0XHRcdFx0XHR9ZWxzZSBpZih5PndyYXBwZXIuaGVpZ2h0KCkpe1xuXHRcdFx0XHRcdFx0XHRcdF9zZXEoXCJvblwiLDQwKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYoby5heGlzIT09XCJ5XCIgJiYgZC5vdmVyZmxvd2VkWzFdKXtcblx0XHRcdFx0XHRcdFx0aWYoeDwwKXtcblx0XHRcdFx0XHRcdFx0XHRfc2VxKFwib25cIiwzNyk7XG5cdFx0XHRcdFx0XHRcdH1lbHNlIGlmKHg+d3JhcHBlci53aWR0aCgpKXtcblx0XHRcdFx0XHRcdFx0XHRfc2VxKFwib25cIiwzOSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pLmJpbmQoXCJtb3VzZXVwLlwiK25hbWVzcGFjZStcIiBkcmFnZW5kLlwiK25hbWVzcGFjZSxmdW5jdGlvbihlKXtcblx0XHRcdFx0aWYodG91Y2hhYmxlKXtyZXR1cm47fVxuXHRcdFx0XHRpZihhY3Rpb24pe2FjdGlvbj0wOyBfc2VxKFwib2ZmXCIsbnVsbCk7fVxuXHRcdFx0XHR0b3VjaEFjdGl2ZT1mYWxzZTtcblx0XHRcdH0pO1xuXHRcdFx0ZnVuY3Rpb24gX3NlbCgpe1xuXHRcdFx0XHRyZXR1cm4gXHR3aW5kb3cuZ2V0U2VsZWN0aW9uID8gd2luZG93LmdldFNlbGVjdGlvbigpLnRvU3RyaW5nKCkgOiBcblx0XHRcdFx0XHRcdGRvY3VtZW50LnNlbGVjdGlvbiAmJiBkb2N1bWVudC5zZWxlY3Rpb24udHlwZSE9XCJDb250cm9sXCIgPyBkb2N1bWVudC5zZWxlY3Rpb24uY3JlYXRlUmFuZ2UoKS50ZXh0IDogMDtcblx0XHRcdH1cblx0XHRcdGZ1bmN0aW9uIF9zZXEoYSxjLHMpe1xuXHRcdFx0XHRzZXEudHlwZT1zICYmIGFjdGlvbiA/IFwic3RlcHBlZFwiIDogXCJzdGVwbGVzc1wiO1xuXHRcdFx0XHRzZXEuc2Nyb2xsQW1vdW50PTEwO1xuXHRcdFx0XHRfc2VxdWVudGlhbFNjcm9sbCgkdGhpcyxhLGMsXCJtY3NMaW5lYXJPdXRcIixzID8gNjAgOiBudWxsKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XG5cdFx0XG5cdFx0LyogXG5cdFx0TU9VU0UgV0hFRUwgRVZFTlRcblx0XHRzY3JvbGxzIGNvbnRlbnQgdmlhIG1vdXNlLXdoZWVsIFxuXHRcdHZpYSBtb3VzZS13aGVlbCBwbHVnaW4gKGh0dHBzOi8vZ2l0aHViLmNvbS9icmFuZG9uYWFyb24vanF1ZXJ5LW1vdXNld2hlZWwpXG5cdFx0Ki9cblx0XHRfbW91c2V3aGVlbD1mdW5jdGlvbigpe1xuXHRcdFx0aWYoISQodGhpcykuZGF0YShwbHVnaW5QZngpKXtyZXR1cm47fSAvKiBDaGVjayBpZiB0aGUgc2Nyb2xsYmFyIGlzIHJlYWR5IHRvIHVzZSBtb3VzZXdoZWVsIGV2ZW50cyAoaXNzdWU6ICMxODUpICovXG5cdFx0XHR2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxuXHRcdFx0XHRuYW1lc3BhY2U9cGx1Z2luUGZ4K1wiX1wiK2QuaWR4LFxuXHRcdFx0XHRtQ3VzdG9tU2Nyb2xsQm94PSQoXCIjbUNTQl9cIitkLmlkeCksXG5cdFx0XHRcdG1DU0JfZHJhZ2dlcj1bJChcIiNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfdmVydGljYWxcIiksJChcIiNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfaG9yaXpvbnRhbFwiKV0sXG5cdFx0XHRcdGlmcmFtZT0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLmZpbmQoXCJpZnJhbWVcIik7XG5cdFx0XHRpZihpZnJhbWUubGVuZ3RoKXtcblx0XHRcdFx0aWZyYW1lLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQkKHRoaXMpLmJpbmQoXCJsb2FkXCIsZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRcdC8qIGJpbmQgZXZlbnRzIG9uIGFjY2Vzc2libGUgaWZyYW1lcyAqL1xuXHRcdFx0XHRcdFx0aWYoX2NhbkFjY2Vzc0lGcmFtZSh0aGlzKSl7XG5cdFx0XHRcdFx0XHRcdCQodGhpcy5jb250ZW50RG9jdW1lbnQgfHwgdGhpcy5jb250ZW50V2luZG93LmRvY3VtZW50KS5iaW5kKFwibW91c2V3aGVlbC5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSxkZWx0YSl7XG5cdFx0XHRcdFx0XHRcdFx0X29uTW91c2V3aGVlbChlLGRlbHRhKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0bUN1c3RvbVNjcm9sbEJveC5iaW5kKFwibW91c2V3aGVlbC5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSxkZWx0YSl7XG5cdFx0XHRcdF9vbk1vdXNld2hlZWwoZSxkZWx0YSk7XG5cdFx0XHR9KTtcblx0XHRcdGZ1bmN0aW9uIF9vbk1vdXNld2hlZWwoZSxkZWx0YSl7XG5cdFx0XHRcdF9zdG9wKCR0aGlzKTtcblx0XHRcdFx0aWYoX2Rpc2FibGVNb3VzZXdoZWVsKCR0aGlzLGUudGFyZ2V0KSl7cmV0dXJuO30gLyogZGlzYWJsZXMgbW91c2Utd2hlZWwgd2hlbiBob3ZlcmluZyBzcGVjaWZpYyBlbGVtZW50cyAqL1xuXHRcdFx0XHR2YXIgZGVsdGFGYWN0b3I9by5tb3VzZVdoZWVsLmRlbHRhRmFjdG9yIT09XCJhdXRvXCIgPyBwYXJzZUludChvLm1vdXNlV2hlZWwuZGVsdGFGYWN0b3IpIDogKG9sZElFICYmIGUuZGVsdGFGYWN0b3I8MTAwKSA/IDEwMCA6IGUuZGVsdGFGYWN0b3IgfHwgMTAwLFxuXHRcdFx0XHRcdGR1cj1vLnNjcm9sbEluZXJ0aWE7XG5cdFx0XHRcdGlmKG8uYXhpcz09PVwieFwiIHx8IG8ubW91c2VXaGVlbC5heGlzPT09XCJ4XCIpe1xuXHRcdFx0XHRcdHZhciBkaXI9XCJ4XCIsXG5cdFx0XHRcdFx0XHRweD1bTWF0aC5yb3VuZChkZWx0YUZhY3RvcipkLnNjcm9sbFJhdGlvLngpLHBhcnNlSW50KG8ubW91c2VXaGVlbC5zY3JvbGxBbW91bnQpXSxcblx0XHRcdFx0XHRcdGFtb3VudD1vLm1vdXNlV2hlZWwuc2Nyb2xsQW1vdW50IT09XCJhdXRvXCIgPyBweFsxXSA6IHB4WzBdPj1tQ3VzdG9tU2Nyb2xsQm94LndpZHRoKCkgPyBtQ3VzdG9tU2Nyb2xsQm94LndpZHRoKCkqMC45IDogcHhbMF0sXG5cdFx0XHRcdFx0XHRjb250ZW50UG9zPU1hdGguYWJzKCQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIilbMF0ub2Zmc2V0TGVmdCksXG5cdFx0XHRcdFx0XHRkcmFnZ2VyUG9zPW1DU0JfZHJhZ2dlclsxXVswXS5vZmZzZXRMZWZ0LFxuXHRcdFx0XHRcdFx0bGltaXQ9bUNTQl9kcmFnZ2VyWzFdLnBhcmVudCgpLndpZHRoKCktbUNTQl9kcmFnZ2VyWzFdLndpZHRoKCksXG5cdFx0XHRcdFx0XHRkbHQ9by5tb3VzZVdoZWVsLmF4aXM9PT1cInlcIiA/IChlLmRlbHRhWSB8fCBkZWx0YSkgOiBlLmRlbHRhWDtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0dmFyIGRpcj1cInlcIixcblx0XHRcdFx0XHRcdHB4PVtNYXRoLnJvdW5kKGRlbHRhRmFjdG9yKmQuc2Nyb2xsUmF0aW8ueSkscGFyc2VJbnQoby5tb3VzZVdoZWVsLnNjcm9sbEFtb3VudCldLFxuXHRcdFx0XHRcdFx0YW1vdW50PW8ubW91c2VXaGVlbC5zY3JvbGxBbW91bnQhPT1cImF1dG9cIiA/IHB4WzFdIDogcHhbMF0+PW1DdXN0b21TY3JvbGxCb3guaGVpZ2h0KCkgPyBtQ3VzdG9tU2Nyb2xsQm94LmhlaWdodCgpKjAuOSA6IHB4WzBdLFxuXHRcdFx0XHRcdFx0Y29udGVudFBvcz1NYXRoLmFicygkKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpWzBdLm9mZnNldFRvcCksXG5cdFx0XHRcdFx0XHRkcmFnZ2VyUG9zPW1DU0JfZHJhZ2dlclswXVswXS5vZmZzZXRUb3AsXG5cdFx0XHRcdFx0XHRsaW1pdD1tQ1NCX2RyYWdnZXJbMF0ucGFyZW50KCkuaGVpZ2h0KCktbUNTQl9kcmFnZ2VyWzBdLmhlaWdodCgpLFxuXHRcdFx0XHRcdFx0ZGx0PWUuZGVsdGFZIHx8IGRlbHRhO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKChkaXI9PT1cInlcIiAmJiAhZC5vdmVyZmxvd2VkWzBdKSB8fCAoZGlyPT09XCJ4XCIgJiYgIWQub3ZlcmZsb3dlZFsxXSkpe3JldHVybjt9XG5cdFx0XHRcdGlmKG8ubW91c2VXaGVlbC5pbnZlcnQgfHwgZS53ZWJraXREaXJlY3Rpb25JbnZlcnRlZEZyb21EZXZpY2Upe2RsdD0tZGx0O31cblx0XHRcdFx0aWYoby5tb3VzZVdoZWVsLm5vcm1hbGl6ZURlbHRhKXtkbHQ9ZGx0PDAgPyAtMSA6IDE7fVxuXHRcdFx0XHRpZigoZGx0PjAgJiYgZHJhZ2dlclBvcyE9PTApIHx8IChkbHQ8MCAmJiBkcmFnZ2VyUG9zIT09bGltaXQpIHx8IG8ubW91c2VXaGVlbC5wcmV2ZW50RGVmYXVsdCl7XG5cdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoZS5kZWx0YUZhY3Rvcjw1ICYmICFvLm1vdXNlV2hlZWwubm9ybWFsaXplRGVsdGEpe1xuXHRcdFx0XHRcdC8vdmVyeSBsb3cgZGVsdGFGYWN0b3IgdmFsdWVzIG1lYW4gc29tZSBraW5kIG9mIGRlbHRhIGFjY2VsZXJhdGlvbiAoZS5nLiBvc3ggdHJhY2twYWQpLCBzbyBhZGp1c3Rpbmcgc2Nyb2xsaW5nIGFjY29yZGluZ2x5XG5cdFx0XHRcdFx0YW1vdW50PWUuZGVsdGFGYWN0b3I7IGR1cj0xNztcblx0XHRcdFx0fVxuXHRcdFx0XHRfc2Nyb2xsVG8oJHRoaXMsKGNvbnRlbnRQb3MtKGRsdCphbW91bnQpKS50b1N0cmluZygpLHtkaXI6ZGlyLGR1cjpkdXJ9KTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XG5cdFx0XG5cdFx0LyogY2hlY2tzIGlmIGlmcmFtZSBjYW4gYmUgYWNjZXNzZWQgKi9cblx0XHRfY2FuQWNjZXNzSUZyYW1lQ2FjaGU9bmV3IE9iamVjdCgpLFxuXHRcdF9jYW5BY2Nlc3NJRnJhbWU9ZnVuY3Rpb24oaWZyYW1lKXtcblx0XHQgICAgdmFyIHJlc3VsdD1mYWxzZSxjYWNoZUtleT1mYWxzZSxodG1sPW51bGw7XG5cdFx0ICAgIGlmKGlmcmFtZT09PXVuZGVmaW5lZCl7XG5cdFx0XHRcdGNhY2hlS2V5PVwiI2VtcHR5XCI7XG5cdFx0ICAgIH1lbHNlIGlmKCQoaWZyYW1lKS5hdHRyKFwiaWRcIikhPT11bmRlZmluZWQpe1xuXHRcdFx0XHRjYWNoZUtleT0kKGlmcmFtZSkuYXR0cihcImlkXCIpO1xuXHRcdCAgICB9XG5cdFx0XHRpZihjYWNoZUtleSE9PWZhbHNlICYmIF9jYW5BY2Nlc3NJRnJhbWVDYWNoZVtjYWNoZUtleV0hPT11bmRlZmluZWQpe1xuXHRcdFx0XHRyZXR1cm4gX2NhbkFjY2Vzc0lGcmFtZUNhY2hlW2NhY2hlS2V5XTtcblx0XHRcdH1cblx0XHRcdGlmKCFpZnJhbWUpe1xuXHRcdFx0XHR0cnl7XG5cdFx0XHRcdFx0dmFyIGRvYz10b3AuZG9jdW1lbnQ7XG5cdFx0XHRcdFx0aHRtbD1kb2MuYm9keS5pbm5lckhUTUw7XG5cdFx0XHRcdH1jYXRjaChlcnIpey8qIGRvIG5vdGhpbmcgKi99XG5cdFx0XHRcdHJlc3VsdD0oaHRtbCE9PW51bGwpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHRyeXtcblx0XHRcdFx0XHR2YXIgZG9jPWlmcmFtZS5jb250ZW50RG9jdW1lbnQgfHwgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG5cdFx0XHRcdFx0aHRtbD1kb2MuYm9keS5pbm5lckhUTUw7XG5cdFx0XHRcdH1jYXRjaChlcnIpey8qIGRvIG5vdGhpbmcgKi99XG5cdFx0XHRcdHJlc3VsdD0oaHRtbCE9PW51bGwpO1xuXHRcdFx0fVxuXHRcdFx0aWYoY2FjaGVLZXkhPT1mYWxzZSl7X2NhbkFjY2Vzc0lGcmFtZUNhY2hlW2NhY2hlS2V5XT1yZXN1bHQ7fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9LFxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XG5cdFx0XG5cdFx0Lyogc3dpdGNoZXMgaWZyYW1lJ3MgcG9pbnRlci1ldmVudHMgcHJvcGVydHkgKGRyYWcsIG1vdXNld2hlZWwgZXRjLiBvdmVyIGNyb3NzLWRvbWFpbiBpZnJhbWVzKSAqL1xuXHRcdF9pZnJhbWU9ZnVuY3Rpb24oZXZ0KXtcblx0XHRcdHZhciBlbD10aGlzLmZpbmQoXCJpZnJhbWVcIik7XG5cdFx0XHRpZighZWwubGVuZ3RoKXtyZXR1cm47fSAvKiBjaGVjayBpZiBjb250ZW50IGNvbnRhaW5zIGlmcmFtZXMgKi9cblx0XHRcdHZhciB2YWw9IWV2dCA/IFwibm9uZVwiIDogXCJhdXRvXCI7XG5cdFx0XHRlbC5jc3MoXCJwb2ludGVyLWV2ZW50c1wiLHZhbCk7IC8qIGZvciBJRTExLCBpZnJhbWUncyBkaXNwbGF5IHByb3BlcnR5IHNob3VsZCBub3QgYmUgXCJibG9ja1wiICovXG5cdFx0fSxcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFxuXHRcdFxuXHRcdC8qIGRpc2FibGVzIG1vdXNlLXdoZWVsIHdoZW4gaG92ZXJpbmcgc3BlY2lmaWMgZWxlbWVudHMgbGlrZSBzZWxlY3QsIGRhdGFsaXN0IGV0Yy4gKi9cblx0XHRfZGlzYWJsZU1vdXNld2hlZWw9ZnVuY3Rpb24oZWwsdGFyZ2V0KXtcblx0XHRcdHZhciB0YWc9dGFyZ2V0Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksXG5cdFx0XHRcdHRhZ3M9ZWwuZGF0YShwbHVnaW5QZngpLm9wdC5tb3VzZVdoZWVsLmRpc2FibGVPdmVyLFxuXHRcdFx0XHQvKiBlbGVtZW50cyB0aGF0IHJlcXVpcmUgZm9jdXMgKi9cblx0XHRcdFx0Zm9jdXNUYWdzPVtcInNlbGVjdFwiLFwidGV4dGFyZWFcIl07XG5cdFx0XHRyZXR1cm4gJC5pbkFycmF5KHRhZyx0YWdzKSA+IC0xICYmICEoJC5pbkFycmF5KHRhZyxmb2N1c1RhZ3MpID4gLTEgJiYgISQodGFyZ2V0KS5pcyhcIjpmb2N1c1wiKSk7XG5cdFx0fSxcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFxuXHRcdFxuXHRcdC8qIFxuXHRcdERSQUdHRVIgUkFJTCBDTElDSyBFVkVOVFxuXHRcdHNjcm9sbHMgY29udGVudCB2aWEgZHJhZ2dlciByYWlsIFxuXHRcdCovXG5cdFx0X2RyYWdnZXJSYWlsPWZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxcblx0XHRcdFx0bmFtZXNwYWNlPXBsdWdpblBmeCtcIl9cIitkLmlkeCxcblx0XHRcdFx0bUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcblx0XHRcdFx0d3JhcHBlcj1tQ1NCX2NvbnRhaW5lci5wYXJlbnQoKSxcblx0XHRcdFx0bUNTQl9kcmFnZ2VyQ29udGFpbmVyPSQoXCIubUNTQl9cIitkLmlkeCtcIl9zY3JvbGxiYXIgLlwiK2NsYXNzZXNbMTJdKSxcblx0XHRcdFx0Y2xpY2thYmxlO1xuXHRcdFx0bUNTQl9kcmFnZ2VyQ29udGFpbmVyLmJpbmQoXCJtb3VzZWRvd24uXCIrbmFtZXNwYWNlK1wiIHRvdWNoc3RhcnQuXCIrbmFtZXNwYWNlK1wiIHBvaW50ZXJkb3duLlwiK25hbWVzcGFjZStcIiBNU1BvaW50ZXJEb3duLlwiK25hbWVzcGFjZSxmdW5jdGlvbihlKXtcblx0XHRcdFx0dG91Y2hBY3RpdmU9dHJ1ZTtcblx0XHRcdFx0aWYoISQoZS50YXJnZXQpLmhhc0NsYXNzKFwibUNTQl9kcmFnZ2VyXCIpKXtjbGlja2FibGU9MTt9XG5cdFx0XHR9KS5iaW5kKFwidG91Y2hlbmQuXCIrbmFtZXNwYWNlK1wiIHBvaW50ZXJ1cC5cIituYW1lc3BhY2UrXCIgTVNQb2ludGVyVXAuXCIrbmFtZXNwYWNlLGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHR0b3VjaEFjdGl2ZT1mYWxzZTtcblx0XHRcdH0pLmJpbmQoXCJjbGljay5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGlmKCFjbGlja2FibGUpe3JldHVybjt9XG5cdFx0XHRcdGNsaWNrYWJsZT0wO1xuXHRcdFx0XHRpZigkKGUudGFyZ2V0KS5oYXNDbGFzcyhjbGFzc2VzWzEyXSkgfHwgJChlLnRhcmdldCkuaGFzQ2xhc3MoXCJtQ1NCX2RyYWdnZXJSYWlsXCIpKXtcblx0XHRcdFx0XHRfc3RvcCgkdGhpcyk7XG5cdFx0XHRcdFx0dmFyIGVsPSQodGhpcyksbUNTQl9kcmFnZ2VyPWVsLmZpbmQoXCIubUNTQl9kcmFnZ2VyXCIpO1xuXHRcdFx0XHRcdGlmKGVsLnBhcmVudChcIi5tQ1NCX3Njcm9sbFRvb2xzX2hvcml6b250YWxcIikubGVuZ3RoPjApe1xuXHRcdFx0XHRcdFx0aWYoIWQub3ZlcmZsb3dlZFsxXSl7cmV0dXJuO31cblx0XHRcdFx0XHRcdHZhciBkaXI9XCJ4XCIsXG5cdFx0XHRcdFx0XHRcdGNsaWNrRGlyPWUucGFnZVg+bUNTQl9kcmFnZ2VyLm9mZnNldCgpLmxlZnQgPyAtMSA6IDEsXG5cdFx0XHRcdFx0XHRcdHRvPU1hdGguYWJzKG1DU0JfY29udGFpbmVyWzBdLm9mZnNldExlZnQpLShjbGlja0Rpciood3JhcHBlci53aWR0aCgpKjAuOSkpO1xuXHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0aWYoIWQub3ZlcmZsb3dlZFswXSl7cmV0dXJuO31cblx0XHRcdFx0XHRcdHZhciBkaXI9XCJ5XCIsXG5cdFx0XHRcdFx0XHRcdGNsaWNrRGlyPWUucGFnZVk+bUNTQl9kcmFnZ2VyLm9mZnNldCgpLnRvcCA/IC0xIDogMSxcblx0XHRcdFx0XHRcdFx0dG89TWF0aC5hYnMobUNTQl9jb250YWluZXJbMF0ub2Zmc2V0VG9wKS0oY2xpY2tEaXIqKHdyYXBwZXIuaGVpZ2h0KCkqMC45KSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdF9zY3JvbGxUbygkdGhpcyx0by50b1N0cmluZygpLHtkaXI6ZGlyLHNjcm9sbEVhc2luZzpcIm1jc0Vhc2VJbk91dFwifSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiBcblx0XHRGT0NVUyBFVkVOVFxuXHRcdHNjcm9sbHMgY29udGVudCB2aWEgZWxlbWVudCBmb2N1cyAoZS5nLiBjbGlja2luZyBhbiBpbnB1dCwgcHJlc3NpbmcgVEFCIGtleSBldGMuKVxuXHRcdCovXG5cdFx0X2ZvY3VzPWZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxuXHRcdFx0XHRuYW1lc3BhY2U9cGx1Z2luUGZ4K1wiX1wiK2QuaWR4LFxuXHRcdFx0XHRtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLFxuXHRcdFx0XHR3cmFwcGVyPW1DU0JfY29udGFpbmVyLnBhcmVudCgpO1xuXHRcdFx0bUNTQl9jb250YWluZXIuYmluZChcImZvY3VzaW4uXCIrbmFtZXNwYWNlLGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHR2YXIgZWw9JChkb2N1bWVudC5hY3RpdmVFbGVtZW50KSxcblx0XHRcdFx0XHRuZXN0ZWQ9bUNTQl9jb250YWluZXIuZmluZChcIi5tQ3VzdG9tU2Nyb2xsQm94XCIpLmxlbmd0aCxcblx0XHRcdFx0XHRkdXI9MDtcblx0XHRcdFx0aWYoIWVsLmlzKG8uYWR2YW5jZWQuYXV0b1Njcm9sbE9uRm9jdXMpKXtyZXR1cm47fVxuXHRcdFx0XHRfc3RvcCgkdGhpcyk7XG5cdFx0XHRcdGNsZWFyVGltZW91dCgkdGhpc1swXS5fZm9jdXNUaW1lb3V0KTtcblx0XHRcdFx0JHRoaXNbMF0uX2ZvY3VzVGltZXI9bmVzdGVkID8gKGR1cisxNykqbmVzdGVkIDogMDtcblx0XHRcdFx0JHRoaXNbMF0uX2ZvY3VzVGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0dmFyXHR0bz1bX2NoaWxkUG9zKGVsKVswXSxfY2hpbGRQb3MoZWwpWzFdXSxcblx0XHRcdFx0XHRcdGNvbnRlbnRQb3M9W21DU0JfY29udGFpbmVyWzBdLm9mZnNldFRvcCxtQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRMZWZ0XSxcblx0XHRcdFx0XHRcdGlzVmlzaWJsZT1bXG5cdFx0XHRcdFx0XHRcdChjb250ZW50UG9zWzBdK3RvWzBdPj0wICYmIGNvbnRlbnRQb3NbMF0rdG9bMF08d3JhcHBlci5oZWlnaHQoKS1lbC5vdXRlckhlaWdodChmYWxzZSkpLFxuXHRcdFx0XHRcdFx0XHQoY29udGVudFBvc1sxXSt0b1sxXT49MCAmJiBjb250ZW50UG9zWzBdK3RvWzFdPHdyYXBwZXIud2lkdGgoKS1lbC5vdXRlcldpZHRoKGZhbHNlKSlcblx0XHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0XHRvdmVyd3JpdGU9KG8uYXhpcz09PVwieXhcIiAmJiAhaXNWaXNpYmxlWzBdICYmICFpc1Zpc2libGVbMV0pID8gXCJub25lXCIgOiBcImFsbFwiO1xuXHRcdFx0XHRcdGlmKG8uYXhpcyE9PVwieFwiICYmICFpc1Zpc2libGVbMF0pe1xuXHRcdFx0XHRcdFx0X3Njcm9sbFRvKCR0aGlzLHRvWzBdLnRvU3RyaW5nKCkse2RpcjpcInlcIixzY3JvbGxFYXNpbmc6XCJtY3NFYXNlSW5PdXRcIixvdmVyd3JpdGU6b3ZlcndyaXRlLGR1cjpkdXJ9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYoby5heGlzIT09XCJ5XCIgJiYgIWlzVmlzaWJsZVsxXSl7XG5cdFx0XHRcdFx0XHRfc2Nyb2xsVG8oJHRoaXMsdG9bMV0udG9TdHJpbmcoKSx7ZGlyOlwieFwiLHNjcm9sbEVhc2luZzpcIm1jc0Vhc2VJbk91dFwiLG92ZXJ3cml0ZTpvdmVyd3JpdGUsZHVyOmR1cn0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwkdGhpc1swXS5fZm9jdXNUaW1lcik7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XG5cdFx0XG5cdFx0Lyogc2V0cyBjb250ZW50IHdyYXBwZXIgc2Nyb2xsVG9wL3Njcm9sbExlZnQgYWx3YXlzIHRvIDAgKi9cblx0XHRfd3JhcHBlclNjcm9sbD1mdW5jdGlvbigpe1xuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksXG5cdFx0XHRcdG5hbWVzcGFjZT1wbHVnaW5QZngrXCJfXCIrZC5pZHgsXG5cdFx0XHRcdHdyYXBwZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKS5wYXJlbnQoKTtcblx0XHRcdHdyYXBwZXIuYmluZChcInNjcm9sbC5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGlmKHdyYXBwZXIuc2Nyb2xsVG9wKCkhPT0wIHx8IHdyYXBwZXIuc2Nyb2xsTGVmdCgpIT09MCl7XG5cdFx0XHRcdFx0JChcIi5tQ1NCX1wiK2QuaWR4K1wiX3Njcm9sbGJhclwiKS5jc3MoXCJ2aXNpYmlsaXR5XCIsXCJoaWRkZW5cIik7IC8qIGhpZGUgc2Nyb2xsYmFyKHMpICovXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiBcblx0XHRCVVRUT05TIEVWRU5UU1xuXHRcdHNjcm9sbHMgY29udGVudCB2aWEgdXAsIGRvd24sIGxlZnQgYW5kIHJpZ2h0IGJ1dHRvbnMgXG5cdFx0Ki9cblx0XHRfYnV0dG9ucz1mdW5jdGlvbigpe1xuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxzZXE9ZC5zZXF1ZW50aWFsLFxuXHRcdFx0XHRuYW1lc3BhY2U9cGx1Z2luUGZ4K1wiX1wiK2QuaWR4LFxuXHRcdFx0XHRzZWw9XCIubUNTQl9cIitkLmlkeCtcIl9zY3JvbGxiYXJcIixcblx0XHRcdFx0YnRuPSQoc2VsK1wiPmFcIik7XG5cdFx0XHRidG4uYmluZChcImNvbnRleHRtZW51LlwiK25hbWVzcGFjZSxmdW5jdGlvbihlKXtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOyAvL3ByZXZlbnQgcmlnaHQgY2xpY2tcblx0XHRcdH0pLmJpbmQoXCJtb3VzZWRvd24uXCIrbmFtZXNwYWNlK1wiIHRvdWNoc3RhcnQuXCIrbmFtZXNwYWNlK1wiIHBvaW50ZXJkb3duLlwiK25hbWVzcGFjZStcIiBNU1BvaW50ZXJEb3duLlwiK25hbWVzcGFjZStcIiBtb3VzZXVwLlwiK25hbWVzcGFjZStcIiB0b3VjaGVuZC5cIituYW1lc3BhY2UrXCIgcG9pbnRlcnVwLlwiK25hbWVzcGFjZStcIiBNU1BvaW50ZXJVcC5cIituYW1lc3BhY2UrXCIgbW91c2VvdXQuXCIrbmFtZXNwYWNlK1wiIHBvaW50ZXJvdXQuXCIrbmFtZXNwYWNlK1wiIE1TUG9pbnRlck91dC5cIituYW1lc3BhY2UrXCIgY2xpY2suXCIrbmFtZXNwYWNlLGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGlmKCFfbW91c2VCdG5MZWZ0KGUpKXtyZXR1cm47fSAvKiBsZWZ0IG1vdXNlIGJ1dHRvbiBvbmx5ICovXG5cdFx0XHRcdHZhciBidG5DbGFzcz0kKHRoaXMpLmF0dHIoXCJjbGFzc1wiKTtcblx0XHRcdFx0c2VxLnR5cGU9by5zY3JvbGxCdXR0b25zLnNjcm9sbFR5cGU7XG5cdFx0XHRcdHN3aXRjaChlLnR5cGUpe1xuXHRcdFx0XHRcdGNhc2UgXCJtb3VzZWRvd25cIjogY2FzZSBcInRvdWNoc3RhcnRcIjogY2FzZSBcInBvaW50ZXJkb3duXCI6IGNhc2UgXCJNU1BvaW50ZXJEb3duXCI6XG5cdFx0XHRcdFx0XHRpZihzZXEudHlwZT09PVwic3RlcHBlZFwiKXtyZXR1cm47fVxuXHRcdFx0XHRcdFx0dG91Y2hBY3RpdmU9dHJ1ZTtcblx0XHRcdFx0XHRcdGQudHdlZW5SdW5uaW5nPWZhbHNlO1xuXHRcdFx0XHRcdFx0X3NlcShcIm9uXCIsYnRuQ2xhc3MpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIm1vdXNldXBcIjogY2FzZSBcInRvdWNoZW5kXCI6IGNhc2UgXCJwb2ludGVydXBcIjogY2FzZSBcIk1TUG9pbnRlclVwXCI6XG5cdFx0XHRcdFx0Y2FzZSBcIm1vdXNlb3V0XCI6IGNhc2UgXCJwb2ludGVyb3V0XCI6IGNhc2UgXCJNU1BvaW50ZXJPdXRcIjpcblx0XHRcdFx0XHRcdGlmKHNlcS50eXBlPT09XCJzdGVwcGVkXCIpe3JldHVybjt9XG5cdFx0XHRcdFx0XHR0b3VjaEFjdGl2ZT1mYWxzZTtcblx0XHRcdFx0XHRcdGlmKHNlcS5kaXIpe19zZXEoXCJvZmZcIixidG5DbGFzcyk7fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcImNsaWNrXCI6XG5cdFx0XHRcdFx0XHRpZihzZXEudHlwZSE9PVwic3RlcHBlZFwiIHx8IGQudHdlZW5SdW5uaW5nKXtyZXR1cm47fVxuXHRcdFx0XHRcdFx0X3NlcShcIm9uXCIsYnRuQ2xhc3MpO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZnVuY3Rpb24gX3NlcShhLGMpe1xuXHRcdFx0XHRcdHNlcS5zY3JvbGxBbW91bnQ9by5zY3JvbGxCdXR0b25zLnNjcm9sbEFtb3VudDtcblx0XHRcdFx0XHRfc2VxdWVudGlhbFNjcm9sbCgkdGhpcyxhLGMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XG5cdFx0XG5cdFx0LyogXG5cdFx0S0VZQk9BUkQgRVZFTlRTXG5cdFx0c2Nyb2xscyBjb250ZW50IHZpYSBrZXlib2FyZCBcblx0XHRLZXlzOiB1cCBhcnJvdywgZG93biBhcnJvdywgbGVmdCBhcnJvdywgcmlnaHQgYXJyb3csIFBnVXAsIFBnRG4sIEhvbWUsIEVuZFxuXHRcdCovXG5cdFx0X2tleWJvYXJkPWZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LHNlcT1kLnNlcXVlbnRpYWwsXG5cdFx0XHRcdG5hbWVzcGFjZT1wbHVnaW5QZngrXCJfXCIrZC5pZHgsXG5cdFx0XHRcdG1DdXN0b21TY3JvbGxCb3g9JChcIiNtQ1NCX1wiK2QuaWR4KSxcblx0XHRcdFx0bUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcblx0XHRcdFx0d3JhcHBlcj1tQ1NCX2NvbnRhaW5lci5wYXJlbnQoKSxcblx0XHRcdFx0ZWRpdGFibGVzPVwiaW5wdXQsdGV4dGFyZWEsc2VsZWN0LGRhdGFsaXN0LGtleWdlbixbY29udGVudGVkaXRhYmxlPSd0cnVlJ11cIixcblx0XHRcdFx0aWZyYW1lPW1DU0JfY29udGFpbmVyLmZpbmQoXCJpZnJhbWVcIiksXG5cdFx0XHRcdGV2ZW50cz1bXCJibHVyLlwiK25hbWVzcGFjZStcIiBrZXlkb3duLlwiK25hbWVzcGFjZStcIiBrZXl1cC5cIituYW1lc3BhY2VdO1xuXHRcdFx0aWYoaWZyYW1lLmxlbmd0aCl7XG5cdFx0XHRcdGlmcmFtZS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0JCh0aGlzKS5iaW5kKFwibG9hZFwiLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHQvKiBiaW5kIGV2ZW50cyBvbiBhY2Nlc3NpYmxlIGlmcmFtZXMgKi9cblx0XHRcdFx0XHRcdGlmKF9jYW5BY2Nlc3NJRnJhbWUodGhpcykpe1xuXHRcdFx0XHRcdFx0XHQkKHRoaXMuY29udGVudERvY3VtZW50IHx8IHRoaXMuY29udGVudFdpbmRvdy5kb2N1bWVudCkuYmluZChldmVudHNbMF0sZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0XHRcdFx0X29uS2V5Ym9hcmQoZSk7XG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHRcdG1DdXN0b21TY3JvbGxCb3guYXR0cihcInRhYmluZGV4XCIsXCIwXCIpLmJpbmQoZXZlbnRzWzBdLGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRfb25LZXlib2FyZChlKTtcblx0XHRcdH0pO1xuXHRcdFx0ZnVuY3Rpb24gX29uS2V5Ym9hcmQoZSl7XG5cdFx0XHRcdHN3aXRjaChlLnR5cGUpe1xuXHRcdFx0XHRcdGNhc2UgXCJibHVyXCI6XG5cdFx0XHRcdFx0XHRpZihkLnR3ZWVuUnVubmluZyAmJiBzZXEuZGlyKXtfc2VxKFwib2ZmXCIsbnVsbCk7fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcImtleWRvd25cIjogY2FzZSBcImtleXVwXCI6XG5cdFx0XHRcdFx0XHR2YXIgY29kZT1lLmtleUNvZGUgPyBlLmtleUNvZGUgOiBlLndoaWNoLGFjdGlvbj1cIm9uXCI7XG5cdFx0XHRcdFx0XHRpZigoby5heGlzIT09XCJ4XCIgJiYgKGNvZGU9PT0zOCB8fCBjb2RlPT09NDApKSB8fCAoby5heGlzIT09XCJ5XCIgJiYgKGNvZGU9PT0zNyB8fCBjb2RlPT09MzkpKSl7XG5cdFx0XHRcdFx0XHRcdC8qIHVwICgzOCksIGRvd24gKDQwKSwgbGVmdCAoMzcpLCByaWdodCAoMzkpIGFycm93cyAqL1xuXHRcdFx0XHRcdFx0XHRpZigoKGNvZGU9PT0zOCB8fCBjb2RlPT09NDApICYmICFkLm92ZXJmbG93ZWRbMF0pIHx8ICgoY29kZT09PTM3IHx8IGNvZGU9PT0zOSkgJiYgIWQub3ZlcmZsb3dlZFsxXSkpe3JldHVybjt9XG5cdFx0XHRcdFx0XHRcdGlmKGUudHlwZT09PVwia2V5dXBcIil7YWN0aW9uPVwib2ZmXCI7fVxuXHRcdFx0XHRcdFx0XHRpZighJChkb2N1bWVudC5hY3RpdmVFbGVtZW50KS5pcyhlZGl0YWJsZXMpKXtcblx0XHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdFx0XHRfc2VxKGFjdGlvbixjb2RlKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fWVsc2UgaWYoY29kZT09PTMzIHx8IGNvZGU9PT0zNCl7XG5cdFx0XHRcdFx0XHRcdC8qIFBnVXAgKDMzKSwgUGdEbiAoMzQpICovXG5cdFx0XHRcdFx0XHRcdGlmKGQub3ZlcmZsb3dlZFswXSB8fCBkLm92ZXJmbG93ZWRbMV0pe1xuXHRcdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdGlmKGUudHlwZT09PVwia2V5dXBcIil7XG5cdFx0XHRcdFx0XHRcdFx0X3N0b3AoJHRoaXMpO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBrZXlib2FyZERpcj1jb2RlPT09MzQgPyAtMSA6IDE7XG5cdFx0XHRcdFx0XHRcdFx0aWYoby5heGlzPT09XCJ4XCIgfHwgKG8uYXhpcz09PVwieXhcIiAmJiBkLm92ZXJmbG93ZWRbMV0gJiYgIWQub3ZlcmZsb3dlZFswXSkpe1xuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGRpcj1cInhcIix0bz1NYXRoLmFicyhtQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRMZWZ0KS0oa2V5Ym9hcmREaXIqKHdyYXBwZXIud2lkdGgoKSowLjkpKTtcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBkaXI9XCJ5XCIsdG89TWF0aC5hYnMobUNTQl9jb250YWluZXJbMF0ub2Zmc2V0VG9wKS0oa2V5Ym9hcmREaXIqKHdyYXBwZXIuaGVpZ2h0KCkqMC45KSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdF9zY3JvbGxUbygkdGhpcyx0by50b1N0cmluZygpLHtkaXI6ZGlyLHNjcm9sbEVhc2luZzpcIm1jc0Vhc2VJbk91dFwifSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1lbHNlIGlmKGNvZGU9PT0zNSB8fCBjb2RlPT09MzYpe1xuXHRcdFx0XHRcdFx0XHQvKiBFbmQgKDM1KSwgSG9tZSAoMzYpICovXG5cdFx0XHRcdFx0XHRcdGlmKCEkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLmlzKGVkaXRhYmxlcykpe1xuXHRcdFx0XHRcdFx0XHRcdGlmKGQub3ZlcmZsb3dlZFswXSB8fCBkLm92ZXJmbG93ZWRbMV0pe1xuXHRcdFx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0aWYoZS50eXBlPT09XCJrZXl1cFwiKXtcblx0XHRcdFx0XHRcdFx0XHRcdGlmKG8uYXhpcz09PVwieFwiIHx8IChvLmF4aXM9PT1cInl4XCIgJiYgZC5vdmVyZmxvd2VkWzFdICYmICFkLm92ZXJmbG93ZWRbMF0pKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIGRpcj1cInhcIix0bz1jb2RlPT09MzUgPyBNYXRoLmFicyh3cmFwcGVyLndpZHRoKCktbUNTQl9jb250YWluZXIub3V0ZXJXaWR0aChmYWxzZSkpIDogMDtcblx0XHRcdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgZGlyPVwieVwiLHRvPWNvZGU9PT0zNSA/IE1hdGguYWJzKHdyYXBwZXIuaGVpZ2h0KCktbUNTQl9jb250YWluZXIub3V0ZXJIZWlnaHQoZmFsc2UpKSA6IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRfc2Nyb2xsVG8oJHRoaXMsdG8udG9TdHJpbmcoKSx7ZGlyOmRpcixzY3JvbGxFYXNpbmc6XCJtY3NFYXNlSW5PdXRcIn0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZnVuY3Rpb24gX3NlcShhLGMpe1xuXHRcdFx0XHRcdHNlcS50eXBlPW8ua2V5Ym9hcmQuc2Nyb2xsVHlwZTtcblx0XHRcdFx0XHRzZXEuc2Nyb2xsQW1vdW50PW8ua2V5Ym9hcmQuc2Nyb2xsQW1vdW50O1xuXHRcdFx0XHRcdGlmKHNlcS50eXBlPT09XCJzdGVwcGVkXCIgJiYgZC50d2VlblJ1bm5pbmcpe3JldHVybjt9XG5cdFx0XHRcdFx0X3NlcXVlbnRpYWxTY3JvbGwoJHRoaXMsYSxjKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiBzY3JvbGxzIGNvbnRlbnQgc2VxdWVudGlhbGx5ICh1c2VkIHdoZW4gc2Nyb2xsaW5nIHZpYSBidXR0b25zLCBrZXlib2FyZCBhcnJvd3MgZXRjLikgKi9cblx0XHRfc2VxdWVudGlhbFNjcm9sbD1mdW5jdGlvbihlbCxhY3Rpb24sdHJpZ2dlcixlLHMpe1xuXHRcdFx0dmFyIGQ9ZWwuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsc2VxPWQuc2VxdWVudGlhbCxcblx0XHRcdFx0bUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcblx0XHRcdFx0b25jZT1zZXEudHlwZT09PVwic3RlcHBlZFwiID8gdHJ1ZSA6IGZhbHNlLFxuXHRcdFx0XHRzdGVwbGVzc1NwZWVkPW8uc2Nyb2xsSW5lcnRpYSA8IDI2ID8gMjYgOiBvLnNjcm9sbEluZXJ0aWEsIC8qIDI2LzEuNT0xNyAqL1xuXHRcdFx0XHRzdGVwcGVkU3BlZWQ9by5zY3JvbGxJbmVydGlhIDwgMSA/IDE3IDogby5zY3JvbGxJbmVydGlhO1xuXHRcdFx0c3dpdGNoKGFjdGlvbil7XG5cdFx0XHRcdGNhc2UgXCJvblwiOlxuXHRcdFx0XHRcdHNlcS5kaXI9W1xuXHRcdFx0XHRcdFx0KHRyaWdnZXI9PT1jbGFzc2VzWzE2XSB8fCB0cmlnZ2VyPT09Y2xhc3Nlc1sxNV0gfHwgdHJpZ2dlcj09PTM5IHx8IHRyaWdnZXI9PT0zNyA/IFwieFwiIDogXCJ5XCIpLFxuXHRcdFx0XHRcdFx0KHRyaWdnZXI9PT1jbGFzc2VzWzEzXSB8fCB0cmlnZ2VyPT09Y2xhc3Nlc1sxNV0gfHwgdHJpZ2dlcj09PTM4IHx8IHRyaWdnZXI9PT0zNyA/IC0xIDogMSlcblx0XHRcdFx0XHRdO1xuXHRcdFx0XHRcdF9zdG9wKGVsKTtcblx0XHRcdFx0XHRpZihfaXNOdW1lcmljKHRyaWdnZXIpICYmIHNlcS50eXBlPT09XCJzdGVwcGVkXCIpe3JldHVybjt9XG5cdFx0XHRcdFx0X29uKG9uY2UpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwib2ZmXCI6XG5cdFx0XHRcdFx0X29mZigpO1xuXHRcdFx0XHRcdGlmKG9uY2UgfHwgKGQudHdlZW5SdW5uaW5nICYmIHNlcS5kaXIpKXtcblx0XHRcdFx0XHRcdF9vbih0cnVlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8qIHN0YXJ0cyBzZXF1ZW5jZSAqL1xuXHRcdFx0ZnVuY3Rpb24gX29uKG9uY2Upe1xuXHRcdFx0XHRpZihvLnNuYXBBbW91bnQpe3NlcS5zY3JvbGxBbW91bnQ9IShvLnNuYXBBbW91bnQgaW5zdGFuY2VvZiBBcnJheSkgPyBvLnNuYXBBbW91bnQgOiBzZXEuZGlyWzBdPT09XCJ4XCIgPyBvLnNuYXBBbW91bnRbMV0gOiBvLnNuYXBBbW91bnRbMF07fSAvKiBzY3JvbGxpbmcgc25hcHBpbmcgKi9cblx0XHRcdFx0dmFyIGM9c2VxLnR5cGUhPT1cInN0ZXBwZWRcIiwgLyogY29udGludW91cyBzY3JvbGxpbmcgKi9cblx0XHRcdFx0XHR0PXMgPyBzIDogIW9uY2UgPyAxMDAwLzYwIDogYyA/IHN0ZXBsZXNzU3BlZWQvMS41IDogc3RlcHBlZFNwZWVkLCAvKiB0aW1lciAqL1xuXHRcdFx0XHRcdG09IW9uY2UgPyAyLjUgOiBjID8gNy41IDogNDAsIC8qIG11bHRpcGxpZXIgKi9cblx0XHRcdFx0XHRjb250ZW50UG9zPVtNYXRoLmFicyhtQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRUb3ApLE1hdGguYWJzKG1DU0JfY29udGFpbmVyWzBdLm9mZnNldExlZnQpXSxcblx0XHRcdFx0XHRyYXRpbz1bZC5zY3JvbGxSYXRpby55PjEwID8gMTAgOiBkLnNjcm9sbFJhdGlvLnksZC5zY3JvbGxSYXRpby54PjEwID8gMTAgOiBkLnNjcm9sbFJhdGlvLnhdLFxuXHRcdFx0XHRcdGFtb3VudD1zZXEuZGlyWzBdPT09XCJ4XCIgPyBjb250ZW50UG9zWzFdKyhzZXEuZGlyWzFdKihyYXRpb1sxXSptKSkgOiBjb250ZW50UG9zWzBdKyhzZXEuZGlyWzFdKihyYXRpb1swXSptKSksXG5cdFx0XHRcdFx0cHg9c2VxLmRpclswXT09PVwieFwiID8gY29udGVudFBvc1sxXSsoc2VxLmRpclsxXSpwYXJzZUludChzZXEuc2Nyb2xsQW1vdW50KSkgOiBjb250ZW50UG9zWzBdKyhzZXEuZGlyWzFdKnBhcnNlSW50KHNlcS5zY3JvbGxBbW91bnQpKSxcblx0XHRcdFx0XHR0bz1zZXEuc2Nyb2xsQW1vdW50IT09XCJhdXRvXCIgPyBweCA6IGFtb3VudCxcblx0XHRcdFx0XHRlYXNpbmc9ZSA/IGUgOiAhb25jZSA/IFwibWNzTGluZWFyXCIgOiBjID8gXCJtY3NMaW5lYXJPdXRcIiA6IFwibWNzRWFzZUluT3V0XCIsXG5cdFx0XHRcdFx0b25Db21wbGV0ZT0hb25jZSA/IGZhbHNlIDogdHJ1ZTtcblx0XHRcdFx0aWYob25jZSAmJiB0PDE3KXtcblx0XHRcdFx0XHR0bz1zZXEuZGlyWzBdPT09XCJ4XCIgPyBjb250ZW50UG9zWzFdIDogY29udGVudFBvc1swXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRfc2Nyb2xsVG8oZWwsdG8udG9TdHJpbmcoKSx7ZGlyOnNlcS5kaXJbMF0sc2Nyb2xsRWFzaW5nOmVhc2luZyxkdXI6dCxvbkNvbXBsZXRlOm9uQ29tcGxldGV9KTtcblx0XHRcdFx0aWYob25jZSl7XG5cdFx0XHRcdFx0c2VxLmRpcj1mYWxzZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHNlcS5zdGVwKTtcblx0XHRcdFx0c2VxLnN0ZXA9c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdF9vbigpO1xuXHRcdFx0XHR9LHQpO1xuXHRcdFx0fVxuXHRcdFx0Lyogc3RvcHMgc2VxdWVuY2UgKi9cblx0XHRcdGZ1bmN0aW9uIF9vZmYoKXtcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHNlcS5zdGVwKTtcblx0XHRcdFx0X2RlbGV0ZShzZXEsXCJzdGVwXCIpO1xuXHRcdFx0XHRfc3RvcChlbCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFxuXHRcdFxuXHRcdC8qIHJldHVybnMgYSB5eCBhcnJheSBmcm9tIHZhbHVlICovXG5cdFx0X2Fycj1mdW5jdGlvbih2YWwpe1xuXHRcdFx0dmFyIG89JCh0aGlzKS5kYXRhKHBsdWdpblBmeCkub3B0LHZhbHM9W107XG5cdFx0XHRpZih0eXBlb2YgdmFsPT09XCJmdW5jdGlvblwiKXt2YWw9dmFsKCk7fSAvKiBjaGVjayBpZiB0aGUgdmFsdWUgaXMgYSBzaW5nbGUgYW5vbnltb3VzIGZ1bmN0aW9uICovXG5cdFx0XHQvKiBjaGVjayBpZiB2YWx1ZSBpcyBvYmplY3Qgb3IgYXJyYXksIGl0cyBsZW5ndGggYW5kIGNyZWF0ZSBhbiBhcnJheSB3aXRoIHl4IHZhbHVlcyAqL1xuXHRcdFx0aWYoISh2YWwgaW5zdGFuY2VvZiBBcnJheSkpeyAvKiBvYmplY3QgdmFsdWUgKGUuZy4ge3k6XCIxMDBcIix4OlwiMTAwXCJ9LCAxMDAgZXRjLikgKi9cblx0XHRcdFx0dmFsc1swXT12YWwueSA/IHZhbC55IDogdmFsLnggfHwgby5heGlzPT09XCJ4XCIgPyBudWxsIDogdmFsO1xuXHRcdFx0XHR2YWxzWzFdPXZhbC54ID8gdmFsLnggOiB2YWwueSB8fCBvLmF4aXM9PT1cInlcIiA/IG51bGwgOiB2YWw7XG5cdFx0XHR9ZWxzZXsgLyogYXJyYXkgdmFsdWUgKGUuZy4gWzEwMCwxMDBdKSAqL1xuXHRcdFx0XHR2YWxzPXZhbC5sZW5ndGg+MSA/IFt2YWxbMF0sdmFsWzFdXSA6IG8uYXhpcz09PVwieFwiID8gW251bGwsdmFsWzBdXSA6IFt2YWxbMF0sbnVsbF07XG5cdFx0XHR9XG5cdFx0XHQvKiBjaGVjayBpZiBhcnJheSB2YWx1ZXMgYXJlIGFub255bW91cyBmdW5jdGlvbnMgKi9cblx0XHRcdGlmKHR5cGVvZiB2YWxzWzBdPT09XCJmdW5jdGlvblwiKXt2YWxzWzBdPXZhbHNbMF0oKTt9XG5cdFx0XHRpZih0eXBlb2YgdmFsc1sxXT09PVwiZnVuY3Rpb25cIil7dmFsc1sxXT12YWxzWzFdKCk7fVxuXHRcdFx0cmV0dXJuIHZhbHM7XG5cdFx0fSxcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFxuXHRcdFxuXHRcdC8qIHRyYW5zbGF0ZXMgdmFsdWVzIChlLmcuIFwidG9wXCIsIDEwMCwgXCIxMDBweFwiLCBcIiNpZFwiKSB0byBhY3R1YWwgc2Nyb2xsLXRvIHBvc2l0aW9ucyAqL1xuXHRcdF90bz1mdW5jdGlvbih2YWwsZGlyKXtcblx0XHRcdGlmKHZhbD09bnVsbCB8fCB0eXBlb2YgdmFsPT1cInVuZGVmaW5lZFwiKXtyZXR1cm47fVxuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcblx0XHRcdFx0bUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcblx0XHRcdFx0d3JhcHBlcj1tQ1NCX2NvbnRhaW5lci5wYXJlbnQoKSxcblx0XHRcdFx0dD10eXBlb2YgdmFsO1xuXHRcdFx0aWYoIWRpcil7ZGlyPW8uYXhpcz09PVwieFwiID8gXCJ4XCIgOiBcInlcIjt9XG5cdFx0XHR2YXIgY29udGVudExlbmd0aD1kaXI9PT1cInhcIiA/IG1DU0JfY29udGFpbmVyLm91dGVyV2lkdGgoZmFsc2UpLXdyYXBwZXIud2lkdGgoKSA6IG1DU0JfY29udGFpbmVyLm91dGVySGVpZ2h0KGZhbHNlKS13cmFwcGVyLmhlaWdodCgpLFxuXHRcdFx0XHRjb250ZW50UG9zPWRpcj09PVwieFwiID8gbUNTQl9jb250YWluZXJbMF0ub2Zmc2V0TGVmdCA6IG1DU0JfY29udGFpbmVyWzBdLm9mZnNldFRvcCxcblx0XHRcdFx0Y3NzUHJvcD1kaXI9PT1cInhcIiA/IFwibGVmdFwiIDogXCJ0b3BcIjtcblx0XHRcdHN3aXRjaCh0KXtcblx0XHRcdFx0Y2FzZSBcImZ1bmN0aW9uXCI6IC8qIHRoaXMgY3VycmVudGx5IGlzIG5vdCB1c2VkLiBDb25zaWRlciByZW1vdmluZyBpdCAqL1xuXHRcdFx0XHRcdHJldHVybiB2YWwoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcIm9iamVjdFwiOiAvKiBqcy9qcXVlcnkgb2JqZWN0ICovXG5cdFx0XHRcdFx0dmFyIG9iaj12YWwuanF1ZXJ5ID8gdmFsIDogJCh2YWwpO1xuXHRcdFx0XHRcdGlmKCFvYmoubGVuZ3RoKXtyZXR1cm47fVxuXHRcdFx0XHRcdHJldHVybiBkaXI9PT1cInhcIiA/IF9jaGlsZFBvcyhvYmopWzFdIDogX2NoaWxkUG9zKG9iailbMF07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJzdHJpbmdcIjogY2FzZSBcIm51bWJlclwiOlxuXHRcdFx0XHRcdGlmKF9pc051bWVyaWModmFsKSl7IC8qIG51bWVyaWMgdmFsdWUgKi9cblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLmFicyh2YWwpO1xuXHRcdFx0XHRcdH1lbHNlIGlmKHZhbC5pbmRleE9mKFwiJVwiKSE9PS0xKXsgLyogcGVyY2VudGFnZSB2YWx1ZSAqL1xuXHRcdFx0XHRcdFx0cmV0dXJuIE1hdGguYWJzKGNvbnRlbnRMZW5ndGgqcGFyc2VJbnQodmFsKS8xMDApO1xuXHRcdFx0XHRcdH1lbHNlIGlmKHZhbC5pbmRleE9mKFwiLT1cIikhPT0tMSl7IC8qIGRlY3JlYXNlIHZhbHVlICovXG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5hYnMoY29udGVudFBvcy1wYXJzZUludCh2YWwuc3BsaXQoXCItPVwiKVsxXSkpO1xuXHRcdFx0XHRcdH1lbHNlIGlmKHZhbC5pbmRleE9mKFwiKz1cIikhPT0tMSl7IC8qIGlucmVhc2UgdmFsdWUgKi9cblx0XHRcdFx0XHRcdHZhciBwPShjb250ZW50UG9zK3BhcnNlSW50KHZhbC5zcGxpdChcIis9XCIpWzFdKSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gcD49MCA/IDAgOiBNYXRoLmFicyhwKTtcblx0XHRcdFx0XHR9ZWxzZSBpZih2YWwuaW5kZXhPZihcInB4XCIpIT09LTEgJiYgX2lzTnVtZXJpYyh2YWwuc3BsaXQoXCJweFwiKVswXSkpeyAvKiBwaXhlbHMgc3RyaW5nIHZhbHVlIChlLmcuIFwiMTAwcHhcIikgKi9cblx0XHRcdFx0XHRcdHJldHVybiBNYXRoLmFicyh2YWwuc3BsaXQoXCJweFwiKVswXSk7XG5cdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRpZih2YWw9PT1cInRvcFwiIHx8IHZhbD09PVwibGVmdFwiKXsgLyogc3BlY2lhbCBzdHJpbmdzICovXG5cdFx0XHRcdFx0XHRcdHJldHVybiAwO1xuXHRcdFx0XHRcdFx0fWVsc2UgaWYodmFsPT09XCJib3R0b21cIil7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBNYXRoLmFicyh3cmFwcGVyLmhlaWdodCgpLW1DU0JfY29udGFpbmVyLm91dGVySGVpZ2h0KGZhbHNlKSk7XG5cdFx0XHRcdFx0XHR9ZWxzZSBpZih2YWw9PT1cInJpZ2h0XCIpe1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5hYnMod3JhcHBlci53aWR0aCgpLW1DU0JfY29udGFpbmVyLm91dGVyV2lkdGgoZmFsc2UpKTtcblx0XHRcdFx0XHRcdH1lbHNlIGlmKHZhbD09PVwiZmlyc3RcIiB8fCB2YWw9PT1cImxhc3RcIil7XG5cdFx0XHRcdFx0XHRcdHZhciBvYmo9bUNTQl9jb250YWluZXIuZmluZChcIjpcIit2YWwpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZGlyPT09XCJ4XCIgPyBfY2hpbGRQb3Mob2JqKVsxXSA6IF9jaGlsZFBvcyhvYmopWzBdO1xuXHRcdFx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0XHRcdGlmKCQodmFsKS5sZW5ndGgpeyAvKiBqcXVlcnkgc2VsZWN0b3IgKi9cblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZGlyPT09XCJ4XCIgPyBfY2hpbGRQb3MoJCh2YWwpKVsxXSA6IF9jaGlsZFBvcygkKHZhbCkpWzBdO1xuXHRcdFx0XHRcdFx0XHR9ZWxzZXsgLyogb3RoZXIgdmFsdWVzIChlLmcuIFwiMTAwZW1cIikgKi9cblx0XHRcdFx0XHRcdFx0XHRtQ1NCX2NvbnRhaW5lci5jc3MoY3NzUHJvcCx2YWwpO1xuXHRcdFx0XHRcdFx0XHRcdG1ldGhvZHMudXBkYXRlLmNhbGwobnVsbCwkdGhpc1swXSk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiBjYWxscyB0aGUgdXBkYXRlIG1ldGhvZCBhdXRvbWF0aWNhbGx5ICovXG5cdFx0X2F1dG9VcGRhdGU9ZnVuY3Rpb24ocmVtKXtcblx0XHRcdHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXG5cdFx0XHRcdG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIik7XG5cdFx0XHRpZihyZW0pe1xuXHRcdFx0XHQvKiBcblx0XHRcdFx0cmVtb3ZlcyBhdXRvVXBkYXRlIHRpbWVyIFxuXHRcdFx0XHR1c2FnZTogX2F1dG9VcGRhdGUuY2FsbCh0aGlzLFwicmVtb3ZlXCIpO1xuXHRcdFx0XHQqL1xuXHRcdFx0XHRjbGVhclRpbWVvdXQobUNTQl9jb250YWluZXJbMF0uYXV0b1VwZGF0ZSk7XG5cdFx0XHRcdF9kZWxldGUobUNTQl9jb250YWluZXJbMF0sXCJhdXRvVXBkYXRlXCIpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR1cGQoKTtcblx0XHRcdGZ1bmN0aW9uIHVwZCgpe1xuXHRcdFx0XHRjbGVhclRpbWVvdXQobUNTQl9jb250YWluZXJbMF0uYXV0b1VwZGF0ZSk7XG5cdFx0XHRcdGlmKCR0aGlzLnBhcmVudHMoXCJodG1sXCIpLmxlbmd0aD09PTApe1xuXHRcdFx0XHRcdC8qIGNoZWNrIGVsZW1lbnQgaW4gZG9tIHRyZWUgKi9cblx0XHRcdFx0XHQkdGhpcz1udWxsO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0XHRtQ1NCX2NvbnRhaW5lclswXS5hdXRvVXBkYXRlPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHQvKiB1cGRhdGUgb24gc3BlY2lmaWMgc2VsZWN0b3IocykgbGVuZ3RoIGFuZCBzaXplIGNoYW5nZSAqL1xuXHRcdFx0XHRcdGlmKG8uYWR2YW5jZWQudXBkYXRlT25TZWxlY3RvckNoYW5nZSl7XG5cdFx0XHRcdFx0XHRkLnBvbGwuY2hhbmdlLm49c2l6ZXNTdW0oKTtcblx0XHRcdFx0XHRcdGlmKGQucG9sbC5jaGFuZ2UubiE9PWQucG9sbC5jaGFuZ2Uubyl7XG5cdFx0XHRcdFx0XHRcdGQucG9sbC5jaGFuZ2Uubz1kLnBvbGwuY2hhbmdlLm47XG5cdFx0XHRcdFx0XHRcdGRvVXBkKDMpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8qIHVwZGF0ZSBvbiBtYWluIGVsZW1lbnQgYW5kIHNjcm9sbGJhciBzaXplIGNoYW5nZXMgKi9cblx0XHRcdFx0XHRpZihvLmFkdmFuY2VkLnVwZGF0ZU9uQ29udGVudFJlc2l6ZSl7XG5cdFx0XHRcdFx0XHRkLnBvbGwuc2l6ZS5uPSR0aGlzWzBdLnNjcm9sbEhlaWdodCskdGhpc1swXS5zY3JvbGxXaWR0aCttQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRIZWlnaHQrJHRoaXNbMF0ub2Zmc2V0SGVpZ2h0KyR0aGlzWzBdLm9mZnNldFdpZHRoO1xuXHRcdFx0XHRcdFx0aWYoZC5wb2xsLnNpemUubiE9PWQucG9sbC5zaXplLm8pe1xuXHRcdFx0XHRcdFx0XHRkLnBvbGwuc2l6ZS5vPWQucG9sbC5zaXplLm47XG5cdFx0XHRcdFx0XHRcdGRvVXBkKDEpO1xuXHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8qIHVwZGF0ZSBvbiBpbWFnZSBsb2FkICovXG5cdFx0XHRcdFx0aWYoby5hZHZhbmNlZC51cGRhdGVPbkltYWdlTG9hZCl7XG5cdFx0XHRcdFx0XHRpZighKG8uYWR2YW5jZWQudXBkYXRlT25JbWFnZUxvYWQ9PT1cImF1dG9cIiAmJiBvLmF4aXM9PT1cInlcIikpeyAvL2J5IGRlZmF1bHQsIGl0IGRvZXNuJ3QgcnVuIG9uIHZlcnRpY2FsIGNvbnRlbnRcblx0XHRcdFx0XHRcdFx0ZC5wb2xsLmltZy5uPW1DU0JfY29udGFpbmVyLmZpbmQoXCJpbWdcIikubGVuZ3RoO1xuXHRcdFx0XHRcdFx0XHRpZihkLnBvbGwuaW1nLm4hPT1kLnBvbGwuaW1nLm8pe1xuXHRcdFx0XHRcdFx0XHRcdGQucG9sbC5pbWcubz1kLnBvbGwuaW1nLm47XG5cdFx0XHRcdFx0XHRcdFx0bUNTQl9jb250YWluZXIuZmluZChcImltZ1wiKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdFx0XHRpbWdMb2FkZXIodGhpcyk7XG5cdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKG8uYWR2YW5jZWQudXBkYXRlT25TZWxlY3RvckNoYW5nZSB8fCBvLmFkdmFuY2VkLnVwZGF0ZU9uQ29udGVudFJlc2l6ZSB8fCBvLmFkdmFuY2VkLnVwZGF0ZU9uSW1hZ2VMb2FkKXt1cGQoKTt9XG5cdFx0XHRcdH0sby5hZHZhbmNlZC5hdXRvVXBkYXRlVGltZW91dCk7XG5cdFx0XHR9XG5cdFx0XHQvKiBhIHRpbnkgaW1hZ2UgbG9hZGVyICovXG5cdFx0XHRmdW5jdGlvbiBpbWdMb2FkZXIoZWwpe1xuXHRcdFx0XHRpZigkKGVsKS5oYXNDbGFzcyhjbGFzc2VzWzJdKSl7ZG9VcGQoKTsgcmV0dXJuO31cblx0XHRcdFx0dmFyIGltZz1uZXcgSW1hZ2UoKTtcblx0XHRcdFx0ZnVuY3Rpb24gY3JlYXRlRGVsZWdhdGUoY29udGV4dE9iamVjdCxkZWxlZ2F0ZU1ldGhvZCl7XG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGRlbGVnYXRlTWV0aG9kLmFwcGx5KGNvbnRleHRPYmplY3QsYXJndW1lbnRzKTt9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZnVuY3Rpb24gaW1nT25Mb2FkKCl7XG5cdFx0XHRcdFx0dGhpcy5vbmxvYWQ9bnVsbDtcblx0XHRcdFx0XHQkKGVsKS5hZGRDbGFzcyhjbGFzc2VzWzJdKTtcblx0XHRcdFx0XHRkb1VwZCgyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpbWcub25sb2FkPWNyZWF0ZURlbGVnYXRlKGltZyxpbWdPbkxvYWQpO1xuXHRcdFx0XHRpbWcuc3JjPWVsLnNyYztcblx0XHRcdH1cblx0XHRcdC8qIHJldHVybnMgdGhlIHRvdGFsIGhlaWdodCBhbmQgd2lkdGggc3VtIG9mIGFsbCBlbGVtZW50cyBtYXRjaGluZyB0aGUgc2VsZWN0b3IgKi9cblx0XHRcdGZ1bmN0aW9uIHNpemVzU3VtKCl7XG5cdFx0XHRcdGlmKG8uYWR2YW5jZWQudXBkYXRlT25TZWxlY3RvckNoYW5nZT09PXRydWUpe28uYWR2YW5jZWQudXBkYXRlT25TZWxlY3RvckNoYW5nZT1cIipcIjt9XG5cdFx0XHRcdHZhciB0b3RhbD0wLHNlbD1tQ1NCX2NvbnRhaW5lci5maW5kKG8uYWR2YW5jZWQudXBkYXRlT25TZWxlY3RvckNoYW5nZSk7XG5cdFx0XHRcdGlmKG8uYWR2YW5jZWQudXBkYXRlT25TZWxlY3RvckNoYW5nZSAmJiBzZWwubGVuZ3RoPjApe3NlbC5lYWNoKGZ1bmN0aW9uKCl7dG90YWwrPXRoaXMub2Zmc2V0SGVpZ2h0K3RoaXMub2Zmc2V0V2lkdGg7fSk7fVxuXHRcdFx0XHRyZXR1cm4gdG90YWw7XG5cdFx0XHR9XG5cdFx0XHQvKiBjYWxscyB0aGUgdXBkYXRlIG1ldGhvZCAqL1xuXHRcdFx0ZnVuY3Rpb24gZG9VcGQoY2Ipe1xuXHRcdFx0XHRjbGVhclRpbWVvdXQobUNTQl9jb250YWluZXJbMF0uYXV0b1VwZGF0ZSk7XG5cdFx0XHRcdG1ldGhvZHMudXBkYXRlLmNhbGwobnVsbCwkdGhpc1swXSxjYik7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFxuXHRcdFxuXHRcdC8qIHNuYXBzIHNjcm9sbGluZyB0byBhIG11bHRpcGxlIG9mIGEgcGl4ZWxzIG51bWJlciAqL1xuXHRcdF9zbmFwQW1vdW50PWZ1bmN0aW9uKHRvLGFtb3VudCxvZmZzZXQpe1xuXHRcdFx0cmV0dXJuIChNYXRoLnJvdW5kKHRvL2Ftb3VudCkqYW1vdW50LW9mZnNldCk7IFxuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiBzdG9wcyBjb250ZW50IGFuZCBzY3JvbGxiYXIgYW5pbWF0aW9ucyAqL1xuXHRcdF9zdG9wPWZ1bmN0aW9uKGVsKXtcblx0XHRcdHZhciBkPWVsLmRhdGEocGx1Z2luUGZ4KSxcblx0XHRcdFx0c2VsPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXIsI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyX3dyYXBwZXIsI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl92ZXJ0aWNhbCwjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIik7XG5cdFx0XHRzZWwuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRfc3RvcFR3ZWVuLmNhbGwodGhpcyk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XG5cdFx0XG5cdFx0LyogXG5cdFx0QU5JTUFURVMgQ09OVEVOVCBcblx0XHRUaGlzIGlzIHdoZXJlIHRoZSBhY3R1YWwgc2Nyb2xsaW5nIGhhcHBlbnNcblx0XHQqL1xuXHRcdF9zY3JvbGxUbz1mdW5jdGlvbihlbCx0byxvcHRpb25zKXtcblx0XHRcdHZhciBkPWVsLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxuXHRcdFx0XHRkZWZhdWx0cz17XG5cdFx0XHRcdFx0dHJpZ2dlcjpcImludGVybmFsXCIsXG5cdFx0XHRcdFx0ZGlyOlwieVwiLFxuXHRcdFx0XHRcdHNjcm9sbEVhc2luZzpcIm1jc0Vhc2VPdXRcIixcblx0XHRcdFx0XHRkcmFnOmZhbHNlLFxuXHRcdFx0XHRcdGR1cjpvLnNjcm9sbEluZXJ0aWEsXG5cdFx0XHRcdFx0b3ZlcndyaXRlOlwiYWxsXCIsXG5cdFx0XHRcdFx0Y2FsbGJhY2tzOnRydWUsXG5cdFx0XHRcdFx0b25TdGFydDp0cnVlLFxuXHRcdFx0XHRcdG9uVXBkYXRlOnRydWUsXG5cdFx0XHRcdFx0b25Db21wbGV0ZTp0cnVlXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG9wdGlvbnM9JC5leHRlbmQoZGVmYXVsdHMsb3B0aW9ucyksXG5cdFx0XHRcdGR1cj1bb3B0aW9ucy5kdXIsKG9wdGlvbnMuZHJhZyA/IDAgOiBvcHRpb25zLmR1cildLFxuXHRcdFx0XHRtQ3VzdG9tU2Nyb2xsQm94PSQoXCIjbUNTQl9cIitkLmlkeCksXG5cdFx0XHRcdG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIiksXG5cdFx0XHRcdHdyYXBwZXI9bUNTQl9jb250YWluZXIucGFyZW50KCksXG5cdFx0XHRcdHRvdGFsU2Nyb2xsT2Zmc2V0cz1vLmNhbGxiYWNrcy5vblRvdGFsU2Nyb2xsT2Zmc2V0ID8gX2Fyci5jYWxsKGVsLG8uY2FsbGJhY2tzLm9uVG90YWxTY3JvbGxPZmZzZXQpIDogWzAsMF0sXG5cdFx0XHRcdHRvdGFsU2Nyb2xsQmFja09mZnNldHM9by5jYWxsYmFja3Mub25Ub3RhbFNjcm9sbEJhY2tPZmZzZXQgPyBfYXJyLmNhbGwoZWwsby5jYWxsYmFja3Mub25Ub3RhbFNjcm9sbEJhY2tPZmZzZXQpIDogWzAsMF07XG5cdFx0XHRkLnRyaWdnZXI9b3B0aW9ucy50cmlnZ2VyO1xuXHRcdFx0aWYod3JhcHBlci5zY3JvbGxUb3AoKSE9PTAgfHwgd3JhcHBlci5zY3JvbGxMZWZ0KCkhPT0wKXsgLyogYWx3YXlzIHJlc2V0IHNjcm9sbFRvcC9MZWZ0ICovXG5cdFx0XHRcdCQoXCIubUNTQl9cIitkLmlkeCtcIl9zY3JvbGxiYXJcIikuY3NzKFwidmlzaWJpbGl0eVwiLFwidmlzaWJsZVwiKTtcblx0XHRcdFx0d3JhcHBlci5zY3JvbGxUb3AoMCkuc2Nyb2xsTGVmdCgwKTtcblx0XHRcdH1cblx0XHRcdGlmKHRvPT09XCJfcmVzZXRZXCIgJiYgIWQuY29udGVudFJlc2V0Lnkpe1xuXHRcdFx0XHQvKiBjYWxsYmFja3M6IG9uT3ZlcmZsb3dZTm9uZSAqL1xuXHRcdFx0XHRpZihfY2IoXCJvbk92ZXJmbG93WU5vbmVcIikpe28uY2FsbGJhY2tzLm9uT3ZlcmZsb3dZTm9uZS5jYWxsKGVsWzBdKTt9XG5cdFx0XHRcdGQuY29udGVudFJlc2V0Lnk9MTtcblx0XHRcdH1cblx0XHRcdGlmKHRvPT09XCJfcmVzZXRYXCIgJiYgIWQuY29udGVudFJlc2V0Lngpe1xuXHRcdFx0XHQvKiBjYWxsYmFja3M6IG9uT3ZlcmZsb3dYTm9uZSAqL1xuXHRcdFx0XHRpZihfY2IoXCJvbk92ZXJmbG93WE5vbmVcIikpe28uY2FsbGJhY2tzLm9uT3ZlcmZsb3dYTm9uZS5jYWxsKGVsWzBdKTt9XG5cdFx0XHRcdGQuY29udGVudFJlc2V0Lng9MTtcblx0XHRcdH1cblx0XHRcdGlmKHRvPT09XCJfcmVzZXRZXCIgfHwgdG89PT1cIl9yZXNldFhcIil7cmV0dXJuO31cblx0XHRcdGlmKChkLmNvbnRlbnRSZXNldC55IHx8ICFlbFswXS5tY3MpICYmIGQub3ZlcmZsb3dlZFswXSl7XG5cdFx0XHRcdC8qIGNhbGxiYWNrczogb25PdmVyZmxvd1kgKi9cblx0XHRcdFx0aWYoX2NiKFwib25PdmVyZmxvd1lcIikpe28uY2FsbGJhY2tzLm9uT3ZlcmZsb3dZLmNhbGwoZWxbMF0pO31cblx0XHRcdFx0ZC5jb250ZW50UmVzZXQueD1udWxsO1xuXHRcdFx0fVxuXHRcdFx0aWYoKGQuY29udGVudFJlc2V0LnggfHwgIWVsWzBdLm1jcykgJiYgZC5vdmVyZmxvd2VkWzFdKXtcblx0XHRcdFx0LyogY2FsbGJhY2tzOiBvbk92ZXJmbG93WCAqL1xuXHRcdFx0XHRpZihfY2IoXCJvbk92ZXJmbG93WFwiKSl7by5jYWxsYmFja3Mub25PdmVyZmxvd1guY2FsbChlbFswXSk7fVxuXHRcdFx0XHRkLmNvbnRlbnRSZXNldC54PW51bGw7XG5cdFx0XHR9XG5cdFx0XHRpZihvLnNuYXBBbW91bnQpeyAvKiBzY3JvbGxpbmcgc25hcHBpbmcgKi9cblx0XHRcdFx0dmFyIHNuYXBBbW91bnQ9IShvLnNuYXBBbW91bnQgaW5zdGFuY2VvZiBBcnJheSkgPyBvLnNuYXBBbW91bnQgOiBvcHRpb25zLmRpcj09PVwieFwiID8gby5zbmFwQW1vdW50WzFdIDogby5zbmFwQW1vdW50WzBdO1xuXHRcdFx0XHR0bz1fc25hcEFtb3VudCh0byxzbmFwQW1vdW50LG8uc25hcE9mZnNldCk7XG5cdFx0XHR9XG5cdFx0XHRzd2l0Y2gob3B0aW9ucy5kaXIpe1xuXHRcdFx0XHRjYXNlIFwieFwiOlxuXHRcdFx0XHRcdHZhciBtQ1NCX2RyYWdnZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfaG9yaXpvbnRhbFwiKSxcblx0XHRcdFx0XHRcdHByb3BlcnR5PVwibGVmdFwiLFxuXHRcdFx0XHRcdFx0Y29udGVudFBvcz1tQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRMZWZ0LFxuXHRcdFx0XHRcdFx0bGltaXQ9W1xuXHRcdFx0XHRcdFx0XHRtQ3VzdG9tU2Nyb2xsQm94LndpZHRoKCktbUNTQl9jb250YWluZXIub3V0ZXJXaWR0aChmYWxzZSksXG5cdFx0XHRcdFx0XHRcdG1DU0JfZHJhZ2dlci5wYXJlbnQoKS53aWR0aCgpLW1DU0JfZHJhZ2dlci53aWR0aCgpXG5cdFx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdFx0c2Nyb2xsVG89W3RvLHRvPT09MCA/IDAgOiAodG8vZC5zY3JvbGxSYXRpby54KV0sXG5cdFx0XHRcdFx0XHR0c289dG90YWxTY3JvbGxPZmZzZXRzWzFdLFxuXHRcdFx0XHRcdFx0dHNibz10b3RhbFNjcm9sbEJhY2tPZmZzZXRzWzFdLFxuXHRcdFx0XHRcdFx0dG90YWxTY3JvbGxPZmZzZXQ9dHNvPjAgPyB0c28vZC5zY3JvbGxSYXRpby54IDogMCxcblx0XHRcdFx0XHRcdHRvdGFsU2Nyb2xsQmFja09mZnNldD10c2JvPjAgPyB0c2JvL2Quc2Nyb2xsUmF0aW8ueCA6IDA7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJ5XCI6XG5cdFx0XHRcdFx0dmFyIG1DU0JfZHJhZ2dlcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl92ZXJ0aWNhbFwiKSxcblx0XHRcdFx0XHRcdHByb3BlcnR5PVwidG9wXCIsXG5cdFx0XHRcdFx0XHRjb250ZW50UG9zPW1DU0JfY29udGFpbmVyWzBdLm9mZnNldFRvcCxcblx0XHRcdFx0XHRcdGxpbWl0PVtcblx0XHRcdFx0XHRcdFx0bUN1c3RvbVNjcm9sbEJveC5oZWlnaHQoKS1tQ1NCX2NvbnRhaW5lci5vdXRlckhlaWdodChmYWxzZSksXG5cdFx0XHRcdFx0XHRcdG1DU0JfZHJhZ2dlci5wYXJlbnQoKS5oZWlnaHQoKS1tQ1NCX2RyYWdnZXIuaGVpZ2h0KClcblx0XHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0XHRzY3JvbGxUbz1bdG8sdG89PT0wID8gMCA6ICh0by9kLnNjcm9sbFJhdGlvLnkpXSxcblx0XHRcdFx0XHRcdHRzbz10b3RhbFNjcm9sbE9mZnNldHNbMF0sXG5cdFx0XHRcdFx0XHR0c2JvPXRvdGFsU2Nyb2xsQmFja09mZnNldHNbMF0sXG5cdFx0XHRcdFx0XHR0b3RhbFNjcm9sbE9mZnNldD10c28+MCA/IHRzby9kLnNjcm9sbFJhdGlvLnkgOiAwLFxuXHRcdFx0XHRcdFx0dG90YWxTY3JvbGxCYWNrT2Zmc2V0PXRzYm8+MCA/IHRzYm8vZC5zY3JvbGxSYXRpby55IDogMDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGlmKHNjcm9sbFRvWzFdPDAgfHwgKHNjcm9sbFRvWzBdPT09MCAmJiBzY3JvbGxUb1sxXT09PTApKXtcblx0XHRcdFx0c2Nyb2xsVG89WzAsMF07XG5cdFx0XHR9ZWxzZSBpZihzY3JvbGxUb1sxXT49bGltaXRbMV0pe1xuXHRcdFx0XHRzY3JvbGxUbz1bbGltaXRbMF0sbGltaXRbMV1dO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdHNjcm9sbFRvWzBdPS1zY3JvbGxUb1swXTtcblx0XHRcdH1cblx0XHRcdGlmKCFlbFswXS5tY3Mpe1xuXHRcdFx0XHRfbWNzKCk7ICAvKiBpbml0IG1jcyBvYmplY3QgKG9uY2UpIHRvIG1ha2UgaXQgYXZhaWxhYmxlIGJlZm9yZSBjYWxsYmFja3MgKi9cblx0XHRcdFx0aWYoX2NiKFwib25Jbml0XCIpKXtvLmNhbGxiYWNrcy5vbkluaXQuY2FsbChlbFswXSk7fSAvKiBjYWxsYmFja3M6IG9uSW5pdCAqL1xuXHRcdFx0fVxuXHRcdFx0Y2xlYXJUaW1lb3V0KG1DU0JfY29udGFpbmVyWzBdLm9uQ29tcGxldGVUaW1lb3V0KTtcblx0XHRcdF90d2VlblRvKG1DU0JfZHJhZ2dlclswXSxwcm9wZXJ0eSxNYXRoLnJvdW5kKHNjcm9sbFRvWzFdKSxkdXJbMV0sb3B0aW9ucy5zY3JvbGxFYXNpbmcpO1xuXHRcdFx0aWYoIWQudHdlZW5SdW5uaW5nICYmICgoY29udGVudFBvcz09PTAgJiYgc2Nyb2xsVG9bMF0+PTApIHx8IChjb250ZW50UG9zPT09bGltaXRbMF0gJiYgc2Nyb2xsVG9bMF08PWxpbWl0WzBdKSkpe3JldHVybjt9XG5cdFx0XHRfdHdlZW5UbyhtQ1NCX2NvbnRhaW5lclswXSxwcm9wZXJ0eSxNYXRoLnJvdW5kKHNjcm9sbFRvWzBdKSxkdXJbMF0sb3B0aW9ucy5zY3JvbGxFYXNpbmcsb3B0aW9ucy5vdmVyd3JpdGUse1xuXHRcdFx0XHRvblN0YXJ0OmZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0aWYob3B0aW9ucy5jYWxsYmFja3MgJiYgb3B0aW9ucy5vblN0YXJ0ICYmICFkLnR3ZWVuUnVubmluZyl7XG5cdFx0XHRcdFx0XHQvKiBjYWxsYmFja3M6IG9uU2Nyb2xsU3RhcnQgKi9cblx0XHRcdFx0XHRcdGlmKF9jYihcIm9uU2Nyb2xsU3RhcnRcIikpe19tY3MoKTsgby5jYWxsYmFja3Mub25TY3JvbGxTdGFydC5jYWxsKGVsWzBdKTt9XG5cdFx0XHRcdFx0XHRkLnR3ZWVuUnVubmluZz10cnVlO1xuXHRcdFx0XHRcdFx0X29uRHJhZ0NsYXNzZXMobUNTQl9kcmFnZ2VyKTtcblx0XHRcdFx0XHRcdGQuY2JPZmZzZXRzPV9jYk9mZnNldHMoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sb25VcGRhdGU6ZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRpZihvcHRpb25zLmNhbGxiYWNrcyAmJiBvcHRpb25zLm9uVXBkYXRlKXtcblx0XHRcdFx0XHRcdC8qIGNhbGxiYWNrczogd2hpbGVTY3JvbGxpbmcgKi9cblx0XHRcdFx0XHRcdGlmKF9jYihcIndoaWxlU2Nyb2xsaW5nXCIpKXtfbWNzKCk7IG8uY2FsbGJhY2tzLndoaWxlU2Nyb2xsaW5nLmNhbGwoZWxbMF0pO31cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sb25Db21wbGV0ZTpmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGlmKG9wdGlvbnMuY2FsbGJhY2tzICYmIG9wdGlvbnMub25Db21wbGV0ZSl7XG5cdFx0XHRcdFx0XHRpZihvLmF4aXM9PT1cInl4XCIpe2NsZWFyVGltZW91dChtQ1NCX2NvbnRhaW5lclswXS5vbkNvbXBsZXRlVGltZW91dCk7fVxuXHRcdFx0XHRcdFx0dmFyIHQ9bUNTQl9jb250YWluZXJbMF0uaWRsZVRpbWVyIHx8IDA7XG5cdFx0XHRcdFx0XHRtQ1NCX2NvbnRhaW5lclswXS5vbkNvbXBsZXRlVGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRcdC8qIGNhbGxiYWNrczogb25TY3JvbGwsIG9uVG90YWxTY3JvbGwsIG9uVG90YWxTY3JvbGxCYWNrICovXG5cdFx0XHRcdFx0XHRcdGlmKF9jYihcIm9uU2Nyb2xsXCIpKXtfbWNzKCk7IG8uY2FsbGJhY2tzLm9uU2Nyb2xsLmNhbGwoZWxbMF0pO31cblx0XHRcdFx0XHRcdFx0aWYoX2NiKFwib25Ub3RhbFNjcm9sbFwiKSAmJiBzY3JvbGxUb1sxXT49bGltaXRbMV0tdG90YWxTY3JvbGxPZmZzZXQgJiYgZC5jYk9mZnNldHNbMF0pe19tY3MoKTsgby5jYWxsYmFja3Mub25Ub3RhbFNjcm9sbC5jYWxsKGVsWzBdKTt9XG5cdFx0XHRcdFx0XHRcdGlmKF9jYihcIm9uVG90YWxTY3JvbGxCYWNrXCIpICYmIHNjcm9sbFRvWzFdPD10b3RhbFNjcm9sbEJhY2tPZmZzZXQgJiYgZC5jYk9mZnNldHNbMV0pe19tY3MoKTsgby5jYWxsYmFja3Mub25Ub3RhbFNjcm9sbEJhY2suY2FsbChlbFswXSk7fVxuXHRcdFx0XHRcdFx0XHRkLnR3ZWVuUnVubmluZz1mYWxzZTtcblx0XHRcdFx0XHRcdFx0bUNTQl9jb250YWluZXJbMF0uaWRsZVRpbWVyPTA7XG5cdFx0XHRcdFx0XHRcdF9vbkRyYWdDbGFzc2VzKG1DU0JfZHJhZ2dlcixcImhpZGVcIik7XG5cdFx0XHRcdFx0XHR9LHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHQvKiBjaGVja3MgaWYgY2FsbGJhY2sgZnVuY3Rpb24gZXhpc3RzICovXG5cdFx0XHRmdW5jdGlvbiBfY2IoY2Ipe1xuXHRcdFx0XHRyZXR1cm4gZCAmJiBvLmNhbGxiYWNrc1tjYl0gJiYgdHlwZW9mIG8uY2FsbGJhY2tzW2NiXT09PVwiZnVuY3Rpb25cIjtcblx0XHRcdH1cblx0XHRcdC8qIGNoZWNrcyB3aGV0aGVyIGNhbGxiYWNrIG9mZnNldHMgYWx3YXlzIHRyaWdnZXIgKi9cblx0XHRcdGZ1bmN0aW9uIF9jYk9mZnNldHMoKXtcblx0XHRcdFx0cmV0dXJuIFtvLmNhbGxiYWNrcy5hbHdheXNUcmlnZ2VyT2Zmc2V0cyB8fCBjb250ZW50UG9zPj1saW1pdFswXSt0c28sby5jYWxsYmFja3MuYWx3YXlzVHJpZ2dlck9mZnNldHMgfHwgY29udGVudFBvczw9LXRzYm9dO1xuXHRcdFx0fVxuXHRcdFx0LyogXG5cdFx0XHRwb3B1bGF0ZXMgb2JqZWN0IHdpdGggdXNlZnVsIHZhbHVlcyBmb3IgdGhlIHVzZXIgXG5cdFx0XHR2YWx1ZXM6IFxuXHRcdFx0XHRjb250ZW50OiB0aGlzLm1jcy5jb250ZW50XG5cdFx0XHRcdGNvbnRlbnQgdG9wIHBvc2l0aW9uOiB0aGlzLm1jcy50b3AgXG5cdFx0XHRcdGNvbnRlbnQgbGVmdCBwb3NpdGlvbjogdGhpcy5tY3MubGVmdCBcblx0XHRcdFx0ZHJhZ2dlciB0b3AgcG9zaXRpb246IHRoaXMubWNzLmRyYWdnZXJUb3AgXG5cdFx0XHRcdGRyYWdnZXIgbGVmdCBwb3NpdGlvbjogdGhpcy5tY3MuZHJhZ2dlckxlZnQgXG5cdFx0XHRcdHNjcm9sbGluZyB5IHBlcmNlbnRhZ2U6IHRoaXMubWNzLnRvcFBjdCBcblx0XHRcdFx0c2Nyb2xsaW5nIHggcGVyY2VudGFnZTogdGhpcy5tY3MubGVmdFBjdCBcblx0XHRcdFx0c2Nyb2xsaW5nIGRpcmVjdGlvbjogdGhpcy5tY3MuZGlyZWN0aW9uXG5cdFx0XHQqL1xuXHRcdFx0ZnVuY3Rpb24gX21jcygpe1xuXHRcdFx0XHR2YXIgY3A9W21DU0JfY29udGFpbmVyWzBdLm9mZnNldFRvcCxtQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRMZWZ0XSwgLyogY29udGVudCBwb3NpdGlvbiAqL1xuXHRcdFx0XHRcdGRwPVttQ1NCX2RyYWdnZXJbMF0ub2Zmc2V0VG9wLG1DU0JfZHJhZ2dlclswXS5vZmZzZXRMZWZ0XSwgLyogZHJhZ2dlciBwb3NpdGlvbiAqL1xuXHRcdFx0XHRcdGNsPVttQ1NCX2NvbnRhaW5lci5vdXRlckhlaWdodChmYWxzZSksbUNTQl9jb250YWluZXIub3V0ZXJXaWR0aChmYWxzZSldLCAvKiBjb250ZW50IGxlbmd0aCAqL1xuXHRcdFx0XHRcdHBsPVttQ3VzdG9tU2Nyb2xsQm94LmhlaWdodCgpLG1DdXN0b21TY3JvbGxCb3gud2lkdGgoKV07IC8qIGNvbnRlbnQgcGFyZW50IGxlbmd0aCAqL1xuXHRcdFx0XHRlbFswXS5tY3M9e1xuXHRcdFx0XHRcdGNvbnRlbnQ6bUNTQl9jb250YWluZXIsIC8qIG9yaWdpbmFsIGNvbnRlbnQgd3JhcHBlciBhcyBqcXVlcnkgb2JqZWN0ICovXG5cdFx0XHRcdFx0dG9wOmNwWzBdLGxlZnQ6Y3BbMV0sZHJhZ2dlclRvcDpkcFswXSxkcmFnZ2VyTGVmdDpkcFsxXSxcblx0XHRcdFx0XHR0b3BQY3Q6TWF0aC5yb3VuZCgoMTAwKk1hdGguYWJzKGNwWzBdKSkvKE1hdGguYWJzKGNsWzBdKS1wbFswXSkpLGxlZnRQY3Q6TWF0aC5yb3VuZCgoMTAwKk1hdGguYWJzKGNwWzFdKSkvKE1hdGguYWJzKGNsWzFdKS1wbFsxXSkpLFxuXHRcdFx0XHRcdGRpcmVjdGlvbjpvcHRpb25zLmRpclxuXHRcdFx0XHR9O1xuXHRcdFx0XHQvKiBcblx0XHRcdFx0dGhpcyByZWZlcnMgdG8gdGhlIG9yaWdpbmFsIGVsZW1lbnQgY29udGFpbmluZyB0aGUgc2Nyb2xsYmFyKHMpXG5cdFx0XHRcdHVzYWdlOiB0aGlzLm1jcy50b3AsIHRoaXMubWNzLmxlZnRQY3QgZXRjLiBcblx0XHRcdFx0Ki9cblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XG5cdFx0XG5cdFx0LyogXG5cdFx0Q1VTVE9NIEpBVkFTQ1JJUFQgQU5JTUFUSU9OIFRXRUVOIFxuXHRcdExpZ2h0ZXIgYW5kIGZhc3RlciB0aGFuIGpxdWVyeSBhbmltYXRlKCkgYW5kIGNzcyB0cmFuc2l0aW9ucyBcblx0XHRBbmltYXRlcyB0b3AvbGVmdCBwcm9wZXJ0aWVzIGFuZCBpbmNsdWRlcyBlYXNpbmdzIFxuXHRcdCovXG5cdFx0X3R3ZWVuVG89ZnVuY3Rpb24oZWwscHJvcCx0byxkdXJhdGlvbixlYXNpbmcsb3ZlcndyaXRlLGNhbGxiYWNrcyl7XG5cdFx0XHRpZighZWwuX21Ud2Vlbil7ZWwuX21Ud2Vlbj17dG9wOnt9LGxlZnQ6e319O31cblx0XHRcdHZhciBjYWxsYmFja3M9Y2FsbGJhY2tzIHx8IHt9LFxuXHRcdFx0XHRvblN0YXJ0PWNhbGxiYWNrcy5vblN0YXJ0IHx8IGZ1bmN0aW9uKCl7fSxvblVwZGF0ZT1jYWxsYmFja3Mub25VcGRhdGUgfHwgZnVuY3Rpb24oKXt9LG9uQ29tcGxldGU9Y2FsbGJhY2tzLm9uQ29tcGxldGUgfHwgZnVuY3Rpb24oKXt9LFxuXHRcdFx0XHRzdGFydFRpbWU9X2dldFRpbWUoKSxfZGVsYXkscHJvZ3Jlc3M9MCxmcm9tPWVsLm9mZnNldFRvcCxlbFN0eWxlPWVsLnN0eWxlLF9yZXF1ZXN0LHRvYmo9ZWwuX21Ud2Vlbltwcm9wXTtcblx0XHRcdGlmKHByb3A9PT1cImxlZnRcIil7ZnJvbT1lbC5vZmZzZXRMZWZ0O31cblx0XHRcdHZhciBkaWZmPXRvLWZyb207XG5cdFx0XHR0b2JqLnN0b3A9MDtcblx0XHRcdGlmKG92ZXJ3cml0ZSE9PVwibm9uZVwiKXtfY2FuY2VsVHdlZW4oKTt9XG5cdFx0XHRfc3RhcnRUd2VlbigpO1xuXHRcdFx0ZnVuY3Rpb24gX3N0ZXAoKXtcblx0XHRcdFx0aWYodG9iai5zdG9wKXtyZXR1cm47fVxuXHRcdFx0XHRpZighcHJvZ3Jlc3Mpe29uU3RhcnQuY2FsbCgpO31cblx0XHRcdFx0cHJvZ3Jlc3M9X2dldFRpbWUoKS1zdGFydFRpbWU7XG5cdFx0XHRcdF90d2VlbigpO1xuXHRcdFx0XHRpZihwcm9ncmVzcz49dG9iai50aW1lKXtcblx0XHRcdFx0XHR0b2JqLnRpbWU9KHByb2dyZXNzPnRvYmoudGltZSkgPyBwcm9ncmVzcytfZGVsYXktKHByb2dyZXNzLXRvYmoudGltZSkgOiBwcm9ncmVzcytfZGVsYXktMTtcblx0XHRcdFx0XHRpZih0b2JqLnRpbWU8cHJvZ3Jlc3MrMSl7dG9iai50aW1lPXByb2dyZXNzKzE7fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmKHRvYmoudGltZTxkdXJhdGlvbil7dG9iai5pZD1fcmVxdWVzdChfc3RlcCk7fWVsc2V7b25Db21wbGV0ZS5jYWxsKCk7fVxuXHRcdFx0fVxuXHRcdFx0ZnVuY3Rpb24gX3R3ZWVuKCl7XG5cdFx0XHRcdGlmKGR1cmF0aW9uPjApe1xuXHRcdFx0XHRcdHRvYmouY3VyclZhbD1fZWFzZSh0b2JqLnRpbWUsZnJvbSxkaWZmLGR1cmF0aW9uLGVhc2luZyk7XG5cdFx0XHRcdFx0ZWxTdHlsZVtwcm9wXT1NYXRoLnJvdW5kKHRvYmouY3VyclZhbCkrXCJweFwiO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRlbFN0eWxlW3Byb3BdPXRvK1wicHhcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRvblVwZGF0ZS5jYWxsKCk7XG5cdFx0XHR9XG5cdFx0XHRmdW5jdGlvbiBfc3RhcnRUd2Vlbigpe1xuXHRcdFx0XHRfZGVsYXk9MTAwMC82MDtcblx0XHRcdFx0dG9iai50aW1lPXByb2dyZXNzK19kZWxheTtcblx0XHRcdFx0X3JlcXVlc3Q9KCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSA/IGZ1bmN0aW9uKGYpe190d2VlbigpOyByZXR1cm4gc2V0VGltZW91dChmLDAuMDEpO30gOiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXHRcdFx0XHR0b2JqLmlkPV9yZXF1ZXN0KF9zdGVwKTtcblx0XHRcdH1cblx0XHRcdGZ1bmN0aW9uIF9jYW5jZWxUd2Vlbigpe1xuXHRcdFx0XHRpZih0b2JqLmlkPT1udWxsKXtyZXR1cm47fVxuXHRcdFx0XHRpZighd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSl7Y2xlYXJUaW1lb3V0KHRvYmouaWQpO1xuXHRcdFx0XHR9ZWxzZXt3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodG9iai5pZCk7fVxuXHRcdFx0XHR0b2JqLmlkPW51bGw7XG5cdFx0XHR9XG5cdFx0XHRmdW5jdGlvbiBfZWFzZSh0LGIsYyxkLHR5cGUpe1xuXHRcdFx0XHRzd2l0Y2godHlwZSl7XG5cdFx0XHRcdFx0Y2FzZSBcImxpbmVhclwiOiBjYXNlIFwibWNzTGluZWFyXCI6XG5cdFx0XHRcdFx0XHRyZXR1cm4gYyp0L2QgKyBiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcIm1jc0xpbmVhck91dFwiOlxuXHRcdFx0XHRcdFx0dC89ZDsgdC0tOyByZXR1cm4gYyAqIE1hdGguc3FydCgxIC0gdCp0KSArIGI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiZWFzZUluT3V0U21vb3RoXCI6XG5cdFx0XHRcdFx0XHR0Lz1kLzI7XG5cdFx0XHRcdFx0XHRpZih0PDEpIHJldHVybiBjLzIqdCp0ICsgYjtcblx0XHRcdFx0XHRcdHQtLTtcblx0XHRcdFx0XHRcdHJldHVybiAtYy8yICogKHQqKHQtMikgLSAxKSArIGI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiZWFzZUluT3V0U3Ryb25nXCI6XG5cdFx0XHRcdFx0XHR0Lz1kLzI7XG5cdFx0XHRcdFx0XHRpZih0PDEpIHJldHVybiBjLzIgKiBNYXRoLnBvdyggMiwgMTAgKiAodCAtIDEpICkgKyBiO1xuXHRcdFx0XHRcdFx0dC0tO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGMvMiAqICggLU1hdGgucG93KCAyLCAtMTAgKiB0KSArIDIgKSArIGI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiZWFzZUluT3V0XCI6IGNhc2UgXCJtY3NFYXNlSW5PdXRcIjpcblx0XHRcdFx0XHRcdHQvPWQvMjtcblx0XHRcdFx0XHRcdGlmKHQ8MSkgcmV0dXJuIGMvMip0KnQqdCArIGI7XG5cdFx0XHRcdFx0XHR0LT0yO1xuXHRcdFx0XHRcdFx0cmV0dXJuIGMvMioodCp0KnQgKyAyKSArIGI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiZWFzZU91dFNtb290aFwiOlxuXHRcdFx0XHRcdFx0dC89ZDsgdC0tO1xuXHRcdFx0XHRcdFx0cmV0dXJuIC1jICogKHQqdCp0KnQgLSAxKSArIGI7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwiZWFzZU91dFN0cm9uZ1wiOlxuXHRcdFx0XHRcdFx0cmV0dXJuIGMgKiAoIC1NYXRoLnBvdyggMiwgLTEwICogdC9kICkgKyAxICkgKyBiO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSBcImVhc2VPdXRcIjogY2FzZSBcIm1jc0Vhc2VPdXRcIjogZGVmYXVsdDpcblx0XHRcdFx0XHRcdHZhciB0cz0odC89ZCkqdCx0Yz10cyp0O1xuXHRcdFx0XHRcdFx0cmV0dXJuIGIrYyooMC40OTk5OTk5OTk5OTk5OTcqdGMqdHMgKyAtMi41KnRzKnRzICsgNS41KnRjICsgLTYuNSp0cyArIDQqdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LFxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XG5cdFx0XG5cdFx0LyogcmV0dXJucyBjdXJyZW50IHRpbWUgKi9cblx0XHRfZ2V0VGltZT1mdW5jdGlvbigpe1xuXHRcdFx0aWYod2luZG93LnBlcmZvcm1hbmNlICYmIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cpe1xuXHRcdFx0XHRyZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuXHRcdFx0fWVsc2V7XG5cdFx0XHRcdGlmKHdpbmRvdy5wZXJmb3JtYW5jZSAmJiB3aW5kb3cucGVyZm9ybWFuY2Uud2Via2l0Tm93KXtcblx0XHRcdFx0XHRyZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLndlYmtpdE5vdygpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRpZihEYXRlLm5vdyl7cmV0dXJuIERhdGUubm93KCk7fWVsc2V7cmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO31cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiBzdG9wcyBhIHR3ZWVuICovXG5cdFx0X3N0b3BUd2Vlbj1mdW5jdGlvbigpe1xuXHRcdFx0dmFyIGVsPXRoaXM7XG5cdFx0XHRpZighZWwuX21Ud2Vlbil7ZWwuX21Ud2Vlbj17dG9wOnt9LGxlZnQ6e319O31cblx0XHRcdHZhciBwcm9wcz1bXCJ0b3BcIixcImxlZnRcIl07XG5cdFx0XHRmb3IodmFyIGk9MDsgaTxwcm9wcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdHZhciBwcm9wPXByb3BzW2ldO1xuXHRcdFx0XHRpZihlbC5fbVR3ZWVuW3Byb3BdLmlkKXtcblx0XHRcdFx0XHRpZighd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSl7Y2xlYXJUaW1lb3V0KGVsLl9tVHdlZW5bcHJvcF0uaWQpO1xuXHRcdFx0XHRcdH1lbHNle3dpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShlbC5fbVR3ZWVuW3Byb3BdLmlkKTt9XG5cdFx0XHRcdFx0ZWwuX21Ud2Vlbltwcm9wXS5pZD1udWxsO1xuXHRcdFx0XHRcdGVsLl9tVHdlZW5bcHJvcF0uc3RvcD0xO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFxuXHRcdFxuXHRcdC8qIGRlbGV0ZXMgYSBwcm9wZXJ0eSAoYXZvaWRpbmcgdGhlIGV4Y2VwdGlvbiB0aHJvd24gYnkgSUUpICovXG5cdFx0X2RlbGV0ZT1mdW5jdGlvbihjLG0pe1xuXHRcdFx0dHJ5e2RlbGV0ZSBjW21dO31jYXRjaChlKXtjW21dPW51bGw7fVxuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiBkZXRlY3RzIGxlZnQgbW91c2UgYnV0dG9uICovXG5cdFx0X21vdXNlQnRuTGVmdD1mdW5jdGlvbihlKXtcblx0XHRcdHJldHVybiAhKGUud2hpY2ggJiYgZS53aGljaCE9PTEpO1xuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiBkZXRlY3RzIGlmIHBvaW50ZXIgdHlwZSBldmVudCBpcyB0b3VjaCAqL1xuXHRcdF9wb2ludGVyVG91Y2g9ZnVuY3Rpb24oZSl7XG5cdFx0XHR2YXIgdD1lLm9yaWdpbmFsRXZlbnQucG9pbnRlclR5cGU7XG5cdFx0XHRyZXR1cm4gISh0ICYmIHQhPT1cInRvdWNoXCIgJiYgdCE9PTIpO1xuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiBjaGVja3MgaWYgdmFsdWUgaXMgbnVtZXJpYyAqL1xuXHRcdF9pc051bWVyaWM9ZnVuY3Rpb24odmFsKXtcblx0XHRcdHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdCh2YWwpKSAmJiBpc0Zpbml0ZSh2YWwpO1xuXHRcdH0sXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblx0XHRcblx0XHRcblx0XHQvKiByZXR1cm5zIGVsZW1lbnQgcG9zaXRpb24gYWNjb3JkaW5nIHRvIGNvbnRlbnQgKi9cblx0XHRfY2hpbGRQb3M9ZnVuY3Rpb24oZWwpe1xuXHRcdFx0dmFyIHA9ZWwucGFyZW50cyhcIi5tQ1NCX2NvbnRhaW5lclwiKTtcblx0XHRcdHJldHVybiBbZWwub2Zmc2V0KCkudG9wLXAub2Zmc2V0KCkudG9wLGVsLm9mZnNldCgpLmxlZnQtcC5vZmZzZXQoKS5sZWZ0XTtcblx0XHR9LFxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cdFx0XG5cdFx0XG5cdFx0LyogY2hlY2tzIGlmIGJyb3dzZXIgdGFiIGlzIGhpZGRlbi9pbmFjdGl2ZSB2aWEgUGFnZSBWaXNpYmlsaXR5IEFQSSAqL1xuXHRcdF9pc1RhYkhpZGRlbj1mdW5jdGlvbigpe1xuXHRcdFx0dmFyIHByb3A9X2dldEhpZGRlblByb3AoKTtcblx0XHRcdGlmKCFwcm9wKSByZXR1cm4gZmFsc2U7XG5cdFx0XHRyZXR1cm4gZG9jdW1lbnRbcHJvcF07XG5cdFx0XHRmdW5jdGlvbiBfZ2V0SGlkZGVuUHJvcCgpe1xuXHRcdFx0XHR2YXIgcGZ4PVtcIndlYmtpdFwiLFwibW96XCIsXCJtc1wiLFwib1wiXTtcblx0XHRcdFx0aWYoXCJoaWRkZW5cIiBpbiBkb2N1bWVudCkgcmV0dXJuIFwiaGlkZGVuXCI7IC8vbmF0aXZlbHkgc3VwcG9ydGVkXG5cdFx0XHRcdGZvcih2YXIgaT0wOyBpPHBmeC5sZW5ndGg7IGkrKyl7IC8vcHJlZml4ZWRcblx0XHRcdFx0ICAgIGlmKChwZnhbaV0rXCJIaWRkZW5cIikgaW4gZG9jdW1lbnQpIFxuXHRcdFx0XHQgICAgICAgIHJldHVybiBwZnhbaV0rXCJIaWRkZW5cIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbnVsbDsgLy9ub3Qgc3VwcG9ydGVkXG5cdFx0XHR9XG5cdFx0fTtcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXHRcdFxuXHRcblx0XG5cdFxuXHRcblx0LyogXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblx0UExVR0lOIFNFVFVQIFxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdCovXG5cdFxuXHQvKiBwbHVnaW4gY29uc3RydWN0b3IgZnVuY3Rpb25zICovXG5cdCQuZm5bcGx1Z2luTlNdPWZ1bmN0aW9uKG1ldGhvZCl7IC8qIHVzYWdlOiAkKHNlbGVjdG9yKS5tQ3VzdG9tU2Nyb2xsYmFyKCk7ICovXG5cdFx0aWYobWV0aG9kc1ttZXRob2RdKXtcblx0XHRcdHJldHVybiBtZXRob2RzW21ldGhvZF0uYXBwbHkodGhpcyxBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSkpO1xuXHRcdH1lbHNlIGlmKHR5cGVvZiBtZXRob2Q9PT1cIm9iamVjdFwiIHx8ICFtZXRob2Qpe1xuXHRcdFx0cmV0dXJuIG1ldGhvZHMuaW5pdC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XG5cdFx0fWVsc2V7XG5cdFx0XHQkLmVycm9yKFwiTWV0aG9kIFwiK21ldGhvZCtcIiBkb2VzIG5vdCBleGlzdFwiKTtcblx0XHR9XG5cdH07XG5cdCRbcGx1Z2luTlNdPWZ1bmN0aW9uKG1ldGhvZCl7IC8qIHVzYWdlOiAkLm1DdXN0b21TY3JvbGxiYXIoKTsgKi9cblx0XHRpZihtZXRob2RzW21ldGhvZF0pe1xuXHRcdFx0cmV0dXJuIG1ldGhvZHNbbWV0aG9kXS5hcHBseSh0aGlzLEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKSk7XG5cdFx0fWVsc2UgaWYodHlwZW9mIG1ldGhvZD09PVwib2JqZWN0XCIgfHwgIW1ldGhvZCl7XG5cdFx0XHRyZXR1cm4gbWV0aG9kcy5pbml0LmFwcGx5KHRoaXMsYXJndW1lbnRzKTtcblx0XHR9ZWxzZXtcblx0XHRcdCQuZXJyb3IoXCJNZXRob2QgXCIrbWV0aG9kK1wiIGRvZXMgbm90IGV4aXN0XCIpO1xuXHRcdH1cblx0fTtcblx0XG5cdC8qIFxuXHRhbGxvdyBzZXR0aW5nIHBsdWdpbiBkZWZhdWx0IG9wdGlvbnMuIFxuXHR1c2FnZTogJC5tQ3VzdG9tU2Nyb2xsYmFyLmRlZmF1bHRzLnNjcm9sbEluZXJ0aWE9NTAwOyBcblx0dG8gYXBwbHkgYW55IGNoYW5nZWQgZGVmYXVsdCBvcHRpb25zIG9uIGRlZmF1bHQgc2VsZWN0b3JzIChiZWxvdyksIHVzZSBpbnNpZGUgZG9jdW1lbnQgcmVhZHkgZm4gXG5cdGUuZy46ICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7ICQubUN1c3RvbVNjcm9sbGJhci5kZWZhdWx0cy5zY3JvbGxJbmVydGlhPTUwMDsgfSk7XG5cdCovXG5cdCRbcGx1Z2luTlNdLmRlZmF1bHRzPWRlZmF1bHRzO1xuXHRcblx0LyogXG5cdGFkZCB3aW5kb3cgb2JqZWN0ICh3aW5kb3cubUN1c3RvbVNjcm9sbGJhcikgXG5cdHVzYWdlOiBpZih3aW5kb3cubUN1c3RvbVNjcm9sbGJhcil7Y29uc29sZS5sb2coXCJjdXN0b20gc2Nyb2xsYmFyIHBsdWdpbiBsb2FkZWRcIik7fVxuXHQqL1xuXHR3aW5kb3dbcGx1Z2luTlNdPXRydWU7XG5cdFxuXHQkKHdpbmRvdykuYmluZChcImxvYWRcIixmdW5jdGlvbigpe1xuXHRcdFxuXHRcdCQoZGVmYXVsdFNlbGVjdG9yKVtwbHVnaW5OU10oKTsgLyogYWRkIHNjcm9sbGJhcnMgYXV0b21hdGljYWxseSBvbiBkZWZhdWx0IHNlbGVjdG9yICovXG5cdFx0XG5cdFx0LyogZXh0ZW5kIGpRdWVyeSBleHByZXNzaW9ucyAqL1xuXHRcdCQuZXh0ZW5kKCQuZXhwcltcIjpcIl0se1xuXHRcdFx0LyogY2hlY2tzIGlmIGVsZW1lbnQgaXMgd2l0aGluIHNjcm9sbGFibGUgdmlld3BvcnQgKi9cblx0XHRcdG1jc0luVmlldzokLmV4cHJbXCI6XCJdLm1jc0luVmlldyB8fCBmdW5jdGlvbihlbCl7XG5cdFx0XHRcdHZhciAkZWw9JChlbCksY29udGVudD0kZWwucGFyZW50cyhcIi5tQ1NCX2NvbnRhaW5lclwiKSx3cmFwcGVyLGNQb3M7XG5cdFx0XHRcdGlmKCFjb250ZW50Lmxlbmd0aCl7cmV0dXJuO31cblx0XHRcdFx0d3JhcHBlcj1jb250ZW50LnBhcmVudCgpO1xuXHRcdFx0XHRjUG9zPVtjb250ZW50WzBdLm9mZnNldFRvcCxjb250ZW50WzBdLm9mZnNldExlZnRdO1xuXHRcdFx0XHRyZXR1cm4gXHRjUG9zWzBdK19jaGlsZFBvcygkZWwpWzBdPj0wICYmIGNQb3NbMF0rX2NoaWxkUG9zKCRlbClbMF08d3JhcHBlci5oZWlnaHQoKS0kZWwub3V0ZXJIZWlnaHQoZmFsc2UpICYmIFxuXHRcdFx0XHRcdFx0Y1Bvc1sxXStfY2hpbGRQb3MoJGVsKVsxXT49MCAmJiBjUG9zWzFdK19jaGlsZFBvcygkZWwpWzFdPHdyYXBwZXIud2lkdGgoKS0kZWwub3V0ZXJXaWR0aChmYWxzZSk7XG5cdFx0XHR9LFxuXHRcdFx0LyogY2hlY2tzIGlmIGVsZW1lbnQgb3IgcGFydCBvZiBlbGVtZW50IGlzIGluIHZpZXcgb2Ygc2Nyb2xsYWJsZSB2aWV3cG9ydCAqL1xuXHRcdFx0bWNzSW5TaWdodDokLmV4cHJbXCI6XCJdLm1jc0luU2lnaHQgfHwgZnVuY3Rpb24oZWwsaSxtKXtcblx0XHRcdFx0dmFyICRlbD0kKGVsKSxlbEQsY29udGVudD0kZWwucGFyZW50cyhcIi5tQ1NCX2NvbnRhaW5lclwiKSx3cmFwcGVyVmlldyxwb3Msd3JhcHBlclZpZXdQY3QsXG5cdFx0XHRcdFx0cGN0VmFscz1tWzNdPT09XCJleGFjdFwiID8gW1sxLDBdLFsxLDBdXSA6IFtbMC45LDAuMV0sWzAuNiwwLjRdXTtcblx0XHRcdFx0aWYoIWNvbnRlbnQubGVuZ3RoKXtyZXR1cm47fVxuXHRcdFx0XHRlbEQ9WyRlbC5vdXRlckhlaWdodChmYWxzZSksJGVsLm91dGVyV2lkdGgoZmFsc2UpXTtcblx0XHRcdFx0cG9zPVtjb250ZW50WzBdLm9mZnNldFRvcCtfY2hpbGRQb3MoJGVsKVswXSxjb250ZW50WzBdLm9mZnNldExlZnQrX2NoaWxkUG9zKCRlbClbMV1dO1xuXHRcdFx0XHR3cmFwcGVyVmlldz1bY29udGVudC5wYXJlbnQoKVswXS5vZmZzZXRIZWlnaHQsY29udGVudC5wYXJlbnQoKVswXS5vZmZzZXRXaWR0aF07XG5cdFx0XHRcdHdyYXBwZXJWaWV3UGN0PVtlbERbMF08d3JhcHBlclZpZXdbMF0gPyBwY3RWYWxzWzBdIDogcGN0VmFsc1sxXSxlbERbMV08d3JhcHBlclZpZXdbMV0gPyBwY3RWYWxzWzBdIDogcGN0VmFsc1sxXV07XG5cdFx0XHRcdHJldHVybiBcdHBvc1swXS0od3JhcHBlclZpZXdbMF0qd3JhcHBlclZpZXdQY3RbMF1bMF0pPDAgJiYgcG9zWzBdK2VsRFswXS0od3JhcHBlclZpZXdbMF0qd3JhcHBlclZpZXdQY3RbMF1bMV0pPj0wICYmIFxuXHRcdFx0XHRcdFx0cG9zWzFdLSh3cmFwcGVyVmlld1sxXSp3cmFwcGVyVmlld1BjdFsxXVswXSk8MCAmJiBwb3NbMV0rZWxEWzFdLSh3cmFwcGVyVmlld1sxXSp3cmFwcGVyVmlld1BjdFsxXVsxXSk+PTA7XG5cdFx0XHR9LFxuXHRcdFx0LyogY2hlY2tzIGlmIGVsZW1lbnQgaXMgb3ZlcmZsb3dlZCBoYXZpbmcgdmlzaWJsZSBzY3JvbGxiYXIocykgKi9cblx0XHRcdG1jc092ZXJmbG93OiQuZXhwcltcIjpcIl0ubWNzT3ZlcmZsb3cgfHwgZnVuY3Rpb24oZWwpe1xuXHRcdFx0XHR2YXIgZD0kKGVsKS5kYXRhKHBsdWdpblBmeCk7XG5cdFx0XHRcdGlmKCFkKXtyZXR1cm47fVxuXHRcdFx0XHRyZXR1cm4gZC5vdmVyZmxvd2VkWzBdIHx8IGQub3ZlcmZsb3dlZFsxXTtcblx0XHRcdH1cblx0XHR9KTtcblx0XG5cdH0pO1xuXG59KSl9KSk7Il0sImZpbGUiOiJleHQvanF1ZXJ5Lm1DdXN0b21TY3JvbGxiYXIuanMifQ==
