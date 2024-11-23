# Stap 1: Frontend builden
FROM node:16 AS frontend
WORKDIR /app
COPY frontend/ .
RUN npm install
RUN npm run build

# Stap 2: Backend
FROM python:3.9-slim AS backend
WORKDIR /app
COPY backend/ .
COPY --from=frontend /app/build ./build
RUN pip install -r requirements.txt

# Exposeer poort 5001
EXPOSE 5001

# Start de backend
CMD ["python", "app.py"]
