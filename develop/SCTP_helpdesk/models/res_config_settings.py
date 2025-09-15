# Copyright 2022 Tecnativa - Víctor Martínez
# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
from odoo import fields, models


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"

    SCTP_helpdesk_portal_select_team = fields.Boolean(
        related="company_id.SCTP_helpdesk_portal_select_team",
        readonly=False,
    )
    SCTP_helpdesk_portal_team_id_required = fields.Boolean(
        related="company_id.SCTP_helpdesk_portal_team_id_required",
        readonly=False,
    )
    SCTP_helpdesk_portal_category_id_required = fields.Boolean(
        related="company_id.SCTP_helpdesk_portal_category_id_required",
        readonly=False,
    )
    SCTP_helpdeskdefault_team_id = fields.Many2one('helpdesk.ticket.team',
        related="company_id.SCTP_helpdeskdefault_team_id",
        readonly=False,
    )
