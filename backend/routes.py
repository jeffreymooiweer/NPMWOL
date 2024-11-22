from flask import request, jsonify
from wol import wake_device

devices = [{"id": 1, "name": "PC1", "ip": "192.168.1.6", "mac": "F0-2F-74-CD-DD-7D"}]

def init_routes(app):
    @app.route("/api/devices", methods=["GET"])
    def get_devices():
        return jsonify(devices)

    @app.route("/api/wake/<int:id>", methods=["POST"])
    def wake(id):
        device = next((d for d in devices if d["id"] == id), None)
        if device:
            wake_device(device["mac"])
            return jsonify({"message": "Magic packet sent"}), 200
        return jsonify({"error": "Device not found"}), 404

    @app.route("/api/nginx-config/<int:id>", methods=["GET"])
    def generate_config(id):
        device = next((d for d in devices if d["id"] == id), None)
        if not device:
            return jsonify({"error": "Device not found"}), 404

        config = f"""
        location / {{
            proxy_pass http://{device['ip']}:8080;
            access_log /data/logs/access.log;
            error_log /data/logs/error.log;

            access_by_lua_block {{
                local handle = io.popen("curl -s http://127.0.0.1:5001/api/wake/{device['id']} -X POST")
                local result = handle:read("*a")
                ngx.log(ngx.ERR, "WOL script output: " .. result)
                handle:close()
            }}
        }}
        """
        return jsonify({"nginx_config": config.strip()}), 200
