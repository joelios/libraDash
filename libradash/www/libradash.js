function openInNewTab(url) {
	var win = window.open(url, '_blank');
	win.focus();
}

function show_prior_year() {
	document.getElementById("current_year_overview").classList.add("hidden");
	document.getElementById("prior_year").classList.remove("hidden");
	document.getElementById("prior_year_comparative").classList.add("hidden");
}

function show_current_year() {
	document.getElementById("current_year_overview").classList.remove("hidden");
	document.getElementById("prior_year").classList.add("hidden");
	document.getElementById("prior_year_comparative").classList.add("hidden");
}

function show_year_comparative() {
	document.getElementById("current_year_overview").classList.add("hidden");
	document.getElementById("prior_year").classList.add("hidden");
	document.getElementById("prior_year_comparative").classList.remove("hidden");
}