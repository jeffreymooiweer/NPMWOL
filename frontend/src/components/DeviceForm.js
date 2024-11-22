import React, { useState, useEffect } from "react";

function DeviceForm({ saveDevice, device }) {
    const [name, setName] = useState("");
    const [ip, setIp] = useState("");
    const [mac, setMac] = useState("");

    useEffect(() => {
        if (device) {
            setName(device.name);
            setIp(device.ip);
            setMac(device.mac);
        }
    }, [device]);

    const handleSubmit = (e) => {
        e.preventDefault();
        saveDevice({ id: device?.id, name, ip, mac });
        setName("");
        setIp("");
        setMac("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Naam" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="IP-adres" value={ip} onChange={(e) => setIp(e.target.value)} />
            <input type="text" placeholder="MAC-adres" value={mac} onChange={(e) => setMac(e.target.value)} />
            <button type="submit">Opslaan</button>
        </form>
    );
}

export default DeviceForm;

