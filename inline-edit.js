function inlineEdit(rowName, updateCellFunc, finishFunc) {
	var tableRow = document.getElementById(rowName);
	for (var i=0; i<tableRow.childElementCount; i++) {
		var cell = tableRow.children[i];
		updateCellFunc(cell, i, rowName, finishFunc);
	}
}

function inlineDefaultUpdateCell(cell, i, rowName, finishFunc) {
	var cellContent = "";
	if (cell.dataset.inlinemode == "button") {
		cellContent += "<input type='submit' value='Finish' form='"+rowName+"Form'/>";
	} else {
		if (i === 0) {
			cellContent += "<form id='"+rowName+"Form'></form>";
		}
		cellContent += "<input type='text' value='"+cell.dataset.inlinevalue+"' form='"+rowName+"Form'/>";
	}
	cell.innerHTML = cellContent;
	if (i === 0) {
		document.getElementById(rowName+"Form").onsubmit = function () {
			event.preventDefault();
			if (this.reportValidity()) {
				finishFunc(rowName);
			}
		};
	}
}

function inlineDefaultFinish(rowName) {
	var tableRow = document.getElementById(rowName);
	var rowData = {};
	for (var i=0; i<tableRow.childElementCount; i++) {
		var cell = tableRow.children[i];
		if (cell.dataset.inlinemode != "button") {
			rowData[cell.dataset.inlinename] = cell.children[0].value;
		}
	}
	console.log(rowData);
}

function inlineDefaultFinishCell(cell, i, rowName) {
	var cellContent = "";
	if (cell.dataset.inlinemode == "button") {
		cellContent += "<input type='submit' value='Finish' form='"+rowName+"Form'/>";
	} else {
		if (i === 0) {
			cellContent += "<form id='"+rowName+"Form' onSubmit=''></form>";
		}
		cellContent += "<input type='text' value='"+cell.dataset.inline+"' form='"+rowName+"Form'/>";
	}
	cell.innerHTML = cellContent;
}