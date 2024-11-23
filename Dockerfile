FROM node:16 AS frontend
WORKDIR /app
COPY frontend/ .
RUN npm install && npm run build

FROM python:3.9-slim AS backend
WORKDIR /app
COPY backend/ .
COPY --from=frontend /app/build ./build
RUN pip install -r requirements.txt

EXPOSE 5001
CMD ["python", "app.py"]
