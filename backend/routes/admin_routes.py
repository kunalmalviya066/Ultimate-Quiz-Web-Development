from flask import Blueprint, request, jsonify

admin_bp = Blueprint("admin_main", __name__)

# HARD-CODED ADMIN CREDENTIALS (you can move to DB later)
ADMIN_USER = "kunalmalviya06"
ADMIN_PASS = "12345"


# ================================
# ADMIN LOGIN (Backend)
# ================================
@admin_bp.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if username == ADMIN_USER and password == ADMIN_PASS:
        return jsonify({"success": True, "message": "Login successful"})
    else:
        return jsonify({"success": False, "message": "Invalid login"}), 401


# ================================
# CHECK LOGIN (for protected pages)
# ================================
@admin_bp.route("/admin/check_login", methods=["GET"])
def check_login():
    return jsonify({"admin": True})
