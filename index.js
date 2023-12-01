const delimiter = "\t";
const $ = require("jquery");
function text2table(text, impliedHeader = false) {
	const table = ["{|"];
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
	const impliedHeader = $("impliedHeader").checked;
	const result = text2table(src);
	$("#target").val(result.join("\n"));
	$("#target")[0].dispatchEvent(new Event("change"));
}

$(() => {
	// enable tabs
	const textareas = $("textarea");
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
				return false; //prevent default action
			}
		};

		// assign it stored values
		const stored = localStorage.getItem(area.id);
		if (stored) $(area).val(stored);

		// listen for onchange
		area.onchange = () => {
			localStorage.setItem(area.id, $(area).val());
		};
	}

	// listen for clicks
	document.getElementById("convert").onclick = convert;
});
