from flask import Flask, send_from_directory, jsonify, request
from models import db, Device, init_db
from wakeonlan import send_magic_packet

app = Flask(__name__, static_folder="build", static_url_path="")

# Databaseconfiguratie
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///devices.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialiseer de database
init_db(app)

# API-routes
@app.route("/api/devices", methods=["GET"])
def get_devices():
    devices = Device.query.all()
    return jsonify([
        {"id": d.id, "domain": d.domain, "ip": d.ip, "mac": d.mac} for d in devices
    ])

@app.route("/api/devices", methods=["POST"])
def add_device():
    data = request.json
    new_device = Device(domain=data["domain"], ip=data["ip"], mac=data["mac"])
    db.session.add(new_device)
    db.session.commit()
    return jsonify({"id": new_device.id, "domain": new_device.domain, "ip": new_device.ip, "mac": new_device.mac}), 201

@app.route("/api/devices/<int:id>", methods=["DELETE"])
def delete_device(id):
    device = Device.query.get_or_404(id)
    db.session.delete(device)
    db.session.commit()
    return jsonify({"message": "Device deleted"})

@app.route("/api/wake/<int:id>", methods=["POST"])
def wake_device(id):
    device = Device.query.get_or_404(id)
    try:
        send_magic_packet(device.mac)
        return jsonify({"message": f"Magic packet sent to {device.mac}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve React frontend
@app.route("/")
def serve_frontend():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve_static_files(path):
    return send_from_directory(app.static_folder, path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
