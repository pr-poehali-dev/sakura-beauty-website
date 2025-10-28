import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_session_token() -> str:
    return secrets.token_urlsafe(32)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User authentication and session management
    Args: event - dict with httpMethod, body, headers
          context - object with request_id attribute
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action')
            
            if action == 'register':
                email = body.get('email')
                password = body.get('password')
                full_name = body.get('full_name')
                phone = body.get('phone', '')
                
                cur.execute("SELECT id FROM users WHERE email = %s", (email,))
                if cur.fetchone():
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Пользователь с таким email уже существует'}),
                        'isBase64Encoded': False
                    }
                
                password_hash = hash_password(password)
                cur.execute(
                    "INSERT INTO users (email, password_hash, full_name, phone) VALUES (%s, %s, %s, %s) RETURNING id",
                    (email, password_hash, full_name, phone)
                )
                user = cur.fetchone()
                conn.commit()
                
                session_token = generate_session_token()
                expires_at = datetime.now() + timedelta(days=30)
                cur.execute(
                    "INSERT INTO sessions (user_id, session_token, expires_at) VALUES (%s, %s, %s)",
                    (user['id'], session_token, expires_at)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'session_token': session_token,
                        'user_id': user['id']
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'login':
                email = body.get('email')
                password = body.get('password')
                password_hash = hash_password(password)
                
                cur.execute(
                    "SELECT id, full_name, role FROM users WHERE email = %s AND password_hash = %s",
                    (email, password_hash)
                )
                user = cur.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Неверный email или пароль'}),
                        'isBase64Encoded': False
                    }
                
                session_token = generate_session_token()
                expires_at = datetime.now() + timedelta(days=30)
                cur.execute(
                    "INSERT INTO sessions (user_id, session_token, expires_at) VALUES (%s, %s, %s)",
                    (user['id'], session_token, expires_at)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'session_token': session_token,
                        'user': {
                            'id': user['id'],
                            'full_name': user['full_name'],
                            'role': user['role']
                        }
                    }),
                    'isBase64Encoded': False
                }
            
            elif action == 'logout':
                session_token = event.get('headers', {}).get('x-session-token') or event.get('headers', {}).get('X-Session-Token')
                if session_token:
                    cur.execute("UPDATE sessions SET expires_at = NOW() WHERE session_token = %s", (session_token,))
                    conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
        
        elif method == 'GET':
            session_token = event.get('headers', {}).get('x-session-token') or event.get('headers', {}).get('X-Session-Token')
            
            if not session_token:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Не авторизован'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """SELECT u.id, u.email, u.full_name, u.phone, u.role 
                   FROM users u 
                   JOIN sessions s ON u.id = s.user_id 
                   WHERE s.session_token = %s AND s.expires_at > NOW()""",
                (session_token,)
            )
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Сессия истекла'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'user': dict(user)}),
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
