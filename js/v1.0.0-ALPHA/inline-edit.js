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
	var attributesFilter = ["inlineoptionsvalue", "inlineoptionstitle"];
	var cellContent = "";
	var key;
	if (i === 0) {
		cellContent += `<form id='${rowName}Form'></form>`;
	}
	switch (cell.dataset.inlinetype) {
		case "doneButton":
			cellContent += `<input type='submit' value='Finish' form='${rowName}Form'/>`;
			break;
		case "button":
			cellContent += inlineEditRowContents[rowName][i];
			break;
		case "text":
			cellContent += `<input type='text' value='${inlineEditRowContents[rowName][i]}' form='${rowName}Form'`;
			for (key in cell.dataset) {
				if (cell.dataset.hasOwnProperty(key) && key.substr(0, 6) == "inline" && attributesFilter.indexOf(key) == -1) {
					cellContent += ` ${key.substr(6)}='${cell.dataset[key]}'`;
				}
			}
			cellContent += "/>";
			break;
		case "select":
			cellContent += "<select";
			for (key in cell.dataset) {
				if (cell.dataset.hasOwnProperty(key) && key.substr(0, 6) == "inline" && attributesFilter.indexOf(key) == -1) {
					cellContent += ` ${key.substr(6)}='${cell.dataset[key]}'`;
				}
			}
			cellContent += ">";
			var optionsTitle = JSON.parse(cell.dataset.inlineoptionstitle);
			var optionsValue = cell.dataset.hasOwnProperty("inlineoptionsvalue") ? JSON.parse(cell.dataset.inlineoptionsvalue) : [];
			for (var j=0; j<optionsTitle.length; j++) {
				cellContent += "<option ";
				cellContent += ((optionsValue.length<=j) ? "" : `value='${optionsValue[j]}'`);
				cellContent += ((inlineEditRowContents[rowName][i] == optionsTitle[j]) ? " selected='selected'" : "");
				cellContent += ">";
				cellContent += optionsTitle[j];
				cellContent += "</option>";
			}
			cellContent += "</select>";
			break;
		case "textarea":
			cellContent += `<textarea form='${rowName}Form'`;
			for (key in cell.dataset) {
				if (cell.dataset.hasOwnProperty(key) && key.substr(0, 6) == "inline" && attributesFilter.indexOf(key) == -1) {
					cellContent += ` ${key.substr(6)}='${cell.dataset[key]}'`;
				}
			}
			cellContent += ">";
			cellContent += inlineEditRowContents[rowName][i];
			cellContent += "</textarea>";
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
		var getFromChildren = (i === 0) ? 1 : 0;
		switch (cell.dataset.inlinetype) {
			case "doneButton":
				break;
			case "button":
				break;
			case "text":
				rowData[cell.dataset.inlinename] = cell.children[getFromChildren].value;
				inlineEditRowContents[rowName][i] = cell.children[getFromChildren].value;
				break;
			case "select":
				rowData[cell.dataset.inlinename] = JSON.parse(cell.dataset.inlineoptionstitle)[cell.children[getFromChildren].selectedIndex];
				inlineEditRowContents[rowName][i] = JSON.parse(cell.dataset.inlineoptionstitle)[cell.children[getFromChildren].selectedIndex];
				break;
			case "textarea":
				// TODO textarea value is \n not <br/>
				rowData[cell.dataset.inlinename] = cell.children[getFromChildren].value;
				inlineEditRowContents[rowName][i] = cell.children[getFromChildren].value;
				break;
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