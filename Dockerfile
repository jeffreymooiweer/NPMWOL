# Dockerfile

# STAGE 1: Build React frontend
FROM node:16 AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# STAGE 2: Build Python backend
FROM python:3.9
WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./

# Copy frontend build to backend
COPY --from=frontend-builder /frontend/build/ ./build/

# Expose Flask port
EXPOSE 5001

# Start the backend
CMD ["python", "app.py"]
