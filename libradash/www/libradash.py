# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# MIT License. See license.txt

from __future__ import unicode_literals
import frappe
from frappe import _
import frappe.www.list
from datetime import datetime


no_cache = 1
no_sitemap = 1

def get_context(context):
	if frappe.session.user=='Guest':
		frappe.throw(_("You need to be logged in to access this page"), frappe.PermissionError)

	context.show_sidebar=True
	context['new_orders_qty'], context['month'] = new_orders()
	context['new_delivery_notes_qty'] = new_deliverys()
	context['new_sales_invoices_qty'], context['total_value_sales_invoice'] = new_sinvs()
	context['new_issues_qty'] = new_issues()
	
def new_orders():
	month = datetime.now().month
	month_as_word = datetime.now().strftime('%B')
	year = datetime.now().year
	qty = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-{month}-01' AND `transaction_date` <= '{year}-{month}-31'""".format(year=year, month=month), as_list=True)[0][0]
	return qty, month_as_word
	
def new_deliverys():
	month = datetime.now().month
	year = datetime.now().year
	qty = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-{month}-01' AND `posting_date` <= '{year}-{month}-31'""".format(year=year, month=month), as_list=True)[0][0]
	return qty
	
def new_sinvs():
	month = datetime.now().month
	year = datetime.now().year
	qty = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-{month}-01' AND `posting_date` <= '{year}-{month}-31'""".format(year=year, month=month), as_list=True)[0][0]
	total_value_sales_invoice = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-{month}-01' AND `posting_date` <= '{year}-{month}-31'""".format(year=year, month=month), as_list=True)[0][0]
	return qty, total_value_sales_invoice
	
def new_issues():
	month = datetime.now().month
	year = datetime.now().year
	qty = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-{month}-01' AND `opening_date` <= '{year}-{month}-31'""".format(year=year, month=month), as_list=True)[0][0]
	return qty