# backend/schemas.py

from marshmallow import Schema, fields, validates, ValidationError
import ipaddress
import re

class DeviceSchema(Schema):
    id = fields.Int(dump_only=True)
    domain = fields.Str(required=True)
    ip = fields.Str(required=True)
    mac = fields.Str(required=True)

    @validates('ip')
    def validate_ip(self, value):
        try:
            ipaddress.ip_address(value)
        except ValueError:
            raise ValidationError("Ongeldig IP-adres.")

    @validates('mac')
    def validate_mac(self, value):
        if not re.match(r'^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$', value):
            raise ValidationError("Ongeldig MAC-adres.")
