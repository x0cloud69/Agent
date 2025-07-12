from sqlalchemy import create_engine # type: ignore
from sqlalchemy.ext.declarative import declarative_base # type: ignore
from sqlalchemy.orm import sessionmaker # type: ignore
from dotenv import load_dotenv # type: ignore
import os
from pathlib import Path

# 프로젝트 루트 경로 찾기 (backend 폴더의 상위)
project_root = Path(__file__).parent.parent
env_path = project_root / ".env"

# 환경 변수 로드 (프로젝트 루트의 .env 파일)
load_dotenv(env_path)

# 데이터베이스 URL (환경 변수에서 가져오거나 기본값 사용)
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:1234@localhost:5432/postgres"
)

# 인코딩 문제 해결을 위한 추가 설정
if "?" not in DATABASE_URL:
    DATABASE_URL += "?client_encoding=utf8"

# SQLAlchemy 엔진 생성 (인코딩 설정 추가)
engine = create_engine(
    DATABASE_URL,
    connect_args={"options": "-c client_encoding=utf8"}
)

# 세션 팩토리 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base 클래스 생성 (모델들이 상속받을 클래스)
Base = declarative_base()

# 데이터베이스 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 