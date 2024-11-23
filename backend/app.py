from flask import Flask, request, jsonify
from wakeonlan import send_magic_packet

app = Flask(__name__)

devices = []  # Opslag voor configuraties

@app.route("/api/devices", methods=["POST"])
def add_device():
    data = request.json
    new_device = {
        "id": len(devices) + 1,
        "domain": data["domain"],
        "ip": data["ip"],
        "mac": data["mac"]
    }
    devices.append(new_device)
    return jsonify(new_device), 201

@app.route("/api/nginx-config/<int:id>", methods=["GET"])
def generate_nginx_config(id):
    device = next((d for d in devices if d["id"] == id), None)
    if not device:
        return jsonify({"error": "Device not found"}), 404

    script = f"""
    location / {{
        proxy_pass http://{device['ip']}:8080; # IP van de interne applicatie
        access_log /data/logs/access.log;
        error_log /data/logs/error.log;

        # Seintje sturen naar deze applicatie
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
    device = next((d for d in devices if d["id"] == id), None)
    if not device:
        return jsonify({"error": "Device not found"}), 404

    try:
        send_magic_packet(device["mac"])
        return jsonify({"message": f"Magic packet sent to {device['mac']}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/")
def index():
    return "NPM Wake-on-LAN Application Running!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
