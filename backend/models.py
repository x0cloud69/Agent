from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Date
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "tb_auth_user"
    
    # 복합 기본키 (company_id, talency_id, user_id)
    user_id = Column(String(50), primary_key=True)
    talency_id = Column(String(20), primary_key=True)
    company_id = Column(String(20), primary_key=True)
    
    # 기본 정보
    employee_no = Column(String(20), nullable=True)
    password = Column(String(200), nullable=False)
    user_name = Column(String(100), nullable=True)
    email = Column(String(100), nullable=True)
    mobile = Column(String(20), nullable=True)
    description = Column(Text, nullable=True)
    
    # 계정 유효기간
    valid_start_date = Column(Date, nullable=True)
    valid_end_date = Column(Date, nullable=True)
    
    # 비밀번호 관련
    password_upd_dt = Column(DateTime, nullable=True)
    password_next_upd_dt = Column(DateTime, nullable=True)
    password_change_cycle = Column(Integer, default=90, nullable=True)
    password_history = Column(Text, nullable=True)
    temp_password = Column(Boolean, default=False, nullable=True)
    
    # 사용자 권한
    user_level = Column(String(20), nullable=True)  # SYSTEM/ADMIN/USER
    is_admin = Column(String(1), default='N', nullable=True)
    
    # 로그인 관련
    last_login_dt = Column(DateTime, nullable=True)
    login_fail_cnt = Column(Integer, default=0, nullable=True)
    login_fail_max = Column(Integer, default=5, nullable=True)
    
    # 계정 잠금 관련
    account_lock_yn = Column(String(1), default='N', nullable=True)
    account_lock_dt = Column(DateTime, nullable=True)
    account_lock_reason = Column(String(200), nullable=True)
    
    # 사용 여부
    use_yn = Column(String(1), default='Y', nullable=True)
    
    # 생성/수정 정보
    created_at = Column(DateTime, server_default=func.current_timestamp(), nullable=True)
    created_by = Column(String(50), nullable=True)
    updated_at = Column(DateTime, nullable=True)
    updated_by = Column(String(50), nullable=True)
    
 

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    author_id = Column(String(50), nullable=False)  # user_id와 연결
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 