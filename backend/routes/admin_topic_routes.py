from flask import Blueprint, request, jsonify
from database import get_connection

admin_topic_bp = Blueprint("admin_topics", __name__)


# ==============================
# GET TOPICS BY SUBJECT ID
# ==============================
@admin_topic_bp.route("/admin/topics/<int:subject_id>", methods=["GET"])
def get_topics(subject_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM topics WHERE subject_id = %s ORDER BY id DESC", (subject_id,))
    rows = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(rows)


# ==============================
# ADD TOPIC
# ==============================
@admin_topic_bp.route("/admin/topics", methods=["POST"])
def add_topic():
    name = request.json.get("name")
    subject_id = request.json.get("subject_id")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO topics (name, subject_id) VALUES (%s, %s)",
        (name, subject_id)
    )
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message": "Topic added"})


# ==============================
# UPDATE TOPIC
# ==============================
@admin_topic_bp.route("/admin/topics/<int:id>", methods=["PUT"])
def update_topic(id):
    new_name = request.json.get("name")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE topics SET name = %s WHERE id = %s",
        (new_name, id)
    )
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message": "Topic updated"})


# ==============================
# DELETE TOPIC
# ==============================
@admin_topic_bp.route("/admin/topics/<int:id>", methods=["DELETE"])
def delete_topic(id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM topics WHERE id = %s", (id,))
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message": "Topic deleted"})
