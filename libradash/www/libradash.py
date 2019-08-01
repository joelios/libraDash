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
	
def new_orders():
	month = datetime.now().month
	month_as_word = datetime.now().strftime('%B')
	year = datetime.now().year
	qty = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-{month}-01' AND `transaction_date` <= '{year}-{month}-31'""".format(year=year, month=month), as_list=True)[0][0]
	return qty, month_as_word