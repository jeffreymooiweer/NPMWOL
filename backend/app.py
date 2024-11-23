from flask import Flask, send_from_directory
from models import init_db
from routes import init_routes

app = Flask(__name__, static_folder="build", static_url_path="")

# Configureer de database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///devices.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialiseer de database
with app.app_context():
    init_db(app)

# Initialiseer de routes
init_routes(app)

# Serve frontend
@app.route("/")
def serve_frontend():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
