from flask import Flask
from flask_cors import CORS
from flask import send_from_directory

# Import route blueprints

from routes.admin_routes import admin_bp
from routes.admin_question_routes import admin_question_bp
from routes.admin_topic_routes import admin_topic_bp
from routes.admin_subject_routes import admin_subject_bp
from routes.admin_import_routes import admin_import_bp
from routes.admin_image_routes import admin_image_bp

from routes.subject_routes import subject_bp
from routes.topic_routes import topic_bp
from routes.question_routes import question_bp
from routes.result_routes import result_bp

app = Flask(__name__)
CORS(app)  # allow frontend JS to call backend


# ============================
# Register All API Route Groups
# ============================
app.register_blueprint(subject_bp, url_prefix="/api")
app.register_blueprint(topic_bp, url_prefix="/api")
app.register_blueprint(question_bp, url_prefix="/api")
app.register_blueprint(result_bp, url_prefix="/api")

# Admin Panels
app.register_blueprint(admin_subject_bp, url_prefix="/api")
app.register_blueprint(admin_topic_bp, url_prefix="/api")
app.register_blueprint(admin_question_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api")
app.register_blueprint(admin_import_bp, url_prefix="/api")
app.register_blueprint(admin_image_bp, url_prefix="/api")


@app.route("/")
def home():
    return {"message": "Quiz Backend API Running!"}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)
