// frontend/src/components/ExportButton.js

import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

const ExportButton = ({ devices }) => {
    const handleExport = () => {
        axios.get('/api/devices/export', { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'devices.csv');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            })
            .catch((err) => {
                console.error(err);
                alert("Fout bij exporteren van apparaten.");
            });
    };

    return (
        <Button variant="contained" color="secondary" onClick={handleExport}>
            Exporteren
        </Button>
    );
};

export default ExportButton;
