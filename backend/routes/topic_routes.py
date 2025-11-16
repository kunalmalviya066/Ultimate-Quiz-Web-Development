from flask import Blueprint, request, jsonify
from database import get_connection

topic_bp = Blueprint("topics", __name__)


# ===============================================
# GET TOPICS BASED ON SUBJECT IDs
# URL Example:
# /api/topics?subjects=1,2,3
# ===============================================
@topic_bp.route("/topics", methods=["GET"])
def get_topics():
    subject_ids = request.args.get("subjects")

    if not subject_ids:
        return jsonify({"error": "No subjects provided"}), 400

    subject_list = subject_ids.split(",")

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        placeholders = ",".join(["%s"] * len(subject_list))
        query = f"""
            SELECT id, name, subject_id 
            FROM topics
            WHERE subject_id IN ({placeholders})
            ORDER BY name ASC
        """

        cursor.execute(query, subject_list)
        topics = cursor.fetchall()

        return jsonify(topics)

    except Exception as e:
        print("❌ Error fetching topics:", e)
        return jsonify({"error": "Database error"}), 500

    finally:
        cursor.close()
        conn.close()
