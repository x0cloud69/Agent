import psycopg2
from sqlalchemy import create_engine, text
import os

def test_database():
    """데이터베이스 연결 및 테이블 테스트"""
    
    # 환경 변수 설정
    os.environ["DATABASE_URL"] = "postgresql://postgres:1234@localhost:5432/postgres"
    
    try:
        # 1. psycopg2로 직접 연결 테스트
        print("1. PostgreSQL 직접 연결 테스트...")
        conn = psycopg2.connect(
            host="localhost",
            database="postgres",
            user="postgres",
            password="1234",
            port="5432"
        )
        cursor = conn.cursor()
        
        # 테이블 존재 확인
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'auth_user'
        """)
        
        table_exists = cursor.fetchone()
        if table_exists:
            print("✅ auth_user 테이블이 존재합니다!")
            
            # 테이블 구조 확인
            cursor.execute("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'auth_user'
                ORDER BY ordinal_position
            """)
            
            columns = cursor.fetchall()
            print("📋 테이블 구조:")
            for col in columns:
                print(f"  - {col[0]}: {col[1]}")
        else:
            print("❌ auth_user 테이블이 존재하지 않습니다!")
        
        cursor.close()
        conn.close()
        
        # 2. SQLAlchemy 연결 테스트
        print("\n2. SQLAlchemy 연결 테스트...")
        engine = create_engine(os.environ["DATABASE_URL"])
        
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ SQLAlchemy 연결 성공!")
            
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        return False
    
    return True

if __name__ == "__main__":
    test_database() 