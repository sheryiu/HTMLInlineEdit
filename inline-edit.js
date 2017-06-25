var inlineEditButtonContent = {};

function inlineEdit(rowName, callback, updateCellFunc, finishFunc) {
	var tableRow = document.getElementById(rowName);
	for (var i=0; i<tableRow.childElementCount; i++) {
		var cell = tableRow.children[i];
		updateCellFunc(cell, i, rowName, callback, finishFunc);
	}
}

function inlineDefaultUpdateCell(cell, i, rowName, callback, finishFunc) {
	var cellContent = "";
	if (cell.dataset.inlinemode == "button") {
		inlineEditButtonContent[rowName] = cell.innerHTML;
		cellContent += "<input type='submit' value='Finish' form='"+rowName+"Form'/>";
	} else {
		cellContent += "<input type='text' value='"+cell.dataset.inlinevalue+"' form='"+rowName+"Form'/>";
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
				finishFunc(rowName, callback);
			}
		};
	}
}

function inlineDefaultFinish(rowName, callback) {
	var tableRow = document.getElementById(rowName);
	var rowData = {};
	for (var i=0; i<tableRow.childElementCount; i++) {
		var cell = tableRow.children[i];
		if (cell.dataset.inlinemode != "button") {
			rowData[cell.dataset.inlinename] = cell.children[0].value;
			cell.dataset.inlinevalue = cell.children[0].value;
		}
	}
	
	// do whatever ajax magic
	var getType = {};
	if (callback && getType.toString.call(callback) === '[object Function]') {
		callback(rowData, rowName);
	}
	
	for (i=0; i<tableRow.childElementCount; i++) {
		var cell = tableRow.children[i];
		inlineDefaultFinishCell(cell, i, rowName);
	}
}

function inlineDefaultFinishCell(cell, i, rowName) {
	var cellContent = "";
	if (cell.dataset.inlinemode == "button") {
		cellContent += inlineEditButtonContent[rowName];
	} else {
		cellContent += cell.dataset.inlinevalue;
	}
	cell.innerHTML = cellContent;
}