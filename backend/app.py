from flask import Flask, send_from_directory
from flask_cors import CORS

# Import admin routes
from routes.admin_routes import admin_bp
from routes.admin_question_routes import admin_question_bp
from routes.admin_topic_routes import admin_topic_bp
from routes.admin_subject_routes import admin_subject_bp
from routes.admin_import_routes import admin_import_bp
from routes.admin_image_routes import admin_image_bp

# Import user routes
from routes.subject_routes import subject_bp
from routes.topic_routes import topic_bp
from routes.question_routes import question_bp
from routes.result_routes import result_bp


app = Flask(__name__)
CORS(app)

# Uploads folder configuration
app.config["UPLOAD_FOLDER"] = "uploads"


# ============================
# Register All API Route Groups
# ============================
# User APIs
app.register_blueprint(subject_bp, url_prefix="/api")
app.register_blueprint(topic_bp, url_prefix="/api")
app.register_blueprint(question_bp, url_prefix="/api")
app.register_blueprint(result_bp, url_prefix="/api")

# Admin APIs
app.register_blueprint(admin_subject_bp, url_prefix="/api")
app.register_blueprint(admin_topic_bp, url_prefix="/api")
app.register_blueprint(admin_question_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api")
app.register_blueprint(admin_import_bp, url_prefix="/api")
app.register_blueprint(admin_image_bp, url_prefix="/api")


@app.route("/")
def home():
    return {"message": "Quiz Backend API Running!"}


# ============================
# Serve uploaded images
# ============================
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# ============================
# Local development (NOT used by Render)
# ============================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
