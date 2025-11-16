from flask import Blueprint, request, jsonify
from database import get_connection

admin_subject_bp = Blueprint("admin_subjects", __name__)


# ==========================
# GET ALL SUBJECTS
# ==========================
@admin_subject_bp.route("/admin/subjects", methods=["GET"])
def get_all_subjects():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM subjects ORDER BY id DESC")
    rows = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(rows)


# ==========================
# ADD SUBJECT
# ==========================
@admin_subject_bp.route("/admin/subjects", methods=["POST"])
def add_subject():
    name = request.json.get("name")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO subjects (name) VALUES (%s)", (name,))
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message": "Subject added"})


# ==========================
# UPDATE SUBJECT
# ==========================
@admin_subject_bp.route("/admin/subjects/<int:id>", methods=["PUT"])
def update_subject(id):
    name = request.json.get("name")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("UPDATE subjects SET name = %s WHERE id = %s", (name, id))
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message": "Subject updated"})


# ==========================
# DELETE SUBJECT
# ==========================
@admin_subject_bp.route("/admin/subjects/<int:id>", methods=["DELETE"])
def delete_subject(id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM subjects WHERE id = %s", (id,))
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message": "Subject deleted"})
