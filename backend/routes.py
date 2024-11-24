# backend/routes.py

from flask import Blueprint, request, jsonify
from app import db
from models import Device
from wol import send_wol_packet
from schemas import DeviceSchema

device_bp = Blueprint('devices', __name__)
device_schema = DeviceSchema()
devices_schema = DeviceSchema(many=True)

def init_routes(app):
    @device_bp.route("/devices", methods=["GET"])
    def get_devices():
        devices = Device.query.all()
        return jsonify(devices_schema.dump(devices)), 200

    @device_bp.route("/devices", methods=["POST"])
    def add_device():
        data = request.json
        try:
            validated_data = device_schema.load(data)
        except ValidationError as err:
            return jsonify(err.messages), 400

        new_device = Device(
            domain=validated_data["domain"],
            ip=validated_data["ip"],
            mac=validated_data["mac"]
        )
        db.session.add(new_device)
        db.session.commit()
        app.logger.info(f'Apparaat toegevoegd: {new_device.to_dict()}')
        return jsonify(device_schema.dump(new_device)), 201

    @device_bp.route("/devices/<int:id>", methods=["DELETE"])
    def delete_device(id):
        device = Device.query.get_or_404(id)
        db.session.delete(device)
        db.session.commit()
        app.logger.info(f'Apparaat verwijderd: {device.to_dict()}')
        return '', 204

    @device_bp.route("/devices/<int:id>", methods=["PUT"])
    def update_device(id):
        device = Device.query.get_or_404(id)
        data = request.json
        try:
            validated_data = device_schema.load(data, partial=True)
        except ValidationError as err:
            return jsonify(err.messages), 400

        device.domain = validated_data.get("domain", device.domain)
        device.ip = validated_data.get("ip", device.ip)
        device.mac = validated_data.get("mac", device.mac)
        db.session.commit()
        app.logger.info(f'Apparaat bijgewerkt: {device.to_dict()}')
        return jsonify(device_schema.dump(device)), 200

    @device_bp.route("/wake/<int:id>", methods=["POST"])
    def wake_device(id):
        device = Device.query.get_or_404(id)
        try:
            send_wol_packet(device.mac)
            app.logger.info(f'Magic Packet verzonden naar {device.domain} ({device.ip})')
            return jsonify({"message": "Magic Packet sent!"}), 200
        except Exception as e:
            app.logger.error(f'Fout bij verzenden Magic Packet naar {device.domain}: {str(e)}')
            return jsonify({"error": "Fout bij verzenden Magic Packet"}), 500

    @device_bp.route("/nginx-config/<int:id>", methods=["GET"])
    def generate_nginx_config(id):
        device = Device.query.get_or_404(id)
        config = f"""
        location / {{
            proxy_pass http://{device.ip}:8080;
            access_log /data/logs/access.log;
            error_log /data/logs/error.log;

            access_by_lua_block {{
                local handle = io.popen("curl -s http://{device.ip}:5001/wake")
                local result = handle:read("*a")
                ngx.log(ngx.ERR, "WOL script output: " .. result)
                handle:close()
            }}
        }}
        """
        app.logger.info(f'Nginx-configuratie gegenereerd voor {device.to_dict()}')
        return jsonify({"nginx_config": config}), 200

    app.register_blueprint(device_bp, url_prefix='/api')
