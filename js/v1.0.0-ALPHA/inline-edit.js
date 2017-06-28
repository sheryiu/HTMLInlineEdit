var inlineEditButtonContent = {};
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
	if (cell.dataset.inlinemode == "button") {
		inlineEditButtonContent[rowName] = cell.innerHTML;
		cellContent += "<input type='submit' value='Finish' form='"+rowName+"Form'/>";
	} else {
		cellContent += "<input type='text' value='"+inlineEditRowContents[rowName][i]+"' form='"+rowName+"Form'/>";
		if (i === 0) {
			cellContent += "<form id='"+rowName+"Form'></form>";
		}
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
		if (cell.dataset.inlinemode != "button") {
			rowData[cell.dataset.inlinename] = cell.children[0].value;
			inlineEditRowContents[rowName][i] = cell.children[0].value;
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
	if (cell.dataset.inlinemode == "button") {
		cellContent += inlineEditButtonContent[rowName];
	} else {
		cellContent += inlineEditRowContents[rowName][i];
	}
	cell.innerHTML = cellContent;
}