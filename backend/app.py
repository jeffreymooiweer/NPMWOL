from flask import Flask
from models import init_db
from routes import init_routes

app = Flask(__name__)

# Configureer de database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///devices.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialiseer de database
with app.app_context():
    init_db(app)

# Initialiseer de routes
init_routes(app)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
