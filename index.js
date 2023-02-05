function generate() {
	let bg = $('#bg-input').val();
	let font = $('#font-input').val();
	$('#result').css('background-color', bg);
	$('#result').css('color', font);
}

function copy() {
	let bg = $('#bg-input').val();
	let font = $('#font-input').val();
	navigator.clipboard.writeText(`${bg} and ${font}`);
}