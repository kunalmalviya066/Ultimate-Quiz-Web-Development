from flask import Blueprint, request, jsonify
from database import get_connection
import time

result_bp = Blueprint("results", __name__)


# ================================================================
# SAVE QUIZ SUBMISSION
# ================================================================
@result_bp.route("/submit_quiz", methods=["POST"])
def submit_quiz():
    data = request.json

    quizSettings = data.get("quizSettings", {})
    answers = data.get("answers", {})
    reviewMarks = data.get("reviewMarks", {})
    questionIds = data.get("questionIds", [])

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Retrieve correct answers for scoring
        placeholders = ",".join(["%s"] * len(questionIds))
        cursor.execute(
            f"SELECT id, topic_id, answer FROM questions WHERE id IN ({placeholders})",
            questionIds
        )
        rows = cursor.fetchall()

        correct = 0
        incorrect = 0
        topic_stats = {}

        # Score calculation
        for row in rows:
            qid = row["id"]
            correct_ans = row["answer"]
            user_ans = answers.get(str(qid))  # answers stored by index, will adjust below

            # Map index-based answers to question ID
            # Because frontend sends: { index: answer }
            for idx, q in enumerate(questionIds):
                if q == qid:
                    user_ans = answers.get(str(idx))

            if user_ans is None:
                incorrect += 1
            elif user_ans == correct_ans:
                correct += 1
                topic_stats[row["topic_id"]] = topic_stats.get(row["topic_id"], 0) + 1
            else:
                incorrect += 1

        # Save result summary
        cursor.execute("""
            INSERT INTO results (total, correct, incorrect, accuracy, time_taken)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            len(questionIds),
            correct,
            incorrect,
            round((correct / len(questionIds)) * 100, 2),
            quizSettings.get("timerValue", 0)
        ))
        result_id = cursor.lastrowid

        # Save each question attempt
        for i, qid in enumerate(questionIds):
            cursor.execute("""
                INSERT INTO result_details (result_id, question_id, user_answer, marked_review)
                VALUES (%s, %s, %s, %s)
            """, (
                result_id,
                qid,
                answers.get(str(i)),
                reviewMarks.get(str(i), False)
            ))

        conn.commit()

        return jsonify({"message": "Result saved", "resultId": result_id})

    except Exception as e:
        print("❌ Error submitting quiz:", e)
        return jsonify({"error": "Database error"}), 500

    finally:
        cursor.close()
        conn.close()



# ================================================================
# GET RESULT + ANALYSIS + REVIEW
# ================================================================
@result_bp.route("/get_result/<int:result_id>", methods=["GET"])
def get_result(result_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # --------------------------
        # Get summary
        # --------------------------
        cursor.execute("SELECT * FROM results WHERE id = %s", (result_id,))
        summary = cursor.fetchone()

        # --------------------------
        # Get detailed attempts
        # --------------------------
        cursor.execute("""
            SELECT 
                rd.user_answer,
                rd.marked_review,
                q.id AS question_id,
                q.question,
                q.option_a, q.option_b, q.option_c, q.option_d,
                q.answer AS correct_answer,
                q.explanation,
                t.name AS topic_name
            FROM result_details rd
            JOIN questions q ON rd.question_id = q.id
            JOIN topics t ON q.topic_id = t.id
            WHERE rd.result_id = %s
        """, (result_id,))
        details = cursor.fetchall()

        # Format for frontend
        review_list = []
        topic_map = {}

        for d in details:
            review_list.append({
                "question": d["question"],
                "options": [
                    d["option_a"], d["option_b"], d["option_c"], d["option_d"]
                ],
                "correctAnswer": d["correct_answer"],
                "userAnswer": d["user_answer"],
                "explanation": d["explanation"],
                "topic": d["topic_name"]
            })

            # topic-wise analytics
            topic_map.setdefault(d["topic_name"], {"correct": 0, "total": 0})
            topic_map[d["topic_name"]]["total"] += 1
            if d["user_answer"] == d["correct_answer"]:
                topic_map[d["topic_name"]]["correct"] += 1

        # convert map to list
        topic_analysis = [
            {
                "topic": k,
                "correct": v["correct"],
                "total": v["total"]
            } for k, v in topic_map.items()
        ]

        response = {
            "total": summary["total"],
            "correct": summary["correct"],
            "incorrect": summary["incorrect"],
            "accuracy": summary["accuracy"],
            "timeTaken": summary["time_taken"],
            "topicAnalysis": topic_analysis,
            "review": review_list
        }

        return jsonify(response)

    except Exception as e:
        print("❌ Error fetching results:", e)
        return jsonify({"error": "Database error"}), 500

    finally:
        cursor.close()
        conn.close()
