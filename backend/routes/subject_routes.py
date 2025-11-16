from flask import Blueprint, jsonify
from database import get_connection

subject_bp = Blueprint("subjects", __name__)


# ===========================================
# GET ALL SUBJECTS
# ===========================================
@subject_bp.route("/subjects", methods=["GET"])
def get_subjects():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT id, name FROM subjects ORDER BY name ASC")
        subjects = cursor.fetchall()

        return jsonify(subjects)

    except Exception as e:
        print("❌ Error fetching subjects:", e)
        return jsonify({"error": "Database error"}), 500

    finally:
        cursor.close()
        conn.close()
