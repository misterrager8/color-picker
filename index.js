$(document).ready(function() {
	generate();
})

function generate() {
	let bg = $('#bg-input').val();
	let font = $('#font-input').val();

	$('#result').css('background-color', bg);
	$('#result').css('color', font);
}

function copyBg() {
	navigator.clipboard.writeText($('#bg-input').val());
	$('#copy-bg').toggleClass(['text-secondary', 'text-success']);
	$('#copy-bg i').toggleClass(['bi-clipboard', 'bi-check-lg']);
	setTimeout(function() {
		$('#copy-bg').toggleClass(['text-secondary', 'text-success']);
		$('#copy-bg i').toggleClass(['bi-clipboard', 'bi-check-lg']);
	}, 1500);
}

function copyFont() {
	navigator.clipboard.writeText($('#font-input').val());
	$('#copy-font').toggleClass(['text-secondary', 'text-success']);
	$('#copy-font i').toggleClass(['bi-clipboard', 'bi-check-lg']);
	setTimeout(function() {
		$('#copy-font').toggleClass(['text-secondary', 'text-success']);
		$('#copy-font i').toggleClass(['bi-clipboard', 'bi-check-lg']);
	}, 1500);
}