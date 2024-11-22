FROM python:3.9-slim

# Werkmap instellen
WORKDIR /app

# Kopieer bestanden en installeer dependencies
COPY backend/ /app
RUN pip install -r requirements.txt

# Poort openen
EXPOSE 5001

# Start applicatie
CMD ["python", "app.py"]

