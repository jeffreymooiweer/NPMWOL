// frontend/src/App.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, Alert } from "@mui/material";
import EditDeviceModal from "./components/EditDeviceModal";
import ExportButton from "./components/ExportButton";

function App() {
    const [devices, setDevices] = useState([]);
    const [newDevice, setNewDevice] = useState({ domain: "", ip: "", mac: "" });
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [generatedScript, setGeneratedScript] = useState("");
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [editModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = () => {
        axios.get("/api/devices")
            .then((res) => setDevices(res.data))
            .catch((err) => {
                console.error(err);
                setNotification({ open: true, message: "Fout bij ophalen apparaten.", severity: "error" });
            });
    };

    const handleAddDevice = () => {
        if (!newDevice.domain || !newDevice.ip || !newDevice.mac) {
            setNotification({ open: true, message: "Vul alle velden in.", severity: "warning" });
            return;
        }

        axios.post("/api/devices", newDevice)
            .then((res) => {
                setDevices([...devices, res.data]);
                setNewDevice({ domain: "", ip: "", mac: "" });
                setNotification({ open: true, message: "Apparaat toegevoegd!", severity: "success" });
            })
            .catch((err) => {
                console.error(err);
                setNotification({ open: true, message: "Fout bij toevoegen apparaat.", severity: "error" });
            });
    };

    const handleDeleteDevice = () => {
        if (!selectedDevice) {
            setNotification({ open: true, message: "Selecteer een apparaat om te verwijderen.", severity: "warning" });
            return;
        }

        axios.delete(`/api/devices/${selectedDevice.id}`)
            .then(() => {
                setDevices(devices.filter((device) => device.id !== selectedDevice.id));
                setSelectedDevice(null);
                setNotification({ open: true, message: "Apparaat verwijderd!", severity: "success" });
            })
            .catch((err) => {
                console.error(err);
                setNotification({ open: true, message: "Fout bij verwijderen apparaat.", severity: "error" });
            });
    };

    const handleTestWakeOnLan = () => {
        if (!selectedDevice) {
            setNotification({ open: true, message: "Selecteer een apparaat om WOL te testen.", severity: "warning" });
            return;
        }

        axios.post(`/api/wake/${selectedDevice.id}`)
            .then(() => setNotification({ open: true, message: "Magic Packet verzonden!", severity: "success" }))
            .catch((err) => {
                console.error(err);
                setNotification({ open: true, message: "Fout bij verzenden Magic Packet.", severity: "error" });
            });
    };

    const handleGenerateScript = () => {
        if (!selectedDevice) {
            setNotification({ open: true, message: "Selecteer een apparaat om het script te genereren.", severity: "warning" });
            return;
        }

        axios.get(`/api/nginx-config/${selectedDevice.id}`)
            .then((res) => setGeneratedScript(res.data.nginx_config))
            .catch((err) => {
                console.error(err);
                setNotification({ open: true, message: "Fout bij genereren script.", severity: "error" });
            });
    };

    const handleEditDevice = (device) => {
        setSelectedDevice(device);
        setEditModalOpen(true);
    };

    const handleSaveEditedDevice = (updatedDevice) => {
        axios.put(`/api/devices/${updatedDevice.id}`, updatedDevice)
            .then((res) => {
                setDevices(devices.map(device => device.id === res.data.id ? res.data : device));
                setEditModalOpen(false);
                setNotification({ open: true, message: "Apparaat succesvol bijgewerkt.", severity: "success" });
            })
            .catch((err) => {
                console.error(err);
                setNotification({ open: true, message: "Fout bij bijwerken apparaat.", severity: "error" });
            });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>
                NPM Wake-on-LAN Configurator
            </Typography>

            <div style={{ marginBottom: '40px' }}>
                <Typography variant="h6" gutterBottom>
                    Voeg Apparaten Toe
                </Typography>
                <TextField
                    label="Domeinnaam"
                    variant="outlined"
                    value={newDevice.domain}
                    onChange={(e) => setNewDevice({ ...newDevice, domain: e.target.value })}
                    style={{ marginRight: '10px', marginBottom: '10px' }}
                />
                <TextField
                    label="Intern IP"
                    variant="outlined"
                    value={newDevice.ip}
                    onChange={(e) => setNewDevice({ ...newDevice, ip: e.target.value })}
                    style={{ marginRight: '10px', marginBottom: '10px' }}
                />
                <TextField
                    label="MAC-adres"
                    variant="outlined"
                    value={newDevice.mac}
                    onChange={(e) => setNewDevice({ ...newDevice, mac: e.target.value })}
                    style={{ marginRight: '10px', marginBottom: '10px' }}
                />
                <Button variant="contained" color="primary" onClick={handleAddDevice}>
                    Voeg Toe
                </Button>
            </div>

            <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Domeinnaam</TableCell>
                            <TableCell>Intern IP</TableCell>
                            <TableCell>MAC-adres</TableCell>
                            <TableCell>Acties</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {devices.map((device) => (
                            <TableRow key={device.id} selected={selectedDevice?.id === device.id}>
                                <TableCell>
                                    <input
                                        type="radio"
                                        name="selectedDevice"
                                        checked={selectedDevice?.id === device.id}
                                        onChange={() => setSelectedDevice(device)}
                                    />
                                </TableCell>
                                <TableCell>{device.domain}</TableCell>
                                <TableCell>{device.ip}</TableCell>
                                <TableCell>{device.mac}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="primary" onClick={() => handleEditDevice(device)} style={{ marginRight: '10px' }}>
                                        Bewerken
                                    </Button>
                                    <Button variant="outlined" color="secondary" onClick={handleDeleteDevice}>
                                        Verwijderen
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div style={{ marginBottom: '20px' }}>
                <Button variant="contained" color="success" onClick={handleTestWakeOnLan} style={{ marginRight: '10px' }}>
                    Test WOL
                </Button>
                <Button variant="contained" color="info" onClick={handleGenerateScript} style={{ marginRight: '10px' }}>
                    Genereer Script
                </Button>
                <ExportButton devices={devices} />
            </div>

            {generatedScript && (
                <div style={{ marginTop: '20px' }}>
                    <Typography variant="h6" gutterBottom>
                        Genereerd Nginx Script
                    </Typography>
                    <textarea
                        readOnly
                        value={generatedScript}
                        style={{ width: '100%', height: '200px', padding: '10px' }}
                    ></textarea>
                    <Button variant="contained" color="primary" onClick={() => navigator.clipboard.writeText(generatedScript)} style={{ marginTop: '10px' }}>
                        Kopieer Script
                    </Button>
                </div>
            )}

            <EditDeviceModal
                open={editModalOpen}
                handleClose={() => setEditModalOpen(false)}
                device={selectedDevice}
                handleSave={handleSaveEditedDevice}
            />

            <Snackbar open={notification.open} autoHideDuration={6000} onClose={() => setNotification({ ...notification, open: false })}>
                <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default App;
