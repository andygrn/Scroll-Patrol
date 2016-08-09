( function(){
	'use strict';

	function ScrollPatrol( offset ){
		this.listeners = [];
		this.offset = offset;
		var _self = this;
		var tick = function(){
			_self.check();
		};
		if( window.addEventListener ){
			window.addEventListener( 'scroll', tick, false );
		}
		else if( window.attachEvent ){
			window.attachEvent( 'onscroll', tick );
		}
	}

	ScrollPatrol.prototype.getOffsetTop = function( element ){
		var offset = 0;
		if( element.offsetParent ){
			do {
				offset += element.offsetTop;
				element = element.offsetParent;
			} while ( element );
		}
		offset = Math.max( offset, 0 );
		return offset;
	};

	ScrollPatrol.prototype.add = function( input ){
		var enter = input.enter || function(){};
		var leave = input.leave || function(){};
		this.listeners.push( {
			element: input.element,
			enter: this.createBreakerFunction( enter ),
			leave: this.createBreakerFunction( leave )
		} );
		this.check();
	};

	ScrollPatrol.prototype.check = function(){
		var scroll_position = ( window.pageYOffset !== undefined ) ? window.pageYOffset : ( document.documentElement || document.body.parentNode || document.body ).scrollTop;
		var min, max;
		for( var i = 0, n; n = this.listeners[i]; i += 1 ){
			min = this.getOffsetTop( n.element ) - this.offset;
			max = min + n.element.offsetHeight;
			if( scroll_position >= min && scroll_position <= max ){
				n.leave.reset();
				n.enter( n.element, scroll_position );
			}
			else{
				n.enter.reset();
				n.leave( n.element, scroll_position );
			}
		}
	};

	ScrollPatrol.prototype.createBreakerFunction = function( func ){
		var wrap = function(){
			if( !wrap.called ){
				wrap.called = true;
				func.apply( func, arguments );
			}
		};
		wrap.reset = function(){
			this.called = false;
		};
		return wrap;
	};

	window.ScrollPatrol = ScrollPatrol;
} )();