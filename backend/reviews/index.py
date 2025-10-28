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
    Business: Manage reviews - create, view, approve, delete
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
            if user and user['role'] == 'admin':
                cur.execute("SELECT * FROM reviews ORDER BY created_at DESC")
            else:
                cur.execute("SELECT * FROM reviews WHERE approved = true ORDER BY created_at DESC")
            
            reviews = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'reviews': [dict(r) for r in reviews]}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            if not user:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Требуется авторизация'}),
                    'isBase64Encoded': False
                }
            
            body = json.loads(event.get('body', '{}'))
            author = body.get('author')
            rating = body.get('rating')
            comment = body.get('comment')
            
            cur.execute(
                """INSERT INTO reviews (author, rating, comment, user_id)
                   VALUES (%s, %s, %s, %s) RETURNING id""",
                (author, rating, comment, user['id'])
            )
            review = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'review_id': review['id']}),
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
            review_id = body.get('id')
            approved = body.get('approved')
            
            cur.execute("UPDATE reviews SET approved = %s WHERE id = %s", (approved, review_id))
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
            review_id = params.get('id')
            
            cur.execute("UPDATE reviews SET approved = false WHERE id = %s", (review_id,))
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
