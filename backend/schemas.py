from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, date

# User 스키마 (새로운 테이블 구조에 맞게 수정)
class UserBase(BaseModel):
    user_id: str
    talency_id: str
    company_id: str
    employee_no: Optional[str] = None
    user_name: Optional[str] = None
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    description: Optional[str] = None
    user_level: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    employee_no: Optional[str] = None
    user_name: Optional[str] = None
    email: Optional[EmailStr] = None
    mobile: Optional[str] = None
    description: Optional[str] = None
    password: Optional[str] = None
    user_level: Optional[str] = None
    valid_start_date: Optional[date] = None
    valid_end_date: Optional[date] = None

class User(UserBase):
    # 기본키
    user_id: str
    talency_id: str
    company_id: str
    
    # 기본 정보
    employee_no: Optional[str] = None
    user_name: Optional[str] = None
    email: Optional[str] = None
    mobile: Optional[str] = None
    description: Optional[str] = None
    
    # 계정 유효기간
    valid_start_date: Optional[date] = None
    valid_end_date: Optional[date] = None
    
    # 비밀번호 관련
    password_upd_dt: Optional[datetime] = None
    password_next_upd_dt: Optional[datetime] = None
    password_change_cycle: Optional[int] = 90
    temp_password: Optional[bool] = False
    
    # 사용자 권한
    user_level: Optional[str] = None
    is_admin: Optional[str] = 'N'
    
    # 로그인 관련
    last_login_dt: Optional[datetime] = None
    login_fail_cnt: Optional[int] = 0
    login_fail_max: Optional[int] = 5
    
    # 계정 잠금 관련
    account_lock_yn: Optional[str] = 'N'
    account_lock_dt: Optional[datetime] = None
    account_lock_reason: Optional[str] = None
    
    # 사용 여부
    use_yn: Optional[str] = 'Y'
    
    # 생성/수정 정보
    created_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_at: Optional[datetime] = None
    updated_by: Optional[str] = None
    
    class Config:
        from_attributes = True

# Post 스키마
class PostBase(BaseModel):
    title: str
    content: str
    is_published: bool = False

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_published: Optional[bool] = None

class Post(PostBase):
    id: int
    author_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Token 스키마
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
    talency_id: Optional[str] = None
    company_id: Optional[str] = None 