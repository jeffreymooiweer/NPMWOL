from flask import Flask, send_from_directory, jsonify, request
from wakeonlan import send_magic_packet

app = Flask(__name__, static_folder="build", static_url_path="")

# API voor apparaten
devices = []

@app.route("/api/devices", methods=["POST"])
def add_device():
    """Voeg een nieuw apparaat toe."""
    data = request.json
    device = {
        "id": len(devices) + 1,
        "domain": data["domain"],
        "ip": data["ip"],
        "mac": data["mac"]
    }
    devices.append(device)
    return jsonify(device), 201

@app.route("/api/nginx-config/<int:id>", methods=["GET"])
def generate_nginx_config(id):
    """Genereer een Nginx-configuratie voor een apparaat."""
    device = next((d for d in devices if d["id"] == id), None)
    if not device:
        return jsonify({"error": "Device not found"}), 404

    script = f"""
    location / {{
        proxy_pass http://{device['ip']}:8080; # Intern IP van de applicatie
        access_by_lua_block {{
            local handle = io.popen("curl -s http://127.0.0.1:5001/api/wake/{device['id']} -X POST")
            local result = handle:read("*a")
            ngx.log(ngx.ERR, "WOL script output: " .. result)
            handle:close()
        }}
    }}
    """
    return jsonify({"nginx_config": script.strip()}), 200

@app.route("/api/wake/<int:id>", methods=["POST"])
def wake_device(id):
    """Stuur een Magic Packet naar een apparaat."""
    device = next((d for d in devices if d["id"] == id), None)
    if not device:
        return jsonify({"error": "Device not found"}), 404

    try:
        send_magic_packet(device["mac"])
        return jsonify({"message": f"Magic packet sent to {device['mac']}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Frontend serveren
@app.route("/")
def serve_frontend():
    """Serve de React frontend."""
    return send_from_directory(app.static_folder, "index.html")

@app.route("/<path:path>")
def serve_static_files(path):
    """Serve static files voor de React frontend."""
    return send_from_directory(app.static_folder, path)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
