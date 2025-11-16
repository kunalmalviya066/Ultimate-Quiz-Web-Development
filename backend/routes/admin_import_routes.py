from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from database import get_connection
import csv
import io

admin_import_bp = Blueprint("admin_import", __name__)


@admin_import_bp.route("/admin/import_questions", methods=["POST"])
def import_questions():
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"}), 400

    file = request.files["file"]

    if not file.filename.endswith(".csv"):
        return jsonify({"success": False, "error": "Only CSV files allowed"}), 400

    stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
    csv_input = csv.reader(stream)

    next(csv_input)  # Skip header row

    conn = get_connection()
    cursor = conn.cursor()

    imported_count = 0

    try:
        for row in csv_input:
            if len(row) < 8:
                continue  # skip invalid rows

            topic_id, question, optA, optB, optC, optD, answer, explanation = row

            cursor.execute("""
                INSERT INTO questions (topic_id, question, option_a, option_b, option_c, option_d, answer, explanation)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                topic_id,
                question,
                optA, optB, optC, optD,
                answer,
                explanation
            ))

            imported_count += 1

        conn.commit()

        return jsonify({"success": True, "imported": imported_count})

    except Exception as e:
        print("CSV Import Error:", e)
        return jsonify({"success": False, "error": "Database error"})

    finally:
        cursor.close()
        conn.close()
