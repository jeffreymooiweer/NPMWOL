from flask import jsonify, request
from models import db, Device
from wol import wake_device

def init_routes(app):
    @app.route("/api/devices", methods=["GET"])
    def get_devices():
        devices = Device.query.all()
        return jsonify([{"id": d.id, "name": d.name, "ip": d.ip, "mac": d.mac} for d in devices])

    @app.route("/api/devices", methods=["POST"])
    def add_device():
        data = request.json
        new_device = Device(name=data["name"], ip=data["ip"], mac=data["mac"])
        db.session.add(new_device)
        db.session.commit()
        return jsonify({"message": "Device added"}), 201

    @app.route("/api/devices/<int:id>", methods=["DELETE"])
    def delete_device(id):
        device = Device.query.get_or_404(id)
        db.session.delete(device)
        db.session.commit()
        return jsonify({"message": "Device deleted"})

    @app.route("/api/wake/<int:id>", methods=["POST"])
    def wake_device_api(id):
        device = Device.query.get_or_404(id)
        success = wake_device(device.mac)
        if success:
            return jsonify({"message": "Magic packet sent"}), 200
        return jsonify({"message": "Failed to send Magic Packet"}), 500

    @app.route("/api/nginx-config/<int:id>", methods=["GET"])
    def generate_nginx_config(id):
        device = Device.query.get_or_404(id)
        config = f"""
        location / {{
            proxy_pass http://{device.ip}:8080;
            access_log /data/logs/access.log;
            error_log /data/logs/error.log;

            access_by_lua_block {{
                local handle = io.popen("curl -s http://127.0.0.1:5001/api/wake/{device.id} -X POST")
                local result = handle:read("*a")
                ngx.log(ngx.ERR, "WOL script output: " .. result)
                handle:close()
            }}
        }}
        """
        return jsonify({"nginx_config": config.strip()})
