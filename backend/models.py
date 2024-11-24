# backend/models.py

from app import db

class Device(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    domain = db.Column(db.String(255), nullable=False)
    ip = db.Column(db.String(255), nullable=False)
    mac = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "domain": self.domain,
            "ip": self.ip,
            "mac": self.mac,
        }
