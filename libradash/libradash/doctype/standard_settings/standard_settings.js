// Copyright (c) 2018, libracore GmbH and contributors
// For license information, please see license.txt

frappe.ui.form.on('Standard Settings', {
	refresh: function(frm) {
		if (!frm.doc.customer_from) {
			frm.set_value('customer_from', 'January');
		}
		if (!frm.doc.customer_to) {
			frm.set_value('customer_to', 'December');
		}
		if (!frm.doc.sales_from) {
			frm.set_value('sales_from', 'January');
		}
		if (!frm.doc.sales_to) {
			frm.set_value('sales_to', 'December');
		}
	}
});
