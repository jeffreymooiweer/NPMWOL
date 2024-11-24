# NPM Wake-on-LAN Configurator

Een applicatie die Wake-on-LAN-functionaliteit integreert met Nginx Proxy Manager (NPM) op een Unraid-server.

## Inhoudsopgave
- [Functies](#functies)
- [Installatie](#installatie)
- [Gebruik](#gebruik)
- [API Eindpunten](#api-eindpunten)
- [Configuratie](#configuratie)
- [Ontwikkeling](#ontwikkeling)
- [Bijdragen](#bijdragen)
- [Licentie](#licentie)

## Functies
- Voeg apparaten toe met domeinnaam, intern IP en MAC-adres.
- Genereer Nginx-configuratiescripts.
- Test Wake-on-LAN-pakketten.
- Bewerken en verwijderen van apparaten.
- Exporteer apparaten naar CSV.

## Installatie

### Vereisten
- Docker
- Unraid-server

### Stappen

1. **Clone deze repository:**
    ```bash
    git clone https://github.com/jeffreymooiweer/NPMWOL.git
    cd NPMWOL
    ```

2. **Bouw en start de Docker-container:**
    ```bash
    docker build -t npmwol .
    docker run -d -p 8462:5001 --name npmwol npmwol
    ```

3. **Open de applicatie in je browser:**
    ```
    http://<unraid-ip>:8462
    ```

## Gebruik

1. **Apparaten Toevoegen:**
    - Vul de domeinnaam, intern IP-adres en MAC-adres in het formulier in.
    - Klik op "Voeg Toe" om het apparaat aan de lijst toe te voegen.

2. **Apparaten Bewerken en Verwijderen:**
    - Selecteer een apparaat door de radioknop naast het apparaat te klikken.
    - Klik op "Bewerken" om de apparaatgegevens aan te passen.
    - Klik op "Verwijderen" om het apparaat uit de lijst te verwijderen.

3. **Wake-on-LAN Testen:**
    - Selecteer een apparaat.
    - Klik op "Test WOL" om een Magic Packet te verzenden naar het apparaat.

4. **Nginx-configuratie Genereren:**
    - Selecteer een apparaat.
    - Klik op "Genereer Script" om het Nginx-configuratiescript te genereren.
    - Kopieer het script en voeg het toe aan de geavanceerde instellingen van je Nginx Proxy Manager-host.

5. **Apparaten Exporteren:**
    - Klik op "Exporteren" om alle apparaten te downloaden als een CSV-bestand.

## API Eindpunten

### GET /api/devices
**Beschrijving:**
Haal alle apparaten op.

**Antwoord:**
```json
[
  {
    "id": 1,
    "domain": "example.com",
    "ip": "192.168.1.100",
    "mac": "AA:BB:CC:DD:EE:FF"
  },
  ...
]
