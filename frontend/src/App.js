import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [devices, setDevices] = useState([]);
    const [newDevice, setNewDevice] = useState({ domain: "", ip: "", mac: "" });
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
                <h2 style={styles.sectionTitle}>Devices</h2>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Domain</th>
                            <th style={styles.th}>Internal IP</th>
                            <th style={styles.th}>MAC Address</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((device) => (
                            <tr key={device.id}>
                                <td style={styles.td}>{device.domain}</td>
                                <td style={styles.td}>{device.ip}</td>
                                <td style={styles.td}>{device.mac}</td>
                                <td style={styles.td}>
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
                    <h2 style={styles.sectionTitle}>Generated Script</h2>
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
        backgroundColor: "#1a1a1a",
        color: "#e0e0e0",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    title: {
        fontSize: "24px",
        marginBottom: "20px",
        color: "#ffffff",
    },
    form: {
        marginBottom: "30px",
        width: "90%",
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
    },
    input: {
        marginBottom: "10px",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #444",
        backgroundColor: "#2a2a2a",
        color: "#e0e0e0",
        fontSize: "14px",
    },
    button: {
        padding: "10px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        textAlign: "center",
    },
    tableContainer: {
        width: "90%",
        maxWidth: "800px",
        marginBottom: "30px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "#2a2a2a",
    },
    th: {
        textAlign: "left",
        padding: "10px",
        borderBottom: "2px solid #444",
        color: "#e0e0e0",
    },
    td: {
        padding: "10px",
        borderBottom: "1px solid #444",
        color: "#e0e0e0",
    },
    actionButton: {
        padding: "5px 10px",
        margin: "0 5px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    deleteButton: {
        padding: "5px 10px",
        margin: "0 5px",
        backgroundColor: "#dc3545",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    scriptContainer: {
        width: "90%",
        maxWidth: "600px",
    },
    sectionTitle: {
        fontSize: "18px",
        marginBottom: "10px",
    },
    textarea: {
        width: "100%",
        height: "100px",
        backgroundColor: "#2a2a2a",
        color: "#e0e0e0",
        padding: "10px",
        border: "1px solid #444",
        borderRadius: "5px",
    },
};

export default App;
