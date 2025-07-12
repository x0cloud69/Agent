import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# 환경 변수 설정 (인코딩 설정 추가)
os.environ["DATABASE_URL"] = "postgresql://postgres:1234@localhost:5432/agent_db?client_encoding=utf8"

def test_database_connection():
    """데이터베이스 연결 테스트"""
    try:
        # 데이터베이스 엔진 생성
        engine = create_engine(os.environ["DATABASE_URL"])
        
        # 연결 테스트
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ 데이터베이스 연결 성공!")
            
            # 데이터베이스 정보 확인
            result = connection.execute(text("SELECT current_database(), current_user"))
            db_info = result.fetchone()
            print(f"📊 데이터베이스: {db_info[0]}")
            print(f"👤 사용자: {db_info[1]}")
            
    except Exception as e:
        print(f"❌ 데이터베이스 연결 실패: {e}")
        return False
    
    return True

if __name__ == "__main__":
    test_database_connection() 