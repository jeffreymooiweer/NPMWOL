from wakeonlan import send_magic_packet

def wake_device(mac_address):
    """Stuur een magic packet naar het opgegeven MAC-adres."""
    try:
        send_magic_packet(mac_address)
        return True
    except Exception as e:
        print(f"Error sending magic packet: {e}")
        return False
