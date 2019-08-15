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
	default = frappe.get_single("libradash settings")
	context['style'] = default.layout
	context['charts'] = get_charts()
	context['querys'] = {}
	context['dashboard_title'] = default.dashboard_title
	for chart in get_charts():
		if chart.typ == "Panel":
			if chart.panel_sql_query:
				context['querys'][chart.name] = get_panel_sql_query(chart.panel_sql_query)
	if not default.layout == "Custom":
		context['new_orders_qty'], context['month'] = new_orders()
		context['new_delivery_notes_qty'] = new_deliverys()
		context['new_sales_invoices_qty'], context['total_value_sales_invoice'] = new_sinvs()
		context['new_issues_qty'] = new_issues()
	
def get_charts():
	charts = frappe.db.sql("""SELECT * FROM `tablibradash diagram` ORDER BY `idx` ASC""", as_dict=True)
	return charts
	
@frappe.whitelist()
def get_line_charts():
	charts = frappe.db.sql("""SELECT * FROM `tablibradash diagram` WHERE `typ` = 'Line Chart'""", as_dict=True)
	for chart in charts:
		data_arr = {}
		for line in chart.line_chart_values.splitlines():
			if line.split("#PER#")[0] in data_arr:
				data_arr[line.split("#PER#")[0]][line.split("#PER#")[1].split("#SQL#")[0]] = frappe.db.sql(line.split("#PER#")[1].split("#SQL#")[1], as_list=True)[0][0]
			else:
				data_arr[line.split("#PER#")[0]] = {}
				data_arr[line.split("#PER#")[0]][line.split("#PER#")[1].split("#SQL#")[0]] = frappe.db.sql(line.split("#PER#")[1].split("#SQL#")[1], as_list=True)[0][0]
	
		data = []
		for period in data_arr:
			_data = {}
			_data['period'] = period
			for key in data_arr[period]:
				_data[key] = data_arr[period][key]
			data.append(_data)
		chart['line_chart_values'] = data
	return charts
	
@frappe.whitelist()
def get_pie_charts():
	charts = frappe.db.sql("""SELECT * FROM `tablibradash diagram` WHERE `typ` = 'Pie Chart'""", as_dict=True)
	
	for chart in charts:
		
		data = []
		for line in chart.pie_chart_values.splitlines():
			data_arr = {}
			data_arr['label'] = line.split("#SQL#")[0]
			data_arr['value'] = frappe.db.sql(line.split("#SQL#")[1], as_list=True)[0][0]
			data.append(data_arr)
		
		chart['pie_chart_values'] = data
	return charts
	
@frappe.whitelist()
def get_bar_charts():
	charts = frappe.db.sql("""SELECT * FROM `tablibradash diagram` WHERE `typ` = 'Bar Chart'""", as_dict=True)
	for chart in charts:
		x_labels = []
		data = []
		for line in chart.bar_chart_values.splitlines():
			if line.split("#XLAB#")[0] not in x_labels:
				x_labels.append(line.split("#XLAB#")[0])
		for xlab in x_labels:
			data_arr = {}
			for line in chart.bar_chart_values.splitlines():
				if line.split("#XLAB#")[0] == xlab:
					if 'y' not in data_arr:
						data_arr['y'] = xlab
					data_arr[line.split("#XLAB#")[1].split("#SQL#")[0]] = frappe.db.sql(line.split("#XLAB#")[1].split("#SQL#")[1], as_list=True)[0][0]
			data.append(data_arr)
		chart['bar_chart_values'] = data
	#print(charts)
	return charts
	
@frappe.whitelist()
def get_query_data(query):
	if frappe.session.user=='Guest':
		frappe.throw(_("You need to be logged in to access this page"), frappe.PermissionError)
	else:
		result = frappe.db.sql(query, as_list=True)[0][0]
		return result or 0
	
def get_panel_sql_query(query):
	return frappe.db.sql(query, as_list=True)[0][0] or 0
	
def new_orders():
	month = datetime.now().month
	month_as_word = datetime.now().strftime('%B')
	year = datetime.now().year
	qty = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-{month}-01' AND `transaction_date` <= '{year}-{month}-31' AND `docstatus` = 1""".format(year=year, month=month), as_list=True)[0][0]
	return qty, month_as_word
	
def new_deliverys():
	month = datetime.now().month
	year = datetime.now().year
	qty = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-{month}-01' AND `posting_date` <= '{year}-{month}-31' AND `docstatus` = 1""".format(year=year, month=month), as_list=True)[0][0]
	return qty
	
def new_sinvs():
	month = datetime.now().month
	year = datetime.now().year
	qty = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-{month}-01' AND `posting_date` <= '{year}-{month}-31' AND `docstatus` = 1""".format(year=year, month=month), as_list=True)[0][0]
	total_value_sales_invoice = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-{month}-01' AND `posting_date` <= '{year}-{month}-31' AND `docstatus` = 1""".format(year=year, month=month), as_list=True)[0][0]
	return qty, total_value_sales_invoice
	
def new_issues():
	month = datetime.now().month
	year = datetime.now().year
	qty = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-{month}-01' AND `opening_date` <= '{year}-{month}-31'""".format(year=year, month=month), as_list=True)[0][0]
	return qty
	
@frappe.whitelist()
def get_monetary_datas():
	year = datetime.now().year
	datas = {}
	datas['sinv_total'] = {}
	datas['sinv_total']['jan'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-01-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['feb'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-02-01' AND `posting_date` <= '{year}-02-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['mar'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-03-01' AND `posting_date` <= '{year}-03-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['apr'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-04-01' AND `posting_date` <= '{year}-04-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['may'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-05-01' AND `posting_date` <= '{year}-05-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['jun'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-06-01' AND `posting_date` <= '{year}-06-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['jul'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-07-01' AND `posting_date` <= '{year}-07-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['aug'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-08-01' AND `posting_date` <= '{year}-08-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['sept'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-09-01' AND `posting_date` <= '{year}-09-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['oct'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-10-01' AND `posting_date` <= '{year}-10-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['nov'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-11-01' AND `posting_date` <= '{year}-11-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['dez'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-12-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sales_orders'] = {}
	datas['sales_orders']['jan'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-01-01' AND `transaction_date` <= '{year}-01-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['feb'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-02-01' AND `transaction_date` <= '{year}-02-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['mar'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-03-01' AND `transaction_date` <= '{year}-03-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['apr'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-04-01' AND `transaction_date` <= '{year}-04-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['may'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-05-01' AND `transaction_date` <= '{year}-05-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['jun'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-06-01' AND `transaction_date` <= '{year}-06-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['jul'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-07-01' AND `transaction_date` <= '{year}-07-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['aug'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-08-01' AND `transaction_date` <= '{year}-08-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['sept'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-09-01' AND `transaction_date` <= '{year}-09-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['oct'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-10-01' AND `transaction_date` <= '{year}-10-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['nov'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-11-01' AND `transaction_date` <= '{year}-11-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['dez'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-12-01' AND `transaction_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes'] = {}
	datas['delivery_notes']['jan'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-01-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['feb'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-02-01' AND `posting_date` <= '{year}-02-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['mar'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-03-01' AND `posting_date` <= '{year}-03-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['apr'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-04-01' AND `posting_date` <= '{year}-04-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['may'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-05-01' AND `posting_date` <= '{year}-05-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['jun'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-06-01' AND `posting_date` <= '{year}-06-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['jul'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-07-01' AND `posting_date` <= '{year}-07-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['aug'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-08-01' AND `posting_date` <= '{year}-08-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['sept'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-09-01' AND `posting_date` <= '{year}-09-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['oct'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-10-01' AND `posting_date` <= '{year}-10-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['nov'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-11-01' AND `posting_date` <= '{year}-11-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['dez'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-12-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['verkauft'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-01-01' AND `transaction_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['verrechnet'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['ausstehend'] = frappe.db.sql("""SELECT SUM(`outstanding_amount`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	return datas
	
@frappe.whitelist()
def get_qty_based_datas():
	year = datetime.now().year
	datas = {}
	datas['sinv_total'] = {}
	datas['sinv_total']['jan'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-01-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['feb'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-02-01' AND `posting_date` <= '{year}-02-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['mar'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-03-01' AND `posting_date` <= '{year}-03-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['apr'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-04-01' AND `posting_date` <= '{year}-04-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['may'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-05-01' AND `posting_date` <= '{year}-05-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['jun'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-06-01' AND `posting_date` <= '{year}-06-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['jul'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-07-01' AND `posting_date` <= '{year}-07-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['aug'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-08-01' AND `posting_date` <= '{year}-08-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['sept'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-09-01' AND `posting_date` <= '{year}-09-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['oct'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-10-01' AND `posting_date` <= '{year}-10-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['nov'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-11-01' AND `posting_date` <= '{year}-11-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['dez'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-12-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sales_orders'] = {}
	datas['sales_orders']['jan'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-01-01' AND `transaction_date` <= '{year}-01-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['feb'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-02-01' AND `transaction_date` <= '{year}-02-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['mar'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-03-01' AND `transaction_date` <= '{year}-03-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['apr'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-04-01' AND `transaction_date` <= '{year}-04-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['may'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-05-01' AND `transaction_date` <= '{year}-05-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['jun'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-06-01' AND `transaction_date` <= '{year}-06-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['jul'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-07-01' AND `transaction_date` <= '{year}-07-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['aug'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-08-01' AND `transaction_date` <= '{year}-08-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['sept'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-09-01' AND `transaction_date` <= '{year}-09-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['oct'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-10-01' AND `transaction_date` <= '{year}-10-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['nov'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-11-01' AND `transaction_date` <= '{year}-11-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['dez'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-12-01' AND `transaction_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes'] = {}
	datas['delivery_notes']['jan'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-01-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['feb'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-02-01' AND `posting_date` <= '{year}-02-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['mar'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-03-01' AND `posting_date` <= '{year}-03-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['apr'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-04-01' AND `posting_date` <= '{year}-04-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['may'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-05-01' AND `posting_date` <= '{year}-05-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['jun'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-06-01' AND `posting_date` <= '{year}-06-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['jul'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-07-01' AND `posting_date` <= '{year}-07-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['aug'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-08-01' AND `posting_date` <= '{year}-08-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['sept'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-09-01' AND `posting_date` <= '{year}-09-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['oct'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-10-01' AND `posting_date` <= '{year}-10-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['nov'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-11-01' AND `posting_date` <= '{year}-11-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['dez'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-12-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['issues'] = {}
	datas['issues']['jan'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-01-01' AND `opening_date` <= '{year}-01-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['feb'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-02-01' AND `opening_date` <= '{year}-02-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['mar'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-03-01' AND `opening_date` <= '{year}-03-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['apr'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-04-01' AND `opening_date` <= '{year}-04-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['may'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-05-01' AND `opening_date` <= '{year}-05-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['jun'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-06-01' AND `opening_date` <= '{year}-06-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['jul'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-07-01' AND `opening_date` <= '{year}-07-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['aug'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-08-01' AND `opening_date` <= '{year}-08-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['sept'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-09-01' AND `opening_date` <= '{year}-09-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['oct'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-10-01' AND `opening_date` <= '{year}-10-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['nov'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-11-01' AND `opening_date` <= '{year}-11-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['dez'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-12-01' AND `opening_date` <= '{year}-12-31'""".format(year=year), as_list=True)[0][0]
	return datas
	
@frappe.whitelist()
def get_prior_monetary_datas():
	year = datetime.now().year - 1
	datas = {}
	datas['sinv_total'] = {}
	datas['sinv_total']['jan'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-01-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['feb'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-02-01' AND `posting_date` <= '{year}-02-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['mar'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-03-01' AND `posting_date` <= '{year}-03-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['apr'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-04-01' AND `posting_date` <= '{year}-04-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['may'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-05-01' AND `posting_date` <= '{year}-05-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['jun'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-06-01' AND `posting_date` <= '{year}-06-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['jul'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-07-01' AND `posting_date` <= '{year}-07-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['aug'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-08-01' AND `posting_date` <= '{year}-08-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['sept'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-09-01' AND `posting_date` <= '{year}-09-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['oct'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-10-01' AND `posting_date` <= '{year}-10-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['nov'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-11-01' AND `posting_date` <= '{year}-11-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['dez'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-12-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sales_orders'] = {}
	datas['sales_orders']['jan'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-01-01' AND `transaction_date` <= '{year}-01-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['feb'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-02-01' AND `transaction_date` <= '{year}-02-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['mar'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-03-01' AND `transaction_date` <= '{year}-03-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['apr'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-04-01' AND `transaction_date` <= '{year}-04-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['may'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-05-01' AND `transaction_date` <= '{year}-05-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['jun'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-06-01' AND `transaction_date` <= '{year}-06-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['jul'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-07-01' AND `transaction_date` <= '{year}-07-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['aug'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-08-01' AND `transaction_date` <= '{year}-08-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['sept'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-09-01' AND `transaction_date` <= '{year}-09-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['oct'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-10-01' AND `transaction_date` <= '{year}-10-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['nov'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-11-01' AND `transaction_date` <= '{year}-11-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['dez'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-12-01' AND `transaction_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes'] = {}
	datas['delivery_notes']['jan'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-01-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['feb'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-02-01' AND `posting_date` <= '{year}-02-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['mar'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-03-01' AND `posting_date` <= '{year}-03-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['apr'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-04-01' AND `posting_date` <= '{year}-04-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['may'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-05-01' AND `posting_date` <= '{year}-05-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['jun'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-06-01' AND `posting_date` <= '{year}-06-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['jul'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-07-01' AND `posting_date` <= '{year}-07-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['aug'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-08-01' AND `posting_date` <= '{year}-08-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['sept'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-09-01' AND `posting_date` <= '{year}-09-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['oct'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-10-01' AND `posting_date` <= '{year}-10-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['nov'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-11-01' AND `posting_date` <= '{year}-11-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['dez'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-12-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	return datas
	
@frappe.whitelist()
def get_prior_qty_based_datas():
	year = datetime.now().year - 1
	datas = {}
	datas['sinv_total'] = {}
	datas['sinv_total']['jan'] = frappe.db.sql("""SELECT COUNT(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-01-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['feb'] = frappe.db.sql("""SELECT COUNT(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-02-01' AND `posting_date` <= '{year}-02-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['mar'] = frappe.db.sql("""SELECT COUNT(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-03-01' AND `posting_date` <= '{year}-03-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['apr'] = frappe.db.sql("""SELECT COUNT(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-04-01' AND `posting_date` <= '{year}-04-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['may'] = frappe.db.sql("""SELECT COUNT(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-05-01' AND `posting_date` <= '{year}-05-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['jun'] = frappe.db.sql("""SELECT COUNT(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-06-01' AND `posting_date` <= '{year}-06-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['jul'] = frappe.db.sql("""SELECT COUNT(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-07-01' AND `posting_date` <= '{year}-07-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['aug'] = frappe.db.sql("""SELECT COUNT(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-08-01' AND `posting_date` <= '{year}-08-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['sept'] = frappe.db.sql("""SELECT COUNT(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-09-01' AND `posting_date` <= '{year}-09-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['oct'] = frappe.db.sql("""SELECT COUNT(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-10-01' AND `posting_date` <= '{year}-10-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['nov'] = frappe.db.sql("""SELECT COUNT(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-11-01' AND `posting_date` <= '{year}-11-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sinv_total']['dez'] = frappe.db.sql("""SELECT COUNT(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-12-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0] or 0
	datas['sales_orders'] = {}
	datas['sales_orders']['jan'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-01-01' AND `transaction_date` <= '{year}-01-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['feb'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-02-01' AND `transaction_date` <= '{year}-02-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['mar'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-03-01' AND `transaction_date` <= '{year}-03-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['apr'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-04-01' AND `transaction_date` <= '{year}-04-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['may'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-05-01' AND `transaction_date` <= '{year}-05-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['jun'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-06-01' AND `transaction_date` <= '{year}-06-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['jul'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-07-01' AND `transaction_date` <= '{year}-07-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['aug'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-08-01' AND `transaction_date` <= '{year}-08-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['sept'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-09-01' AND `transaction_date` <= '{year}-09-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['oct'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-10-01' AND `transaction_date` <= '{year}-10-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['nov'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-11-01' AND `transaction_date` <= '{year}-11-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['sales_orders']['dez'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-12-01' AND `transaction_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes'] = {}
	datas['delivery_notes']['jan'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-01-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['feb'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-02-01' AND `posting_date` <= '{year}-02-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['mar'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-03-01' AND `posting_date` <= '{year}-03-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['apr'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-04-01' AND `posting_date` <= '{year}-04-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['may'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-05-01' AND `posting_date` <= '{year}-05-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['jun'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-06-01' AND `posting_date` <= '{year}-06-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['jul'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-07-01' AND `posting_date` <= '{year}-07-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['aug'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-08-01' AND `posting_date` <= '{year}-08-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['sept'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-09-01' AND `posting_date` <= '{year}-09-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['oct'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-10-01' AND `posting_date` <= '{year}-10-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['nov'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-11-01' AND `posting_date` <= '{year}-11-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['delivery_notes']['dez'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-12-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=year), as_list=True)[0][0]
	datas['issues'] = {}
	datas['issues']['jan'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-01-01' AND `opening_date` <= '{year}-01-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['feb'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-02-01' AND `opening_date` <= '{year}-02-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['mar'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-03-01' AND `opening_date` <= '{year}-03-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['apr'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-04-01' AND `opening_date` <= '{year}-04-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['may'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-05-01' AND `opening_date` <= '{year}-05-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['jun'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-06-01' AND `opening_date` <= '{year}-06-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['jul'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-07-01' AND `opening_date` <= '{year}-07-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['aug'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-08-01' AND `opening_date` <= '{year}-08-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['sept'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-09-01' AND `opening_date` <= '{year}-09-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['oct'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-10-01' AND `opening_date` <= '{year}-10-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['nov'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-11-01' AND `opening_date` <= '{year}-11-31'""".format(year=year), as_list=True)[0][0]
	datas['issues']['dez'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-12-01' AND `opening_date` <= '{year}-12-31'""".format(year=year), as_list=True)[0][0]
	return datas
	
@frappe.whitelist()
def get_comparative_monetary_datas():
	current_year = datetime.now().year
	prior_year = datetime.now().year - 1
	datas = {}
	datas['sinv_total'] = {}
	datas['sinv_total']['prior'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=prior_year), as_list=True)[0][0]
	datas['sinv_total']['current'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=current_year), as_list=True)[0][0]
	datas['dn_total'] = {}
	datas['dn_total']['prior'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=prior_year), as_list=True)[0][0]
	datas['dn_total']['current'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=current_year), as_list=True)[0][0]
	datas['so_total'] = {}
	datas['so_total']['prior'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-01-01' AND `transaction_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=prior_year), as_list=True)[0][0]
	datas['so_total']['current'] = frappe.db.sql("""SELECT SUM(`total`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-01-01' AND `transaction_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=current_year), as_list=True)[0][0]
	return datas
	
@frappe.whitelist()
def get_comparative_qty_based_datas():
	current_year = datetime.now().year
	prior_year = datetime.now().year - 1
	datas = {}
	datas['sinv_total'] = {}
	datas['sinv_total']['prior'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=prior_year), as_list=True)[0][0]
	datas['sinv_total']['current'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Invoice` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=current_year), as_list=True)[0][0]
	datas['dn_total'] = {}
	datas['dn_total']['prior'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=prior_year), as_list=True)[0][0]
	datas['dn_total']['current'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabDelivery Note` WHERE `posting_date` >= '{year}-01-01' AND `posting_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=current_year), as_list=True)[0][0]
	datas['so_total'] = {}
	datas['so_total']['prior'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-01-01' AND `transaction_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=prior_year), as_list=True)[0][0]
	datas['so_total']['current'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabSales Order` WHERE `transaction_date` >= '{year}-01-01' AND `transaction_date` <= '{year}-12-31' AND `docstatus` = 1""".format(year=current_year), as_list=True)[0][0]
	datas['iss_total'] = {}
	datas['iss_total']['prior'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-01-01' AND `opening_date` <= '{year}-12-31'""".format(year=prior_year), as_list=True)[0][0]
	datas['iss_total']['current'] = frappe.db.sql("""SELECT COUNT(`name`) FROM `tabIssue` WHERE `opening_date` >= '{year}-01-01' AND `opening_date` <= '{year}-12-31'""".format(year=current_year), as_list=True)[0][0]
	return datas
	
@frappe.whitelist()
def get_style():
	default = frappe.get_single("libradash settings")
	return default.layout