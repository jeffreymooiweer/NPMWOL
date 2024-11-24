import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [devices, setDevices] = useState([]);
    const [newDevice, setNewDevice] = useState({ domain: "", ip: "", mac: "" });
    const [generatedScript, setGeneratedScript] = useState("");

    useEffect(() => {
        // Haal apparaten op wanneer de app wordt geladen
        axios.get("/api/devices")
            .then((res) => setDevices(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleAddDevice = () => {
        axios.post("/api/devices", newDevice)
            .then((res) => {
                setDevices([...devices, res.data]);
                setNewDevice({ domain: "", ip: "", mac: "" });
            })
            .catch((err) => console.error(err));
    };

    const handleDeleteDevice = (id) => {
        axios.delete(`/api/devices/${id}`)
            .then(() => {
                setDevices(devices.filter((device) => device.id !== id));
            })
            .catch((err) => console.error(err));
    };

    const handleTestWakeOnLan = (id) => {
        axios.post(`/api/wake/${id}`)
            .then(() => alert("Magic Packet Sent!"))
            .catch((err) => console.error(err));
    };

    const handleGenerateScript = (id) => {
        axios.get(`/api/nginx-config/${id}`)
            .then((res) => setGeneratedScript(res.data.nginx_config))
            .catch((err) => console.error(err));
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>NPM Wake-on-LAN Configurator</h1>
            <div style={styles.form}>
                <h2>Add Configuration</h2>
                <input
                    type="text"
                    placeholder="Domain Name"
                    value={newDevice.domain}
                    onChange={(e) => setNewDevice({ ...newDevice, domain: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Internal IP"
                    value={newDevice.ip}
                    onChange={(e) => setNewDevice({ ...newDevice, ip: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="MAC Address"
                    value={newDevice.mac}
                    onChange={(e) => setNewDevice({ ...newDevice, mac: e.target.value })}
                    style={styles.input}
                />
                <button onClick={handleAddDevice} style={styles.button}>Add Device</button>
            </div>

            <div style={styles.tableContainer}>
                <h2>Devices</h2>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>Domain</th>
                            <th>Internal IP</th>
                            <th>MAC Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((device) => (
                            <tr key={device.id}>
                                <td>{device.domain}</td>
                                <td>{device.ip}</td>
                                <td>{device.mac}</td>
                                <td>
                                    <button onClick={() => handleTestWakeOnLan(device.id)} style={styles.actionButton}>
                                        Test WOL
                                    </button>
                                    <button onClick={() => handleGenerateScript(device.id)} style={styles.actionButton}>
                                        Generate Script
                                    </button>
                                    <button onClick={() => handleDeleteDevice(device.id)} style={styles.deleteButton}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {generatedScript && (
                <div style={styles.scriptContainer}>
                    <h2>Generated Script</h2>
                    <textarea readOnly value={generatedScript} style={styles.textarea}></textarea>
                    <button onClick={() => navigator.clipboard.writeText(generatedScript)} style={styles.button}>
                        Copy Script
                    </button>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: "#121212",
        color: "#fff",
        padding: "20px",
        fontFamily: "Arial",
        minHeight: "100vh",
    },
    title: {
        textAlign: "center",
    },
    form: {
        marginBottom: "20px",
    },
    input: {
        margin: "5px",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #555",
        backgroundColor: "#1e1e1e",
        color: "#fff",
    },
    button: {
        margin: "5px",
        padding: "10px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    tableContainer: {
        marginTop: "20px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    actionButton: {
        margin: "0 5px",
        padding: "5px 10px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    deleteButton: {
        margin: "0 5px",
        padding: "5px 10px",
        backgroundColor: "#dc3545",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    scriptContainer: {
        marginTop: "20px",
    },
    textarea: {
        width: "100%",
        height: "100px",
        backgroundColor: "#1e1e1e",
        color: "#fff",
        padding: "10px",
        border: "1px solid #555",
        borderRadius: "5px",
    },
};

export default App;
