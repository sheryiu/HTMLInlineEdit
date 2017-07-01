var inlineEditRowContents = {};

function inlineEdit(rowName, options) {
	var tableRow = document.getElementById(rowName);
	inlineEditRowContents[rowName] = {};
	for (var i=0; i<tableRow.childElementCount; i++) {
		var cell = tableRow.children[i];
		inlineEditRowContents[rowName][i] = cell.innerHTML;
		if (options.hasOwnProperty("updateCell"))
			options.updateCell(cell, i, rowName, options);
		else
			inlineDefaultUpdateCell(cell, i, rowName, options);
	}
}

function inlineDefaultUpdateCell(cell, i, rowName, options) {
	var cellContent = "";
	if (i === 0) {
		cellContent += "<form id='"+rowName+"Form'></form>";
	}
	switch (cell.dataset.inlinetype) {
		case "doneButton":
			cellContent += "<input type='submit' value='Finish' form='"+rowName+"Form'/>";
			break;
		case "button":
			cellContent += cell.innerHTML;
			break;
		case "text":
			cellContent += "<input type='text' value='"+inlineEditRowContents[rowName][i]+"' form='"+rowName+"Form'";
			for (var key in cell.dataset) {
				if (cell.dataset.hasOwnProperty(key) && key.substr(0, 6) == "inline") {
					cellContent += " "+key.substr(6)+"='"+cell.dataset[key]+"'";
				}
			}
			cellContent += "/>";
			break;
	}
	cell.innerHTML = cellContent;
	if (i === 0) {
		// set the onsubmit function of the form of this row
		document.getElementById(rowName+"Form").onsubmit = function () {
			event.preventDefault();
			if (this.reportValidity()) {
				if (options.hasOwnProperty("finish"))
					options.finish(rowName, options);
				else
					inlineDefaultFinish(rowName, options);
			}
		};
	}
}

function inlineDefaultFinish(rowName, options) {
	var tableRow = document.getElementById(rowName);
	var rowData = {};
	for (var i=0; i<tableRow.childElementCount; i++) {
		var cell = tableRow.children[i];
		if (cell.dataset.inlinetype != "doneButton") {
			if (i == 0) {
				rowData[cell.dataset.inlinename] = cell.children[1].value;
				inlineEditRowContents[rowName][i] = cell.children[1].value;
			} else {
				rowData[cell.dataset.inlinename] = cell.children[0].value;
				inlineEditRowContents[rowName][i] = cell.children[0].value;
			}
		}
	}
	
	// do whatever ajax magic
	if (options.hasOwnProperty("finishCallback"))
		options.finishCallback(rowData, rowName);
	
	for (i=0; i<tableRow.childElementCount; i++) {
		var cell = tableRow.children[i];
		if (options.hasOwnProperty("finishCell"))
			options.finishCell(cell, i, rowName);
		else
			inlineDefaultFinishCell(cell, i, rowName);
	}
}

function inlineDefaultFinishCell(cell, i, rowName) {
	var cellContent = "";
	cellContent += inlineEditRowContents[rowName][i];
	cell.innerHTML = cellContent;
}