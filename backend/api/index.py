import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, date

def get_db_connection():
    """Создает подключение к базе данных"""
    return psycopg2.connect(
        os.environ['DATABASE_URL'],
        cursor_factory=RealDictCursor,
        options=f"-c search_path={os.environ['MAIN_DB_SCHEMA']}"
    )

def handler(event: dict, context) -> dict:
    """
    API для работы с данными салона красоты
    Поддерживает операции с услугами, записями, отзывами, пользователями
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Authorization'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    path = event.get('queryStringParameters', {}).get('path', '')
    
    try:
        conn = get_db_connection()
        
        if path == 'services':
            result = handle_services(conn, method, event)
        elif path == 'bookings':
            result = handle_bookings(conn, method, event)
        elif path == 'reviews':
            result = handle_reviews(conn, method, event)
        elif path == 'users':
            result = handle_users(conn, method, event)
        elif path == 'schedule':
            result = handle_schedule(conn, method, event)
        else:
            result = {'error': 'Invalid path'}
            
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, default=str),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

def handle_services(conn, method: str, event: dict) -> dict:
    """Управление услугами"""
    cursor = conn.cursor()
    
    if method == 'GET':
        action = event.get('queryStringParameters', {}).get('action', 'list')
        
        if action == 'list':
            cursor.execute('SELECT * FROM services WHERE is_active = TRUE ORDER BY category, name')
            services = cursor.fetchall()
            return {'services': services}
        elif action == 'categories':
            cursor.execute('SELECT DISTINCT category FROM services WHERE is_active = TRUE ORDER BY category')
            categories = [row['category'] for row in cursor.fetchall()]
            return {'categories': categories}
    
    elif method == 'POST':
        data = json.loads(event.get('body', '{}'))
        cursor.execute('''
            INSERT INTO services (name, description, duration, price, category)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        ''', (data['name'], data.get('description'), data['duration'], data['price'], data.get('category')))
        conn.commit()
        return {'id': cursor.fetchone()['id'], 'status': 'created'}
    
    elif method == 'PUT':
        data = json.loads(event.get('body', '{}'))
        cursor.execute('''
            UPDATE services 
            SET name=%s, description=%s, duration=%s, price=%s, category=%s, is_active=%s, updated_at=CURRENT_TIMESTAMP
            WHERE id=%s
        ''', (data['name'], data.get('description'), data['duration'], data['price'], 
              data.get('category'), data.get('is_active', True), data['id']))
        conn.commit()
        return {'status': 'updated'}
    
    elif method == 'DELETE':
        service_id = event.get('queryStringParameters', {}).get('id')
        if not service_id:
            return {'error': 'Service ID required'}
        cursor.execute('DELETE FROM services WHERE id = %s', (service_id,))
        conn.commit()
        return {'status': 'deleted'}
    
    return {'error': 'Method not allowed'}

def handle_bookings(conn, method: str, event: dict) -> dict:
    """Управление записями"""
    cursor = conn.cursor()
    
    if method == 'GET':
        user_id = event.get('queryStringParameters', {}).get('user_id')
        employee_id = event.get('queryStringParameters', {}).get('employee_id')
        status = event.get('queryStringParameters', {}).get('status')
        
        query = '''
            SELECT b.*, s.name as service_name, s.price,
                   u1.full_name as client_name, u1.phone as client_phone,
                   u2.full_name as employee_name
            FROM bookings b
            LEFT JOIN services s ON b.service_id = s.id
            LEFT JOIN users u1 ON b.user_id = u1.id
            LEFT JOIN users u2 ON b.employee_id = u2.id
            WHERE 1=1
        '''
        params = []
        
        if user_id:
            query += ' AND b.user_id = %s'
            params.append(user_id)
        if employee_id:
            query += ' AND b.employee_id = %s'
            params.append(employee_id)
        if status:
            query += ' AND b.status = %s'
            params.append(status)
            
        query += ' ORDER BY b.booking_date DESC, b.start_time DESC'
        
        cursor.execute(query, params)
        bookings = cursor.fetchall()
        return {'bookings': bookings}
    
    elif method == 'POST':
        data = json.loads(event.get('body', '{}'))
        cursor.execute('''
            INSERT INTO bookings 
            (user_id, employee_id, service_id, booking_date, start_time, end_time, notes, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        ''', (data['user_id'], data['employee_id'], data['service_id'], 
              data['booking_date'], data['start_time'], data['end_time'], 
              data.get('notes'), data.get('status', 'pending')))
        conn.commit()
        return {'id': cursor.fetchone()['id'], 'status': 'created'}
    
    elif method == 'PUT':
        data = json.loads(event.get('body', '{}'))
        cursor.execute('''
            UPDATE bookings 
            SET status=%s, booking_date=%s, start_time=%s, end_time=%s, notes=%s, updated_at=CURRENT_TIMESTAMP
            WHERE id=%s
        ''', (data.get('status'), data.get('booking_date'), data.get('start_time'), 
              data.get('end_time'), data.get('notes'), data['id']))
        conn.commit()
        return {'status': 'updated'}
    
    return {'error': 'Method not allowed'}

def handle_reviews(conn, method: str, event: dict) -> dict:
    """Управление отзывами"""
    cursor = conn.cursor()
    
    if method == 'GET':
        status_param = event.get('queryStringParameters', {}).get('status', 'approved')
        
        cursor.execute('''
            SELECT r.*, u.full_name as client_name
            FROM reviews r
            LEFT JOIN users u ON r.client_id = u.id
            WHERE r.status = %s
            ORDER BY r.created_at DESC
        ''', (status_param,))
        reviews = cursor.fetchall()
        return {'reviews': reviews}
    
    elif method == 'POST':
        data = json.loads(event.get('body', '{}'))
        cursor.execute('''
            INSERT INTO reviews (client_id, booking_id, rating, comment, status)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        ''', (data['client_id'], data.get('booking_id'), data['rating'], 
              data['comment'], data.get('status', 'pending')))
        conn.commit()
        return {'id': cursor.fetchone()['id'], 'status': 'created'}
    
    elif method == 'PUT':
        data = json.loads(event.get('body', '{}'))
        cursor.execute('''
            UPDATE reviews 
            SET status=%s, updated_at=CURRENT_TIMESTAMP
            WHERE id=%s
        ''', (data['status'], data['id']))
        conn.commit()
        return {'status': 'updated'}
    
    return {'error': 'Method not allowed'}

def handle_users(conn, method: str, event: dict) -> dict:
    """Управление пользователями"""
    cursor = conn.cursor()
    
    if method == 'GET':
        role = event.get('queryStringParameters', {}).get('role')
        user_id = event.get('queryStringParameters', {}).get('id')
        
        if user_id:
            cursor.execute('SELECT id, email, full_name, phone, role, created_at FROM users WHERE id = %s', (user_id,))
            user = cursor.fetchone()
            return {'user': user}
        elif role:
            cursor.execute('SELECT id, email, full_name, phone, role, created_at FROM users WHERE role = %s', (role,))
            users = cursor.fetchall()
            return {'users': users}
        else:
            cursor.execute('SELECT id, email, full_name, phone, role, created_at FROM users')
            users = cursor.fetchall()
            return {'users': users}
    
    elif method == 'POST':
        data = json.loads(event.get('body', '{}'))
        import hashlib
        import secrets
        temp_password = secrets.token_urlsafe(12)
        password_hash = hashlib.sha256(temp_password.encode()).hexdigest()
        
        cursor.execute('''
            INSERT INTO users (email, password_hash, full_name, phone, role)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, email, full_name, phone, role, created_at
        ''', (data['email'], password_hash, data['full_name'], data.get('phone'), data.get('role', 'client')))
        conn.commit()
        user = cursor.fetchone()
        return {'user': user, 'temporary_password': temp_password}
    
    elif method == 'PUT':
        data = json.loads(event.get('body', '{}'))
        user_id = data.get('id')
        
        if not user_id:
            return {'error': 'User ID required'}
        
        fields = []
        params = []
        
        if 'full_name' in data:
            fields.append('full_name = %s')
            params.append(data['full_name'])
        if 'phone' in data:
            fields.append('phone = %s')
            params.append(data['phone'])
        if 'email' in data:
            fields.append('email = %s')
            params.append(data['email'])
        if 'role' in data:
            fields.append('role = %s')
            params.append(data['role'])
        
        if not fields:
            return {'error': 'No data to update'}
        
        fields.append('updated_at = CURRENT_TIMESTAMP')
        params.append(user_id)
        
        query = f"UPDATE users SET {', '.join(fields)} WHERE id = %s RETURNING id, email, full_name, phone, role"
        cursor.execute(query, params)
        conn.commit()
        user = cursor.fetchone()
        return {'user': user}
    
    elif method == 'DELETE':
        user_id = event.get('queryStringParameters', {}).get('id')
        if not user_id:
            return {'error': 'User ID required'}
        cursor.execute('DELETE FROM users WHERE id = %s', (user_id,))
        conn.commit()
        return {'status': 'deleted'}
    
    elif method == 'PUT':
        data = json.loads(event.get('body', '{}'))
        cursor.execute('''
            UPDATE users 
            SET full_name=%s, phone=%s, role=%s, updated_at=CURRENT_TIMESTAMP
            WHERE id=%s
        ''', (data['full_name'], data.get('phone'), data.get('role'), data['id']))
        conn.commit()
        return {'status': 'updated'}
    
    return {'error': 'Method not allowed'}

def handle_schedule(conn, method: str, event: dict) -> dict:
    """Управление расписанием сотрудников"""
    cursor = conn.cursor()
    
    if method == 'GET':
        employee_id = event.get('queryStringParameters', {}).get('employee_id')
        
        if employee_id:
            cursor.execute('''
                SELECT * FROM employee_schedule 
                WHERE employee_id = %s AND is_active = TRUE
                ORDER BY day_of_week
            ''', (employee_id,))
        else:
            cursor.execute('''
                SELECT es.*, u.full_name as employee_name
                FROM employee_schedule es
                LEFT JOIN users u ON es.employee_id = u.id
                WHERE es.is_active = TRUE
                ORDER BY es.employee_id, es.day_of_week
            ''')
        
        schedule = cursor.fetchall()
        return {'schedule': schedule}
    
    elif method == 'POST':
        data = json.loads(event.get('body', '{}'))
        cursor.execute('''
            INSERT INTO employee_schedule (employee_id, day_of_week, start_time, end_time)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (employee_id, day_of_week) 
            DO UPDATE SET start_time=%s, end_time=%s, is_active=TRUE
            RETURNING id
        ''', (data['employee_id'], data['day_of_week'], data['start_time'], 
              data['end_time'], data['start_time'], data['end_time']))
        conn.commit()
        return {'id': cursor.fetchone()['id'], 'status': 'created'}
    
    return {'error': 'Method not allowed'}