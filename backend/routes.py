from flask import jsonify, request
from wol import wake_device

devices = [
    {"id": 1, "name": "PC1", "ip": "192.168.1.6", "mac": "F0-2F-74-CD-DD-7D"}
]

def init_routes(app):
    @app.route("/api/devices", methods=["GET"])
    def get_devices():
        return jsonify(devices)

    @app.route("/api/devices", methods=["POST"])
    def add_device():
        data = request.json
        new_device = {
            "id": len(devices) + 1,
            "name": data["name"],
            "ip": data["ip"],
            "mac": data["mac"]
        }
        devices.append(new_device)
        return jsonify(new_device), 201

    @app.route("/api/wake/<int:device_id>", methods=["POST"])
    def wake_device_api(device_id):
        device = next((d for d in devices if d["id"] == device_id), None)
        if not device:
            return jsonify({"error": "Device not found"}), 404

        success = wake_device(device["mac"])
        if success:
            return jsonify({"message": f"Magic packet sent to {device['name']}"}), 200
        return jsonify({"error": "Failed to send Magic Packet"}), 500

    @app.route("/api/nginx-config/<int:device_id>", methods=["GET"])
    def generate_nginx_config(device_id):
        device = next((d for d in devices if d["id"] == device_id), None)
        if not device:
            return jsonify({"error": "Device not found"}), 404

        config = f"""
        location / {{
            proxy_pass http://{device['ip']}:8080;
            access_log /data/logs/access.log;
            error_log /data/logs/error.log;

            access_by_lua_block {{
                local handle = io.popen("curl -s http://127.0.0.1:5001/api/wake/{device_id} -X POST")
                local result = handle:read("*a")
                ngx.log(ngx.ERR, "WOL script output: " .. result)
                handle:close()
            }}
        }}
        """
        return jsonify({"nginx_config": config.strip()})
