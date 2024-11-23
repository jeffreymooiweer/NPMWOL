import React, { useState } from "react";
import axios from "axios";

function App() {
    const [domain, setDomain] = useState("");
    const [ip, setIp] = useState("");
    const [mac, setMac] = useState("");
    const [generatedScript, setGeneratedScript] = useState("");

    const handleAddDevice = async () => {
        const device = { domain, ip, mac };
        try {
            const response = await axios.post("/api/devices", device);
            alert(`Device added: ${response.data.domain}`);
        } catch (error) {
            console.error(error);
        }
    };

    const handleGenerateScript = async (id) => {
        try {
            const response = await axios.get(`/api/nginx-config/${id}`);
            setGeneratedScript(response.data.nginx_config);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>NPM Wake-on-LAN Configurator</h1>
            <div>
                <h2>Add Configuration</h2>
                <input
                    type="text"
                    placeholder="Domain Name"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="NPM IP Address"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="MAC Address"
                    value={mac}
                    onChange={(e) => setMac(e.target.value)}
                />
                <button onClick={handleAddDevice}>Add Device</button>
            </div>
            <div>
                <h2>Generate Script</h2>
                <button onClick={() => handleGenerateScript(1)}>Generate Nginx Script</button>
            </div>
            {generatedScript && (
                <div>
                    <h2>Generated Script</h2>
                    <textarea
                        readOnly
                        value={generatedScript}
                        style={{ width: "100%", height: "100px" }}
                    />
                    <button onClick={() => navigator.clipboard.writeText(generatedScript)}>
                        Copy Script
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
