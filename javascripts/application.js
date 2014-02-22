$(function() {
	console.log("Initializing page.");
	$("body").on('keyup', '#sequence_form input', function() {
		console.log("Form changed!");

		var s1 = $('#sequence1').val().toUpperCase();
		var s2 = $('#sequence2').val().toUpperCase();
		if(s1.length > 0 && s2.length > 0) {
			clearVisualizations();
			var data = generateMatrixData(s1, s2);
			refreshVizualization(data, 'matches');
			var scored = generateScoredData(s1, s2, data);
			refreshVizualization(scored, 'scored');
		} else {
			clearVisualizations();
		}
	});
});

function clearVisualizations() {
	$('#matches').innerHTML = '';
	$('#scored').innerHTML = '';

}

function refreshVizualization(data, elem) {
	var m = $('#' + elem);

	var html = '<table class="table table-striped table-condensed"><tbody>';
	for (var y = 0, len = data.length; y < len; ++y) {
	    html += '<tr>';
	    for (var x = 0, rowLen = data[y].length; x < rowLen; ++x ) {
	        html += '<td>' + data[y][x] + '</td>';
	    }
	    html += "</tr>";
	}
	html += '</tbody></table>';
	
	// $(html).appendTo(m);
	m.html(html);
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
				console.log(dump(scored));				
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



function dump(obj, indent)
{
  var result = "";
  if (indent == null) indent = "";

  for (var property in obj)
  {
    var value = obj[property];
    if (typeof value == 'string')
      value = "'" + value + "'";
    else if (typeof value == 'object')
    {
      if (value instanceof Array)
      {
        // Just let JS convert the Array to a string!
        value = "[ " + value + " ]";
      }
      else
      {
        // Recursive dump
        // (replace "  " by "\t" or something else if you prefer)
        var od = dump(value, indent + "  ");
        // If you like { on the same line as the key
        //value = "{\n" + od + "\n" + indent + "}";
        // If you prefer { and } to be aligned
        value = "\n" + indent + "{\n" + od + "\n" + indent + "}";
      }
    }
    result += indent + "'" + property + "' : " + value + ",\n";
  }
  return result.replace(/,\n$/, "");
}