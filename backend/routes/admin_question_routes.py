from flask import Blueprint, request, jsonify
from database import get_connection

admin_question_bp = Blueprint("admin_questions", __name__)


# ===========================================
# GET QUESTIONS BY TOPIC
# ===========================================
@admin_question_bp.route("/admin/questions/<int:topic_id>", methods=["GET"])
def get_questions(topic_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT id, question FROM questions WHERE topic_id = %s ORDER BY id DESC", (topic_id,))
    rows = cursor.fetchall()

    cursor.close()
    conn.close()
    return jsonify(rows)


# ===========================================
# ADD QUESTION
# ===========================================
@admin_question_bp.route("/admin/questions", methods=["POST"])
def add_question():
    data = request.json

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO questions (
        topic_id, question, option_a, option_b, option_c, option_d, answer, explanation, image_url
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
""", (
    data["topic_id"],
    data["question"],
    data["option_a"],
    data["option_b"],
    data["option_c"],
    data["option_d"],
    data["answer"],
    data["explanation"],
    data.get("image_url")
))


    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Question added"})


# ===========================================
# DELETE QUESTION
# ===========================================
@admin_question_bp.route("/admin/questions/<int:id>", methods=["DELETE"])
def delete_question(id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM questions WHERE id = %s", (id,))
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({"message": "Question deleted"})
# ===========================================
# GET specific question for editing
# ===========================================
@admin_question_bp.route("/admin/questions/edit/<int:id>", methods=["GET"])
def get_question_for_edit(id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, question, option_a, option_b, option_c, option_d, answer, explanation 
        FROM questions WHERE id = %s
    """, (id,))
    q = cursor.fetchone()

    cursor.close()
    conn.close()
    return jsonify(q)


# ===========================================
# UPDATE question
# ===========================================
@admin_question_bp.route("/admin/questions/edit/<int:id>", methods=["PUT"])
def update_question(id):
    data = request.json

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE questions 
    SET question=%s, option_a=%s, option_b=%s, option_c=%s, option_d=%s,
        answer=%s, explanation=%s,
        image_url=%s
    WHERE id=%s
""", (
    data["question"],
    data["option_a"],
    data["option_b"],
    data["option_c"],
    data["option_d"],
    data["answer"],
    data["explanation"],
    data.get("image_url"),    # NEW
    id
))


    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Question updated"})
