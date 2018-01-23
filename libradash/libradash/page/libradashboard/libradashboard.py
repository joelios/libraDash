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
	
	activ_qty_per_months = []
	inactiv_qty_per_months = []
	lead_qty_per_months = []

	for month in months:
		qty = frappe.db.count("Customer", filters={"creation": ["<=", "2018-" + str(month) + "-31"], "creation": [">=", "2018-" + str(month) + "-01"], "disabled": ["=", "0"]})
		activ_qty_per_months.append(qty)
		
	for month in months:
		qty = frappe.db.count("Customer", filters={"creation": ["<=", "2018-" + str(month) + "-31"], "creation": [">=", "2018-" + str(month) + "-01"], "disabled": ["=", "1"]})
		inactiv_qty_per_months.append(qty)
		
	for month in months:
		qty = frappe.db.count("Lead", filters={"creation": ["<=", "2018-" + str(month) + "-31"], "creation": [">=", "2018-" + str(month) + "-01"]})
		lead_qty_per_months.append(qty)
		
	return {'qty': {'activ': activ_qty_per_months, 'inactiv': inactiv_qty_per_months, 'lead': lead_qty_per_months}}

@frappe.whitelist()
def get_sales_qty(start, end):
	int_start = int(start)
	int_end = int(end)
	months = []
	
	while int_start <= int_end:
		months.append(int_start)
		int_start += 1
	
	salesorder_qty_per_months = []
	salesinvoice_qty_per_months = []

	for month in months:
		qty = frappe.db.count("Sales Order", filters={"creation": ["<=", "2018-" + str(month) + "-31"], "creation": [">=", "2018-" + str(month) + "-01"]})
		salesorder_qty_per_months.append(qty)
		
	for month in months:
		qty = frappe.db.count("Sales Invoice", filters={"creation": ["<=", "2018-" + str(month) + "-31"], "creation": [">=", "2018-" + str(month) + "-01"]})
		salesinvoice_qty_per_months.append(qty)

	return {'qty': {'salesorder': salesorder_qty_per_months, 'salesinvoice': salesinvoice_qty_per_months}}
	
@frappe.whitelist()
def check_user_settings(user):
	return frappe.db.exists('User Standard Settings', user)