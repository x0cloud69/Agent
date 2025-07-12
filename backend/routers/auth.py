from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import auth
import uuid
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """로그인하여 액세스 토큰 발급"""
    # form_data.username 형식: "company_id:talency_id:user_id"
    try:
        credentials = form_data.username.split(":")
        if len(credentials) != 3:
            raise ValueError("Invalid credentials format")
        
        company_id, talency_id, user_id = credentials
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid credentials format. Use 'company_id:talency_id:user_id'"
        )
    
    user = auth.authenticate_user(db, company_id, talency_id, user_id, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect credentials or account is locked/inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 로그인 성공 시 로그인 실패 횟수 초기화 및 최종 로그인 시간 업데이트
    user.login_fail_cnt = 0
    user.last_login_dt = datetime.now()
    db.commit()
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={
            "sub": user.user_id,
            "talency_id": user.talency_id,
            "company_id": user.company_id
        }, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """사용자 회원가입"""
    # 복합키 중복 확인
    existing_user = db.query(models.User).filter(
        models.User.company_id == user.company_id,
        models.User.talency_id == user.talency_id,
        models.User.user_id == user.user_id
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=400, 
            detail="User already exists with this company_id, talency_id, and user_id"
        )
    
    # 비밀번호 해싱
    hashed_password = auth.get_password_hash(user.password)
    
    # 새 사용자 생성
    db_user = models.User(
        user_id=user.user_id,
        talency_id=user.talency_id,
        company_id=user.company_id,
        employee_no=user.employee_no,
        password=hashed_password,
        user_name=user.user_name,
        email=user.email,
        mobile=user.mobile,
        description=user.description,
        user_level=user.user_level or "USER",
        is_admin="N",
        use_yn="Y",
        account_lock_yn="N",
        login_fail_cnt=0,
        login_fail_max=5,
        password_change_cycle=90,
        temp_password=False,
        created_at=datetime.now(),
        created_by=user.user_id
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user 