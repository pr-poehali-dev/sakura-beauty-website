import json
import os
from typing import Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def get_user_from_session(session_token: str, cur) -> Dict[str, Any]:
    cur.execute(
        """SELECT u.id, u.role 
           FROM users u 
           JOIN sessions s ON u.id = s.user_id 
           WHERE s.session_token = %s AND s.expires_at > NOW()""",
        (session_token,)
    )
    return cur.fetchone()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage client bookings - create, view, update, delete
    Args: event - dict with httpMethod, body, headers, queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        session_token = event.get('headers', {}).get('x-session-token') or event.get('headers', {}).get('X-Session-Token')
        user = None
        if session_token:
            user = get_user_from_session(session_token, cur)
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            booking_id = params.get('id')
            
            if booking_id:
                cur.execute("SELECT * FROM bookings WHERE id = %s", (booking_id,))
                booking = cur.fetchone()
                if not booking:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Запись не найдена'}),
                        'isBase64Encoded': False
                    }
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'booking': dict(booking)}, default=str),
                    'isBase64Encoded': False
                }
            
            if user:
                if user['role'] == 'admin':
                    cur.execute("SELECT * FROM bookings ORDER BY booking_date DESC, booking_time DESC")
                else:
                    cur.execute("SELECT * FROM bookings WHERE user_id = %s ORDER BY booking_date DESC, booking_time DESC", (user['id'],))
            else:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Требуется авторизация'}),
                    'isBase64Encoded': False
                }
            
            bookings = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'bookings': [dict(b) for b in bookings]}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            client_name = body.get('client_name')
            phone = body.get('phone')
            service = body.get('service')
            master = body.get('master')
            booking_date = body.get('booking_date')
            booking_time = body.get('booking_time')
            
            user_id = user['id'] if user else None
            
            cur.execute(
                """INSERT INTO bookings (client_name, phone, service, master, booking_date, booking_time, user_id)
                   VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                (client_name, phone, service, master, booking_date, booking_time, user_id)
            )
            booking = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'booking_id': booking['id']}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Требуется авторизация'}),
                    'isBase64Encoded': False
                }
            
            body = json.loads(event.get('body', '{}'))
            booking_id = body.get('id')
            status = body.get('status')
            
            if user['role'] != 'admin':
                cur.execute("SELECT user_id FROM bookings WHERE id = %s", (booking_id,))
                booking = cur.fetchone()
                if not booking or booking['user_id'] != user['id']:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Доступ запрещен'}),
                        'isBase64Encoded': False
                    }
            
            cur.execute("UPDATE bookings SET status = %s WHERE id = %s", (status, booking_id))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            if not user or user['role'] != 'admin':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Доступ запрещен'}),
                    'isBase64Encoded': False
                }
            
            params = event.get('queryStringParameters') or {}
            booking_id = params.get('id')
            
            cur.execute("UPDATE bookings SET status = %s WHERE id = %s", ('cancelled', booking_id))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
    
    finally:
        cur.close()
        conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Метод не поддерживается'}),
        'isBase64Encoded': False
    }
