import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [devices, setDevices] = useState([]);
    const [newDevice, setNewDevice] = useState({ domain: "", ip: "", mac: "" });
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [generatedScript, setGeneratedScript] = useState("");

    useEffect(() => {
        // Haal apparaten op bij het laden van de app
        axios.get("/api/devices")
            .then((res) => setDevices(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleAddDevice = () => {
        if (!newDevice.domain || !newDevice.ip || !newDevice.mac) {
            alert("Vul alle velden in!");
            return;
        }

        axios.post("/api/devices", newDevice)
            .then((res) => {
                setDevices([...devices, res.data]);
                setNewDevice({ domain: "", ip: "", mac: "" });
            })
            .catch((err) => console.error(err));
    };

    const handleDeleteDevice = () => {
        if (!selectedDevice) {
            alert("Selecteer een apparaat om te verwijderen.");
            return;
        }

        axios.delete(`/api/devices/${selectedDevice.id}`)
            .then(() => {
                setDevices(devices.filter((device) => device.id !== selectedDevice.id));
                setSelectedDevice(null);
            })
            .catch((err) => console.error(err));
    };

    const handleTestWakeOnLan = () => {
        if (!selectedDevice) {
            alert("Selecteer een apparaat om Wake-on-LAN te testen.");
            return;
        }

        axios.post(`/api/wake/${selectedDevice.id}`)
            .then(() => alert("Magic Packet verzonden!"))
            .catch((err) => console.error(err));
    };

    const handleGenerateScript = () => {
        if (!selectedDevice) {
            alert("Selecteer een apparaat om het script te genereren.");
            return;
        }

        axios.get(`/api/nginx-config/${selectedDevice.id}`)
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
                            <th style={styles.th}></th>
                            <th style={styles.th}>Domain</th>
                            <th style={styles.th}>Internal IP</th>
                            <th style={styles.th}>MAC Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((device) => (
                            <tr key={device.id}>
                                <td style={styles.td}>
                                    <input
                                        type="radio"
                                        name="selectedDevice"
                                        checked={selectedDevice?.id === device.id}
                                        onChange={() => setSelectedDevice(device)}
                                    />
                                </td>
                                <td style={styles.td}>{device.domain}</td>
                                <td style={styles.td}>{device.ip}</td>
                                <td style={styles.td}>{device.mac}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={styles.actionButtons}>
                <button onClick={handleTestWakeOnLan} style={styles.actionButton}>
                    Test WOL
                </button>
                <button onClick={handleGenerateScript} style={styles.actionButton}>
                    Generate Script
                </button>
                <button onClick={handleDeleteDevice} style={styles.deleteButton}>
                    Delete
                </button>
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
        width: "100%",
        maxWidth: "800px",
        marginBottom: "20px",
        overflowX: "auto",
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
        fontSize: "calc(12px + 0.5vw)",
    },
    td: {
        padding: "10px",
        borderBottom: "1px solid #444",
        color: "#e0e0e0",
        fontSize: "calc(10px + 0.5vw)",
    },
    actionButtons: {
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        marginBottom: "20px",
    },
    actionButton: {
        padding: "10px 20px",
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
    },
    deleteButton: {
        padding: "10px 20px",
        backgroundColor: "#dc3545",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
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
