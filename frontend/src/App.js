import React, { useState, useEffect } from "react";
import DeviceForm from "./components/DeviceForm";
import DeviceList from "./components/DeviceList";
import ScriptGenerator from "./components/ScriptGenerator";
import axios from "axios";

function App() {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:5001/api/devices")
            .then((response) => setDevices(response.data))
            .catch((error) => console.error(error));
    }, []);

    const saveDevice = (device) => {
        if (device.id) {
            axios.put(`http://127.0.0.1:5001/api/devices/${device.id}`, device)
                .then(() => fetchDevices());
        } else {
            axios.post("http://127.0.0.1:5001/api/devices", device)
                .then(() => fetchDevices());
        }
    };

    const deleteDevice = (id) => {
        axios.delete(`http://127.0.0.1:5001/api/devices/${id}`)
            .then(() => setDevices(devices.filter((d) => d.id !== id)));
    };

    return (
        <div>
            <h1>Wake-on-LAN Dashboard</h1>
            <DeviceForm saveDevice={saveDevice} device={selectedDevice} />
            <DeviceList devices={devices} setSelectedDevice={setSelectedDevice} deleteDevice={deleteDevice} />
            {selectedDevice && <ScriptGenerator device={selectedDevice} />}
        </div>
    );
}

export default App;

