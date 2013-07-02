
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

ScrollPatrol.prototype.add = function( input ){
	var element = document.getElementById( input.id );
	this.listeners.push( {
		element: element,
		enter: this.createBreakerFunction( input.enter ),
		leave: this.createBreakerFunction( input.leave )
	} );
};

ScrollPatrol.prototype.check = function(){
	var scroll_position = ( window.pageYOffset !== undefined ) ? window.pageYOffset : ( document.documentElement || document.body.parentNode || document.body ).scrollTop;
	var min, max;
	for( var i = 0, n; n = this.listeners[i]; i += 1 ){
		min = n.element.offsetTop - this.offset;
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
