function openInNewTab(url) {
	var win = window.open(url, '_blank');
	win.focus();
}

function show_prior_year() {
	document.getElementById("current_year_overview_monetary").classList.add("hidden");
	document.getElementById("prior_year_monetary").classList.remove("hidden");
	document.getElementById("prior_year_comparative_qty_based").classList.add("hidden");
	document.getElementById("prior_year_comparative_monetary").classList.add("hidden");
	document.getElementById("current_year_overview_qty_based").classList.add("hidden");
	document.getElementById("prior_year_qty_based").classList.add("hidden");
}

function show_prior_year_qty() {
	document.getElementById("current_year_overview_monetary").classList.add("hidden");
	document.getElementById("prior_year_monetary").classList.add("hidden");
	document.getElementById("current_year_overview_qty_based").classList.add("hidden");
	document.getElementById("prior_year_qty_based").classList.remove("hidden");
	document.getElementById("prior_year_comparative_qty_based").classList.add("hidden");
	document.getElementById("prior_year_comparative_monetary").classList.add("hidden");
}

function show_current_year() {
	document.getElementById("current_year_overview_monetary").classList.remove("hidden");
	document.getElementById("current_year_overview_qty_based").classList.add("hidden");
	document.getElementById("prior_year_monetary").classList.add("hidden");
	document.getElementById("prior_year_qty_based").classList.add("hidden");
	document.getElementById("prior_year_comparative_qty_based").classList.add("hidden");
	document.getElementById("prior_year_comparative_monetary").classList.add("hidden");
}

function show_current_year_qty() {
	document.getElementById("current_year_overview_monetary").classList.add("hidden");
	document.getElementById("prior_year_monetary").classList.add("hidden");
	document.getElementById("current_year_overview_qty_based").classList.remove("hidden");
	document.getElementById("prior_year_qty_based").classList.add("hidden");
	document.getElementById("prior_year_comparative_qty_based").classList.add("hidden");
	document.getElementById("prior_year_comparative_monetary").classList.add("hidden");
}

function show_year_comparative() {
	document.getElementById("current_year_overview_monetary").classList.add("hidden");
	document.getElementById("prior_year_monetary").classList.add("hidden");
	document.getElementById("current_year_overview_qty_based").classList.add("hidden");
	document.getElementById("prior_year_qty_based").classList.add("hidden");
	document.getElementById("prior_year_comparative_qty_based").classList.add("hidden");
	document.getElementById("prior_year_comparative_monetary").classList.remove("hidden");
}

function show_year_comparative_qty() {
	document.getElementById("current_year_overview_monetary").classList.add("hidden");
	document.getElementById("prior_year_monetary").classList.add("hidden");
	document.getElementById("current_year_overview_qty_based").classList.add("hidden");
	document.getElementById("prior_year_qty_based").classList.add("hidden");
	document.getElementById("prior_year_comparative_qty_based").classList.remove("hidden");
	document.getElementById("prior_year_comparative_monetary").classList.add("hidden");
}