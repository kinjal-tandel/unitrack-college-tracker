from flask import Flask, render_template, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import setup_db
app = Flask(__name__)
app.secret_key = 'change-this-to-something-random'
@app.route('/')
def home():
    return render_template('index.html')
@app.route('/api/assignments', methods=['GET'])
def get_assignments():
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, due, status FROM assignments WHERE user_id = ?', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    assignments = []
    for row in rows:
        assignments.append({
            'id': row[0],
            'name': row[1],
            'due': row[2],
            'status': row[3]
        })
    return jsonify(assignments)
@app.route('/api/assignments', methods=['POST'])
def add_assignments():
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    data = request.get_json()
    name = data.get('name')
    due = data.get('due')
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO assignments (user_id, name, due) VALUES (?, ?, ?)', (user_id, name, due))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Assignment added successfully'})
@app.route('/api/assignments/<int:id>', methods=['DELETE'])
def delete_assignments(id):
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM assignments WHERE id = ? AND user_id = ?', (id, user_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deleted Successfully!'})
@app.route('/api/assignments/<int:id>', methods=['PUT'])
def update_assignment_status(id):
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    data = request.get_json()
    new_status = data.get('status')
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('UPDATE assignments SET status = ? WHERE id = ? AND user_id = ?', (new_status, id, user_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Status Uploaded'})
@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, amount FROM expenses WHERE user_id = ?', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    expenses = []
    for row in rows:
        expenses.append({'id': row[0], 'name': row[1], 'amount': row[2]})
    return jsonify(expenses)
@app.route('/api/expenses', methods=['POST'])
def add_expense():
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    data = request.get_json()
    name = data.get('name')
    amount = data.get('amount')
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO expenses (user_id, name, amount) VALUES (?, ?, ?)', (user_id, name, amount))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Expense added'})
@app.route('/api/expenses/<int:id>', methods=['DELETE'])
def delete_expense(id):
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM expenses WHERE id = ? AND user_id = ?', (id, user_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deleted'})
@app.route('/api/classes', methods=['GET'])
def get_classes():
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, subject, day, time FROM classes WHERE user_id = ?', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    classes = [{'id': r[0], 'subject': r[1], 'day': r[2], 'time': r[3]} for r in rows]
    return jsonify(classes)
@app.route('/api/classes', methods=['POST'])
def add_class_route():
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    data = request.get_json()
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO classes (user_id, subject, day, time) VALUES (?, ?, ?, ?)',
                   (user_id, data.get('subject'), data.get('day'), data.get('time')))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Class added'})

@app.route('/api/classes/<int:id>', methods=['DELETE'])
def delete_class_route(id):
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM classes WHERE id = ? AND user_id = ?', (id, user_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deleted'})
@app.route('/api/attendance', methods=['GET'])
def get_attendance():
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, subject, held, attended FROM attendance WHERE user_id = ?', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    records = [{'id': r[0], 'subject': r[1], 'held': r[2], 'attended': r[3]} for r in rows]
    return jsonify(records)
@app.route('/api/attendance', methods=['POST'])
def add_attendance_route():
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    data = request.get_json()
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO attendance (user_id, subject, held, attended) VALUES (?, ?, ?, ?)',
                   (user_id, data.get('subject'), data.get('held'), data.get('attended')))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Attendance added'})
@app.route('/api/attendance/<int:id>', methods=['DELETE'])
def delete_attendance_route(id):
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM attendance WHERE id = ? AND user_id = ?', (id, user_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deleted'})
@app.route('/api/subjects', methods=['GET'])
def get_subjects():
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, name, credit, grade FROM subjects WHERE user_id = ?', (user_id,))
    rows = cursor.fetchall()
    conn.close()
    subjects = [{'id': r[0], 'name': r[1], 'credit': r[2], 'grade': r[3]} for r in rows]
    return jsonify(subjects)
@app.route('/api/subjects', methods=['POST'])
def add_subject_route():
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    data = request.get_json()
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO subjects (user_id, name, credit, grade) VALUES (?, ?, ?, ?)',
                   (user_id, data.get('name'), data.get('credit'), data.get('grade')))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Subject added'})
@app.route('/api/subjects/<int:id>', methods=['DELETE'])
def delete_subject_route(id):
    if not session.get('user_id'):
        return jsonify({"error": "Not logged in!"}), 401
    user_id = session['user_id']
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM subjects WHERE id = ? AND user_id = ?', (id, user_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deleted'})
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    hashed = generate_password_hash(password)
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO users(username, password) VALUES (?,?)', (username, hashed))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Username already taken'}), 400
    conn.close()
    return jsonify({'message': 'Signup successfull'})
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, password FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()
    if user and check_password_hash(user[1], password):
        session['user_id'] = user[0]
        session['username'] = username
        return jsonify({'message': 'Login successfull'})
    else:
        return jsonify({'error': 'Invalid username or password'}), 401
@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out'})
if __name__=='__main__':
    app.run(debug=True)
