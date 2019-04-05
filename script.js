$('document').ready(function( ) {
    var shape;
    
    var width = $('.drawing.segment').width( ), height = 300;
    
    var svg = d3.select(".drawing.segment").append("svg")
	.attr("width", width+"px")
	.attr("height", height+"px")
	.attr("class", "drawing");
    
    $('.ui.dropdown')
	.dropdown()
    ;
    
    $('.ui.shape.dropdown')
	.dropdown({
    	    onChange: function(value){
		switch(value) {
		case "circle":
    		    shape = circle([width/2,height/2], 100);
		    var line = d3.line( );
		    svg.append("path")
			.attr("class", "shape")
			.attr("d", line(shape));
		    
		}
	    }
	})
    ;
    
    $('.sample-tol').change(function(){
  	$('.ui.tol.label').html($(this).val( ));
    });
    $('.sample-size').change(function(){
  	$('.ui.size.label').html($(this).val( ));
    });
    $('.scale').change(function(){
  	$('.ui.scale.label').html($(this).val( ));
    });
    
    $('.sample.button').click(function(){
  	sample(tol, size);
    })
});


// Draw a circle
function circle(center, radius, range=[0,1], n=100) {
    var t = d3.range(n).map(function(d) {
  	return range[0] + (range[1]-range[0])*d/(n-1);
    }); 
    var points = [];
    for(var i=0; i<n; i++) {
  	points[i] = [center[0] + radius*Math.cos(2*Math.PI*t[i]), 
  	             center[1] + radius*Math.sin(2*Math.PI*t[i])];
    }
    return points;
}

// Sample a set with noise
function sample(points,tol,size) {
    if(size > points.length)
	return [];
    else
	return d3.range(size).map(function(d){ return points[d3.uniformRandom(size)]; });
}

// Compute distance of two points in 2D 
function dist2(a,b){
    if( a.length != b.length || a.length != 2 )
	return null;
    return Math.sqrt( Math.pow(a[0]-b[0],2) + Math.pow(a[1]-b[1],2) );
}

// Compute diameter of points in 2D
function diam2(points) {
    var diam = 0;
    points.forEach(function(p) {
	points.forEach(function(q) {
	    diam = Math.max(diam, dist2(p,q));
	});
    });
    return diam;
}

// Compute Hausdorff distance in 2D
function H2(A,B) {
    var d=0;
    
    // Return if the sets are empty
    if(A.length==0 || B.length==0)
    	return null;
    
    // Distance A to B
    A.forEach(function(a) {
   	var k=Infinity;
	B.forEach(function(b) {
      	    k = Math.min(k, norm2(a,b));
	});
    	d = Math.max(d,k); 
    });
    
    // Distance B to A
    B.forEach(function(b) {
   	var k=Infinity;
	A.forEach(function(a) {
      	    k = Math.min(k, norm2(a,b));
	});
    	d = Math.max(d,k); 
    });
    return d; 
}

// Compute all combinations of k elements from a set
function combinations(set, k) {
    var i, j, combs, head, tailcombs;
    if (k > set.length || k <= 0) {
	return [];
    }
    if (k == set.length) {
	return [set];
    }
    if (k == 1) {
	combs = [];
	for (i = 0; i < set.length; i++) {
	    combs.push([set[i]]);
	}
	return combs;
    }
    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
	head = set.slice(i, i + 1);
	tailcombs = combinations(set.slice(i + 1), k - 1);
	for (j = 0; j < tailcombs.length; j++) {
	    combs.push(head.concat(tailcombs[j]));
	}
    }
    return combs
}