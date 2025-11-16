import mysql.connector
from mysql.connector import pooling

# ==============================
# MySQL Database Configuration
# ==============================
db_config = {
    "host": "localhost",
    "user": "root",            # change if needed
    "password": "Kunalm#8874",            # add your MySQL password
    "database": "quiz_app",    # your database name
    "port": 3306
}

# ==============================
# Create MySQL Connection Pool
# ==============================
try:
    connection_pool = pooling.MySQLConnectionPool(
        pool_name="quiz_pool",
        pool_size=10,
        pool_reset_session=True,
        **db_config
    )
    print("✅ MySQL Connection Pool Created Successfully")

except Exception as e:
    print("❌ Error Creating MySQL Pool:", e)


# ==============================
# Utility Function to Get Connection
# ==============================
def get_connection():
    try:
        connection = connection_pool.get_connection()
        return connection
    except Exception as e:
        print("❌ Error Getting Connection:", e)
        return None
