# NPMWOL

Een eenvoudige oplossing om Wake-on-LAN magic packets te sturen via een Docker-container.

## Functies
- Beheer apparaten (IP, MAC).
- Genereer Nginx-configuratiescripts.
- Stuur Wake-on-LAN magic packets.

## Installatie
1. Build de Docker-container:
   ```bash
   docker build -t npmwol .
Start de container:
bash
Code kopiëren
docker run -d -p 5001:5001 npmwol
Voeg apparaten toe via de API of webinterface.
API Endpoints
GET /api/devices - Haal alle apparaten op.
POST /api/devices - Voeg een nieuw apparaat toe.
POST /api/wake/<id> - Stuur een magic packet.
GET /api/nginx-config/<id> - Genereer Nginx-configuratiescript.
