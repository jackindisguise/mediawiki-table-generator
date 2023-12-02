const delimiter = "\t";
const $ = require("jquery");
function text2table(text, impliedHeader = false, classes) {
	let initializer = "{|";
	if (classes) initializer = `${initializer} class='${classes}'`;
	const table = [initializer];
	const lines = text.split(/\r?\n/g);
	for (let i = 0; i < lines.length; i++) {
		if (i > 0) table.push("|-");
		const line = lines[i];
		const row = line.split(delimiter);
		let wmdelimit = i === 0 && impliedHeader ? "!" : "|";
		table.push(`${wmdelimit} ${row.join(` ${wmdelimit.repeat(2)} `)}`);
	}
	table.push("|}");
	return table;
}

function convert() {
	const src = $("#source").val();
	const impliedHeader = $("#impliedHeader")[0].checked;
	const classes = $("#classes").val();
	const result = text2table(src, impliedHeader, classes);
	$("#target").val(result.join("\n"));
	$("#target")[0].dispatchEvent(new Event("change"));
}

$(() => {
	convert();
	// save and load checkmarks
	const checkboxes = $("input[type='checkbox']");
	for (let box of checkboxes) {
		// load stored values
		const stored = localStorage.getItem(box.id);
		const bool = stored === "false" ? false : true;
		box.checked = bool;

		// listen for changes
		box.onclick = () => {
			localStorage.setItem(box.id, box.checked);
			convert();
		};
	}

	const inputs = $("input[type='text']");
	for (let input of inputs) {
		// load stored values
		const stored = localStorage.getItem(input.id);
		if (stored !== undefined) input.value = stored;

		// listen for changes
		input.oninput = () => {
			localStorage.setItem(input.id, input.value);
			convert();
		};
	}

	// enable tabs
	const textareas = $("textarea#source");
	for (let area of textareas) {
		// listen for tabs
		area.onkeydown = (e) => {
			if (e.keyCode === 9) {
				area.setRangeText(
					"\t",
					area.selectionStart,
					area.selectionStart,
					"end"
				);
				convert();
				return false; //prevent default action
			}
		};

		// assign it stored values
		const stored = localStorage.getItem(area.id);
		if (stored) $(area).val(stored);

		// listen for onchange
		area.oninput = () => {
			localStorage.setItem(area.id, $(area).val());
			convert();
		};
	}

	convert();
});
