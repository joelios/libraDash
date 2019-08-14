// Copyright (c) 2019, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('libradash settings', {
	refresh: function(frm) {
		if(frm.doc.layout == 'Default') {
			cur_frm.set_df_property('layout_preview','options','<div class="row"><div class="col-sm-3" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Panel</center></div><div class="col-sm-3" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Panel</center></div><div class="col-sm-3" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Panel</center></div><div class="col-sm-3" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Panel</center></div><div class="col-sm-8" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Multi Diagram</center></div><div class="col-sm-4" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Pie Chart</center></div></div>');
		} else {
			cur_frm.set_df_property('layout_preview','options', get_preview(frm));
		}
	},
	update_preview: function(frm) {
		if(frm.doc.layout == 'Default') {
			cur_frm.set_df_property('layout_preview','options','<div class="row"><div class="col-sm-3" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Panel</center></div><div class="col-sm-3" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Panel</center></div><div class="col-sm-3" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Panel</center></div><div class="col-sm-3" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Panel</center></div><div class="col-sm-8" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Multi Diagram</center></div><div class="col-sm-4" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Pie Chart</center></div></div>');
		} else {
			cur_frm.set_df_property('layout_preview','options', get_preview(frm));
		}
	}
});

function get_preview(frm) {
	var charts = cur_frm.doc.diagrams;
	var html = '';
	charts.forEach(function(entry) {
		var sub_html = get_chart_preview(entry.typ, entry.width);
		html = html + sub_html;
	});
	return html
}

function get_chart_preview(type, size) {
	if(type=='Panel') {
		return '<div class="col-sm-' + size + '" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Panel</center></div>'
	}
	if(type=='Line Chart') {
		return '<div class="col-sm-' + size + '" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Line Chart</center></div>'
	}
	if(type=='Pie Chart') {
		return '<div class="col-sm-' + size + '" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Pie Chart</center></div>'
	}
	if(type=='Bar Chart') {
		return '<div class="col-sm-' + size + '" style="background-color: #b6aead; padding: 5px; border: 0.5px solid black; height: 50px;"><center>Bar Chart</center></div>'
	}
}