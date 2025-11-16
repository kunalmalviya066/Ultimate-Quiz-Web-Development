from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER = "uploads"
ALLOWED_EXT = {"jpg", "jpeg", "png", "gif"}

admin_image_bp = Blueprint("admin_images", __name__)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXT


@admin_image_bp.route("/admin/upload_image", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    if allowed_file(file.filename):
        filename = secure_filename(file.filename)
        path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(path)

        full_url = f"/uploads/{filename}"

        return jsonify({"success": True, "url": full_url})

    return jsonify({"error": "Invalid file type"}), 400
