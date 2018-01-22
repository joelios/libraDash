# -*- coding: utf-8 -*-
# Copyright (c) 2017-2018, libracore and contributors
# License: AGPL v3. See LICENCE

from __future__ import unicode_literals
import frappe
from frappe import throw, _

@frappe.whitelist()
def get_customer_qty(start, end):
	int_start = int(start)
	int_end = int(end)
	months = []
	
	while int_start <= int_end:
		months.append(int_start)
		int_start += 1
	
	qty_per_months = []

	for month in months:
		qty = frappe.db.count("Customer", filters={"creation": ["<=", "2018-" + str(month) + "-31"], "creation": [">=", "2018-" + str(month) + "-01"]})
		qty_per_months.append(qty)
		
	return {'qty': qty_per_months}