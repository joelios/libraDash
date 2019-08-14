(function ($) {
  $(document).ready(function(){
	AddDashboardBtn();
	AddEventListenerToBTN();
  });
}(jQuery));

function AddDashboardBtn() {
	var node = document.createElement("LI");
	var a_tag = document.createElement("A");
	a_tag.setAttribute('id','dashboardbtn');
	var t = document.createTextNode("View Dashboard");
	a_tag.appendChild(t);
	node.appendChild(a_tag);
	document.getElementById("toolbar-user").insertBefore(node, document.getElementById("toolbar-user").getElementsByClassName("divider")[0]);
}

function AddEventListenerToBTN() {
	document.getElementById("dashboardbtn").onclick = function() {OpenDashboard()};
}

function OpenDashboard(){
	var win = window.open('/libradash', '_blank');
	win.focus();
}