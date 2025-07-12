from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import os
import uuid

# 보안 설정
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 비밀번호 해싱
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 스키마
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """비밀번호 검증"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """비밀번호 해싱"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """JWT 액세스 토큰 생성"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(db: Session, company_id: str, talency_id: str, user_id: str, password: str):
    """사용자 인증 (복합키 사용)"""
    user = db.query(models.User).filter(
        models.User.company_id == company_id,
        models.User.talency_id == talency_id,
        models.User.user_id == user_id
    ).first()
    
    if not user:
        return False
    
    if not verify_password(password, user.password):
        return False
    
    # 계정 잠금 확인
    if user.account_lock_yn == 'Y':
        return False
    
    # 사용 여부 확인
    if user.use_yn != 'Y':
        return False
    
    # 계정 유효기간 확인
    today = datetime.now().date()
    if user.valid_start_date and user.valid_start_date > today:
        return False
    if user.valid_end_date and user.valid_end_date < today:
        return False
    
    return user

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """현재 사용자 가져오기"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        talency_id: str = payload.get("talency_id")
        company_id: str = payload.get("company_id")
        
        if user_id is None or talency_id is None or company_id is None:
            raise credentials_exception
            
        token_data = schemas.TokenData(
            user_id=user_id,
            talency_id=talency_id,
            company_id=company_id
        )
    except JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(
        models.User.company_id == token_data.company_id,
        models.User.talency_id == token_data.talency_id,
        models.User.user_id == token_data.user_id
    ).first()
    
    if user is None:
        raise credentials_exception
    return user

def get_current_active_user(current_user: models.User = Depends(get_current_user)):
    """현재 활성 사용자 가져오기"""
    if current_user.use_yn != 'Y':
        raise HTTPException(status_code=400, detail="Inactive user")
    if current_user.account_lock_yn == 'Y':
        raise HTTPException(status_code=400, detail="Account is locked")
    return current_user 