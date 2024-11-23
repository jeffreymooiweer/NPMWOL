import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [devices, setDevices] = useState([]);
    const [newDevice, setNewDevice] = useState({ name: "", ip: "", mac: "" });
    const [generatedScript, setGeneratedScript] = useState("");

    useEffect(() => {
        axios.get("/api/devices")
            .then((res) => setDevices(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleAddDevice = () => {
        axios.post("/api/devices", newDevice)
            .then((res) => {
                setDevices([...devices, res.data]);
                setNewDevice({ name: "", ip: "", mac: "" });
            })
            .catch((err) => console.error(err));
    };

    const handleGenerateScript = (id) => {
        axios.get(`/api/nginx-config/${id}`)
            .then((res) => setGeneratedScript(res.data.nginx_config))
            .catch((err) => console.error(err));
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>Wake-on-LAN NPM Configurator</h1>
            <div>
                <h2>Add a Device</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="IP Address"
                    value={newDevice.ip}
                    onChange={(e) => setNewDevice({ ...newDevice, ip: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="MAC Address"
                    value={newDevice.mac}
                    onChange={(e) => setNewDevice({ ...newDevice, mac: e.target.value })}
                />
                <button onClick={handleAddDevice}>Add Device</button>
            </div>
            <div>
                <h2>Devices</h2>
                <ul>
                    {devices.map((device) => (
                        <li key={device.id}>
                            {device.name} - {device.ip} - {device.mac}
                            <button onClick={() => handleGenerateScript(device.id)}>Generate Nginx Script</button>
                        </li>
                    ))}
                </ul>
            </div>
            {generatedScript && (
                <div>
                    <h2>Generated Script</h2>
                    <textarea readOnly value={generatedScript} style={{ width: "100%", height: "100px" }}></textarea>
                    <button onClick={() => navigator.clipboard.writeText(generatedScript)}>Copy Script</button>
                </div>
            )}
        </div>
    );
}

export default App;
