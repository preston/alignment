/**
 * Copyright 2014 Preston Lee. All rights reserved.
 */

$(function() {
	console.log("Initializing page.");
	$('#results').hide();
	$("body").on('keyup', '#sequence_form input', function() {
		console.log("Form changed!");

		var s1 = $('#sequence1').val().toUpperCase();
		var s2 = $('#sequence2').val().toUpperCase();
		if(s1.length > 0 && s2.length > 0) {
			clearVisualizations();
			$('#results').slideDown();
			var data = generateMatrixData(s1, s2);
			refreshVizualization(data, 'matches');
			var scored = generateScoredData(s1, s2, data);
			refreshVizualization(scored, 'scored');
			var alignments = addTraceData(s1, s2, scored);
			refreshVizualization(scored, 'trace');
			refreshAlignments(alignments);
		} else {
			clearVisualizations();
			$('#results').slideUp();
		}
	});
});

function clearVisualizations() {
	$('#matches').innerHTML = '';
	$('#scored').innerHTML = '';
	$('#trace').innerHTML = '';
	$('#alignments').innerHTML = '';
}

function refreshAlignments(alignments) {
	var html = '';
	html += '<h1>' + alignments[0] + '</h1>';
	html += '<h1>' + alignments[1] + '</h1>';
	$('#alignments').html(html);
}

function refreshVizualization(data, elem) {
	var m = $('#' + elem);

	var html = '<table class="table table-striped table-condensed"><tbody>';
	for (var y = 0, len = data.length; y < len; ++y) {
	    html += '<tr>';
	    for (var x = 0, rowLen = data[y].length; x < rowLen; ++x ) {
	        html += '<td class="' + '">' + data[y][x] + '</td>';
	    }
	    html += "</tr>";
	}
	html += '</tbody></table>';
	
	// $(html).appendTo(m);
	m.html(html);
}

function addTraceData(s1, s2, trace) {
	var rows = trace.length - 1;
	var cols = trace[0].length - 1;
	// Deep copy.
	// var trace = $.extend(true, [], scored);
	// trace.shift().shift();

	// Walk it!
	var s1aligned = [];
	var s2aligned = [];
	// xOffset = 1;
	// yOffset = 1;
	var best, bestX, bestY, curX, curY;
	var strings = ['', ''];
	for(curX = 1, curY = 1; curX <= cols && curY <= rows;) {
		best = -1;
		bestX = curX;
		bestY = curY;
		for (var y = curY; y <= rows; y++) {
			if(trace[y][0] == trace[0][curX] && trace[y][curX] > best) {
				best = trace[y][curX];
				bestX = curX;
				bestY = y;
			}
		}
    	for (var x = curX; x <= cols; x++) {
			if(trace[curY][0] == trace[0][x] && trace[curY][x] > best) {
				best = trace[curY][x];
				bestX = x;
				bestY = curY;
			}
    	}
    	trace[bestY][bestX] = '<span class="bg-danger"><b>&nbsp;' + trace[bestY][bestX] + '&nbsp;</b></span>';
    	var diffX = bestX - curX;
    	var diffY = bestY - curY;
    	strings[0] += repeat('-', diffY);
    	strings[1] += repeat('-', diffX);
    	for(var i = 0; i < diffX && curX + i <= cols; i++) {
    		strings[0] += trace[0][curX + i];
	    	// strings[1] += trace[curX + i][0];
    	}
    	for(var i = 0; i < diffY && curY + i <= rows; i++) {
    		strings[1] += trace[curY + i][0];
	    	// strings[0] += trace[0][curY + i];
    	}
    	strings[0] += trace[0][bestX];
    	strings[1] += trace[bestY][0];
    	curX = bestX + 1;
    	curY = bestY + 1;
    	// if(curX > cols && curY <= rows) {
    	// 	curX = cols;
    	// }
    	// if(curY > rows && curX <= cols) {
    	// 	curY = rows;
    	// }
	}
	// Add whatever crap is left over.
	for(var i = curX; i <= cols; i++) {
		strings[0] += trace[0][i];
		strings[1] += '-';
	}
	for(var i = curY; i <= rows; i++) {
		strings[1] += trace[i][0];
		strings[0] += '-';
	}
	return strings;
}

function generateScoredData(s1, s2, data) {
	var rows = data.length - 1;
	var cols = data[0].length - 1;
	var scored = createBaseMatrix(s1, s2);
	// Walk the entire table.
	var cur;
	var max;
	for(var y = rows; y > 0; y--) {
		for(var x = cols; x > 0; x--) {
			if(x == 3 && y == 3) {
				console.log('start');
			}
			cur = data[y][x];
			max = -1;
			// Walk column sub-scores.
			for(var subY = y + 1; (subY <= rows) && (x + 1 <= cols); subY++) {
				max = Math.max(max, scored[subY][x+1]);
			}
			// Walk row sub-scores.
			for(var subX = x + 1; (subX <= cols) && (y + 1 <= rows); subX++) {
				max = Math.max(max, scored[y+1][subX]);
			}
			if(max >= 0) {
				scored[y][x] = cur + max;			
			} else {
				// It's the bottom-most or right-most row, so just copy the source data row.
				scored[y][x] = data[y][x];
			}
		}
	}
	return scored;
}

function createBaseMatrix(s1, s2) {
	var data = [];
	data.push([''].concat(s1.split('')));
	for(var i = 0; i < s2.length; i++) {
		data.push([s2.charAt(i)]);
	}
	return data;
}

function generateMatrixData(s1, s2) {
	var columns = s1.length;
	var rows = s2.length;
	var data = createBaseMatrix(s1, s2);
	// data.push([''].concat(s1.split('')));
	for(var y = 0; y < rows; y++) {
		// data.push([]);
		// data[y + 1].push(s2.charAt(y));
		for(var x = 0; x < columns; x++) {
			if(s1.charAt(x) == s2.charAt(y)) {
				data[y + 1].push(1);
			} else {
				data[y + 1].push(0);				
			}
		}
	}
	return data;
}
