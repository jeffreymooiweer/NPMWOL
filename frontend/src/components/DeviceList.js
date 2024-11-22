import React from "react";

function DeviceList({ devices, setSelectedDevice, deleteDevice }) {
    return (
        <ul>
            {devices.map((device) => (
                <li key={device.id}>
                    {device.name} - {device.ip} - {device.mac}
                    <button onClick={() => setSelectedDevice(device)}>Bewerken</button>
                    <button onClick={() => deleteDevice(device.id)}>Verwijderen</button>
                </li>
            ))}
        </ul>
    );
}

export default DeviceList;

