import json
import os
from typing import Dict, Any
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
    Business: Manage feedback messages from contact form
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            if not user or user['role'] != 'admin':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Доступ запрещен'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT * FROM feedback ORDER BY created_at DESC")
            feedback = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'feedback': [dict(f) for f in feedback]}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            name = body.get('name')
            phone = body.get('phone')
            message = body.get('message')
            
            cur.execute(
                """INSERT INTO feedback (name, phone, message)
                   VALUES (%s, %s, %s) RETURNING id""",
                (name, phone, message)
            )
            feedback = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'feedback_id': feedback['id']}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            if not user or user['role'] != 'admin':
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Доступ запрещен'}),
                    'isBase64Encoded': False
                }
            
            body = json.loads(event.get('body', '{}'))
            feedback_id = body.get('id')
            is_read = body.get('is_read')
            
            cur.execute("UPDATE feedback SET is_read = %s WHERE id = %s", (is_read, feedback_id))
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
