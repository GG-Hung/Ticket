# Copyright 2022 Tecnativa - Víctor Martínez
# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).

from odoo import fields, models


class Company(models.Model):
    _inherit = "res.company"

    SCTP_helpdesk_portal_select_team = fields.Boolean(
        string="Select team in Helpdesk portal"
    )
    SCTP_helpdesk_portal_team_id_required = fields.Boolean(
        string="Required Team field in Helpdesk portal",
        default=True,
    )
    SCTP_helpdesk_portal_category_id_required = fields.Boolean(
        string="Required Category field in Helpdesk portal",
        default=True,
    )
    SCTP_helpdeskdefault_team_id = fields.Many2one('helpdesk.ticket.team', string="Default Team")