from flask import Blueprint, request, jsonify
from database import get_connection
import random

question_bp = Blueprint("questions", __name__)


# =====================================================
# GET QUESTIONS BY TOPIC IDs + LIMIT
# Example:
# /api/questions?topics=3,7&limit=20
# =====================================================
@question_bp.route("/questions", methods=["GET"])
def get_questions():
    topic_ids = request.args.get("topics")
    limit = request.args.get("limit", default=10, type=int)

    if not topic_ids:
        return jsonify({"error": "No topics specified"}), 400

    topic_list = topic_ids.split(",")

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        placeholders = ",".join(["%s"] * len(topic_list))

        query = f"""
            SELECT 
                id, question, option_a, option_b, option_c, option_d, answer, explanation
            FROM questions
            WHERE topic_id IN ({placeholders})
            ORDER BY RAND()
            LIMIT %s
        """

        cursor.execute(query, (*topic_list, limit))
        rows = cursor.fetchall()

        # Transform rows into frontend-friendly format
        questions = []
        for q in rows:
            questions.append({
                "id": q["id"],
                "question": q["question"],
                "options": [
                    q["option_a"],
                    q["option_b"],
                    q["option_c"],
                    q["option_d"]
                ],
                "correctAnswer": q["answer"],  # not sent to frontend here
                "explanation": q["explanation"]
            })

        return jsonify(questions)

    except Exception as e:
        print("❌ Error fetching questions:", e)
        return jsonify({"error": "Database error"}), 500

    finally:
        cursor.close()
        conn.close()
