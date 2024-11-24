// frontend/src/components/EditDeviceModal.js

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const EditDeviceModal = ({ open, handleClose, device, handleSave }) => {
    const [formData, setFormData] = useState({ domain: '', ip: '', mac: '' });

    useEffect(() => {
        if (device) {
            setFormData({ domain: device.domain, ip: device.ip, mac: device.mac });
        }
    }, [device]);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = () => {
        handleSave({ ...device, ...formData });
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Apparaat Bewerken</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    name="domain"
                    label="Domeinnaam"
                    type="text"
                    fullWidth
                    value={formData.domain}
                    onChange={onChange}
                />
                <TextField
                    margin="dense"
                    name="ip"
                    label="Intern IP-adres"
                    type="text"
                    fullWidth
                    value={formData.ip}
                    onChange={onChange}
                />
                <TextField
                    margin="dense"
                    name="mac"
                    label="MAC-adres"
                    type="text"
                    fullWidth
                    value={formData.mac}
                    onChange={onChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Annuleren</Button>
                <Button onClick={onSubmit} color="primary">Opslaan</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditDeviceModal;
