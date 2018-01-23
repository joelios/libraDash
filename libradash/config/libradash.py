from __future__ import unicode_literals
from frappe import _

def get_data():
    return[
        {
			"label": _("Dashboards"),
			"icon": "fa fa-tachometer",
			"items": [
				{
					"type": "page",
					"name": "libradashboard",
					"label": _("libracore Dashboard"),
					"description": _("libracore Admin Dashboard")
				}
			]
		},
		{
			"label": _("Setup"),
			"icon": "fa fa-tachometer",
			"items": [
				{
					"type": "doctype",
					"name": "Standard Settings",
					"label": _("Dashboard Setup"),
					"description": _("Setup for Dashboard")
				},
				{
					"type": "doctype",
					"name": "User Standard Settings",
					"label": _("User specific standard settings"),
					"description": _("User specific setup for Dashboard")
				}
			]
		}
	]