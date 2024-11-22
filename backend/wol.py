from wakeonlan import send_magic_packet

def wake_device(mac_address):
    send_magic_packet(mac_address)
