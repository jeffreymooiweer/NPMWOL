from flask import Flask, jsonify, request
from models import db, Device, init_db
from wakeonlan import send_magic_packet

app = Flask(__name__)

# Databaseconfiguratie
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///devices.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialiseer de database
init_db(app)

# Routes
@app.route("/api/devices", methods=["GET"])
def get_devices():
    """Haal alle apparaten op uit de database."""
    devices = Device.query.all()
    return jsonify([
        {"id": d.id, "domain": d.domain, "ip": d.ip, "mac": d.mac} for d in devices
    ])

@app.route("/api/devices", methods=["POST"])
def add_device():
    """Voeg een nieuw apparaat toe aan de database."""
    data = request.json
    new_device = Device(domain=data["domain"], ip=data["ip"], mac=data["mac"])
    db.session.add(new_device)
    db.session.commit()
    return jsonify({"id": new_device.id, "domain": new_device.domain, "ip": new_device.ip, "mac": new_device.mac}), 201

@app.route("/api/devices/<int:id>", methods=["DELETE"])
def delete_device(id):
    """Verwijder een apparaat uit de database."""
    device = Device.query.get_or_404(id)
    db.session.delete(device)
    db.session.commit()
    return jsonify({"message": "Device deleted"})

@app.route("/api/wake/<int:id>", methods=["POST"])
def wake_device(id):
    """Stuur een Magic Packet naar een apparaat."""
    device = Device.query.get_or_404(id)
    try:
        send_magic_packet(device.mac)
        return jsonify({"message": f"Magic packet sent to {device.mac}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/")
def index():
    """Hoofdpagina."""
    return "NPM Wake-on-LAN Applicatie draait!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
